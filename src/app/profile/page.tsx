
"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useUser, useFirestore, useDoc } from "@/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Settings, Sparkles, Map, Target, Pencil, Check, RefreshCcw, Book, Star, Activity, Camera, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { HeaderNav } from "@/components/shared/header-nav"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function Profile() {
  const { user, loading: userLoading } = useUser()
  const firestore = useFirestore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const userStatsRef = useMemo(() => 
    user && firestore ? doc(firestore, "users", user.uid) : null, 
    [user, firestore]
  )
  const { data: userStats, loading: statsLoading } = useDoc(userStatsRef)

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    avatarSeed: "1",
    photoURL: ""
  })

  useEffect(() => {
    if (userStats) {
      setFormData({
        displayName: userStats.displayName || user?.displayName || "Scholar",
        bio: userStats.bio || "Optimizing cognitive velocity...",
        avatarSeed: userStats.avatarSeed || user?.uid?.slice(0, 3) || "1",
        photoURL: userStats.photoURL || ""
      })
    }
  }, [userStats, user])

  const handleSave = () => {
    if (!userStatsRef) return
    setSaving(true)
    
    const dataToSave = {
      displayName: formData.displayName,
      bio: formData.bio,
      avatarSeed: formData.avatarSeed,
      photoURL: formData.photoURL,
      lastActive: serverTimestamp(),
    }

    setDoc(userStatsRef, dataToSave, { merge: true })
      .then(() => {
        setIsEditing(false)
        setSaving(false)
        toast({ title: "Profile Synced", description: "Your scholar identity has been updated." })
      })
      .catch((err) => {
        setSaving(false)
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userStatsRef.path,
          operation: 'update',
          requestResourceData: dataToSave
        }))
      })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit size to roughly 1MB for Firestore field compatibility
    if (file.size > 1024 * 1024) {
      toast({ 
        variant: "destructive", 
        title: "File Too Large", 
        description: "Please select an image smaller than 1MB for optimal performance." 
      })
      return
    }

    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFormData(prev => ({ ...prev, photoURL: base64String }))
      setUploading(false)
      
      // Auto-save the photo change
      if (userStatsRef) {
        setDoc(userStatsRef, { photoURL: base64String, lastActive: serverTimestamp() }, { merge: true })
          .catch(err => {
             errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: userStatsRef.path,
              operation: 'update'
            }))
          })
      }
      toast({ title: "Photo Updated", description: "Your profile picture has been synchronized." })
    }
    reader.readAsDataURL(file)
  }

  const triggerFilePicker = () => {
    fileInputRef.current?.click()
  }

  const cycleAvatar = () => {
    const nextSeed = Math.floor(Math.random() * 1000).toString()
    setFormData(prev => ({ ...prev, avatarSeed: nextSeed, photoURL: "" })) // Reset custom photo if cycling
  }

  const xp = userStats?.totalScore || 0
  const rank = xp >= 500 ? "Master" : xp >= 300 ? "Advanced" : xp >= 150 ? "Skilled" : xp >= 50 ? "Learner" : "Beginner"

  if (userLoading || statsLoading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-[#0A0714]">
        <RefreshCcw className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  const avatarUrl = formData.photoURL || `https://picsum.photos/seed/${formData.avatarSeed}/200`

  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <HeaderNav 
        title="Scholar Hub" 
        subtitle="Identity & Progression" 
        showBack={true} 
        info="Your centralized identity hub. Manage your scholar alias, track mastery levels, and customize your neural presence in the AuraFlow ecosystem."
      />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />

      {/* Hero Section */}
      <section className="flex flex-col items-center space-y-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-all duration-700" />
          <Avatar className="w-40 h-40 border-4 border-primary/20 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105">
            <AvatarImage src={avatarUrl} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-4xl">
              {formData.displayName?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          
          <div className="absolute -bottom-2 right-1/2 translate-x-1/2 flex gap-2 z-20">
            <button 
              onClick={cycleAvatar}
              title="Cycle Random Avatar"
              className="bg-primary text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-[#0A0714]"
            >
              <RefreshCcw className={cn("w-5 h-5", uploading && "animate-spin")} />
            </button>
            <button 
              onClick={triggerFilePicker}
              title="Upload from Device"
              className="bg-secondary text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-[#0A0714]"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute -top-2 -left-2 bg-primary text-white text-[10px] px-4 py-1.5 rounded-full font-black shadow-xl z-20 uppercase tracking-widest border-2 border-[#0A0714] animate-pulse">
            {rank}
          </div>
        </div>

        <div className="text-center space-y-4 w-full max-w-sm pt-4">
          {isEditing ? (
            <div className="space-y-3 animate-in slide-in-from-top-2">
              <Input 
                value={formData.displayName} 
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                placeholder="Scholar Alias"
                className="text-center text-2xl font-headline font-bold h-14 glass-panel border-primary/30"
              />
              <Textarea 
                value={formData.bio} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Define your bio..."
                className="text-center text-sm glass-panel border-white/5 min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-xl h-12 bg-primary hover:bg-primary/90">
                  {saving ? <RefreshCcw className="animate-spin mr-2" /> : <Check className="mr-2" />}
                  Save Sync
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 rounded-xl h-12 border-white/10">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <h2 className="text-4xl font-headline font-bold gradient-text">{formData.displayName}</h2>
                <p className="text-muted-foreground text-sm font-medium mt-1 italic opacity-80">{formData.bio}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="rounded-full bg-white/5 border border-white/10 px-6 hover:bg-primary/20 text-xs font-bold uppercase tracking-widest text-primary"
              >
                <Pencil className="w-3 h-3 mr-2" /> Edit Identity
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Mastery XP", value: xp, icon: Star, color: "text-yellow-500" },
          { label: "Quizzes", value: userStats?.quizzesCompleted || 0, icon: Target, color: "text-red-500" },
          { label: "Rank", value: rank, icon: Trophy, color: "text-primary" },
          { label: "Activity", value: "Current Streak", icon: Activity, color: "text-secondary" },
        ].map((stat, i) => (
          <Card key={i} className="glass-panel border-0 rounded-[2rem] p-6 text-center hover:bg-white/5 transition-all">
            <stat.icon className={cn("w-5 h-5 mx-auto mb-3", stat.color)} />
            <p className="text-2xl font-headline font-bold">{stat.value}</p>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Milestone Hall */}
        <section className="glass-panel p-8 rounded-[3rem] relative overflow-hidden group border-primary/10">
          <div className="absolute -right-8 -top-8 opacity-5 rotate-12">
            <Trophy className="w-48 h-48" />
          </div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="font-headline font-bold text-xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-500" /> Milestone Hall
            </h3>
            <Badge variant="outline" className="border-white/10 text-[9px]">Progression Unlocked</Badge>
          </div>
          <div className="grid grid-cols-4 gap-4 relative z-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className={cn(
                "aspect-square rounded-2xl flex items-center justify-center transition-all border",
                xp > (i * 50) ? "bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/20" : "bg-white/5 border-white/5 opacity-20"
              )}>
                {xp > (i * 50) ? <Book className="w-6 h-6" /> : <Star className="w-4 h-4" />}
              </div>
            ))}
          </div>
        </section>

        {/* Action Systems */}
        <section className="space-y-4">
          <Link href="/planner" className="block">
            <div className="glass-panel p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/5 transition-all group border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Strategy Map</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Daily Operations & Planning</p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          <Link href="/settings" className="block">
            <div className="glass-panel p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/5 transition-all group border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Hub Configurations</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">System & Privacy Toggles</p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          <Link href="/career" className="block">
            <div className="glass-panel p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/5 transition-all group border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                  <Map className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Future Trajectory</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Career Roadmaps & Resumes</p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </section>
      </div>
    </div>
  )
}
