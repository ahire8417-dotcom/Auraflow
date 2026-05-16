
"use client"

import { useState, useMemo } from "react"
import { useUser, useFirestore, useDoc } from "@/firebase"
import { doc, setDoc } from "firebase/firestore"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Bell, 
  Shield, 
  Zap, 
  Target, 
  Loader2, 
  Check, 
  Sparkles,
  Smartphone,
  Mail,
  Eye,
  Activity
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { user, loading: userLoading } = useUser()
  const firestore = useFirestore()
  const [saving, setSaving] = useState(false)

  const userStatsRef = useMemo(() => 
    user && firestore ? doc(firestore, "users", user.uid) : null, 
    [user, firestore]
  )
  const { data: userStats, loading: statsLoading } = useDoc(userStatsRef)

  const [displayName, setDisplayName] = useState("")
  
  // Local state for toggles (mocking for UI)
  const [notifs, setNotifs] = useState({ push: true, email: false, streak: true })
  const [privacy, setPrivacy] = useState({ public: true, showRank: true })
  const [dailyHours, setDailyHours] = useState([4])

  // Sync initial data
  useMemo(() => {
    if (userStats) {
      setDisplayName(userStats.displayName || "")
    }
  }, [userStats])

  const handleSaveAccount = async () => {
    if (!userStatsRef) return
    setSaving(true)
    try {
      await setDoc(userStatsRef, { displayName }, { merge: true })
      toast({
        title: "Settings Saved",
        description: "Your scholar profile has been updated.",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not sync changes to the cloud.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (userLoading || statsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HeaderNav title="Command Settings" subtitle="Configure your study hub" showBack={true} />

      <Tabs defaultValue="account" className="w-full space-y-8">
        <TabsList className="glass-panel h-14 w-full justify-start p-1 rounded-2xl border-white/5 bg-white/5">
          <TabsTrigger value="account" className="rounded-xl data-[state=active]:bg-primary font-bold text-xs gap-2">
            <User className="w-4 h-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="study" className="rounded-xl data-[state=active]:bg-primary font-bold text-xs gap-2">
            <Target className="w-4 h-4" /> Study Goals
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-primary font-bold text-xs gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-xl data-[state=active]:bg-primary font-bold text-xs gap-2">
            <Shield className="w-4 h-4" /> Privacy
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <Card className="glass-panel border-0 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Profile Identity
              </CardTitle>
              <CardDescription>Manage how you appear in the global scholar community.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Scholar Alias</Label>
                  <Input 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Quantum"
                    className="glass-panel h-12 rounded-xl border-white/5 bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Neural Email (Read Only)</Label>
                  <Input 
                    value={user?.email || ""} 
                    disabled
                    className="glass-panel h-12 rounded-xl border-white/5 bg-white/10 opacity-60"
                  />
                </div>
              </div>
              <Separator className="bg-white/5" />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveAccount} 
                  disabled={saving}
                  className="rounded-xl h-12 px-8 font-bold gap-2 shadow-lg shadow-primary/20"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Goals */}
        <TabsContent value="study" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <Card className="glass-panel border-0 rounded-[2.5rem]">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Performance Targets
              </CardTitle>
              <CardDescription>Define your daily intensity and study preferences.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-bold">Daily Study Commitment</Label>
                  <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-full text-xs">{dailyHours[0]} Hours</span>
                </div>
                <Slider 
                  value={dailyHours} 
                  onValueChange={setDailyHours} 
                  max={12} 
                  step={0.5} 
                  className="py-4"
                />
              </div>

              <div className="grid gap-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" /> Adaptive Difficulty
                    </p>
                    <p className="text-[10px] text-muted-foreground">AI adjusts quiz difficulty based on your speed.</p>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" /> Smart Note Synthesis
                    </p>
                    <p className="text-[10px] text-muted-foreground">Auto-generate flashcards for every upload.</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <Card className="glass-panel border-0 rounded-[2.5rem]">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Communication Channels
              </CardTitle>
              <CardDescription>How AuraFlow reaches you for critical alerts.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl"><Smartphone className="w-5 h-5 text-muted-foreground" /></div>
                    <div>
                      <p className="text-sm font-bold">Push Notifications</p>
                      <p className="text-[10px] text-muted-foreground">Immediate alerts on focus sessions & goals.</p>
                    </div>
                  </div>
                  <Switch checked={notifs.push} onCheckedChange={(v) => setNotifs({...notifs, push: v})} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl"><Mail className="w-5 h-5 text-muted-foreground" /></div>
                    <div>
                      <p className="text-sm font-bold">Email Digest</p>
                      <p className="text-[10px] text-muted-foreground">Weekly performance audit and study tips.</p>
                    </div>
                  </div>
                  <Switch checked={notifs.email} onCheckedChange={(v) => setNotifs({...notifs, email: v})} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl"><Zap className="w-5 h-5 text-primary" /></div>
                    <div>
                      <p className="text-sm font-bold">Streak Reminders</p>
                      <p className="text-[10px] text-muted-foreground">Protect your daily activity multiplier.</p>
                    </div>
                  </div>
                  <Switch checked={notifs.streak} onCheckedChange={(v) => setNotifs({...notifs, streak: v})} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <Card className="glass-panel border-0 rounded-[2.5rem]">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Security & Visibility
              </CardTitle>
              <CardDescription>Control your presence in the global Arena.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl"><Eye className="w-5 h-5 text-muted-foreground" /></div>
                    <div>
                      <p className="text-sm font-bold">Public Scholar Profile</p>
                      <p className="text-[10px] text-muted-foreground">Allow others to see your badges and achievements.</p>
                    </div>
                  </div>
                  <Switch checked={privacy.public} onCheckedChange={(v) => setPrivacy({...privacy, public: v})} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl"><Activity className="w-5 h-5 text-muted-foreground" /></div>
                    <div>
                      <p className="text-sm font-bold">Show Rank on Leaderboard</p>
                      <p className="text-[10px] text-muted-foreground">Display your current level in Global Arena.</p>
                    </div>
                  </div>
                  <Switch checked={privacy.showRank} onCheckedChange={(v) => setPrivacy({...privacy, showRank: v})} />
                </div>

                <Separator className="bg-white/5" />
                
                <div className="p-6 rounded-[2rem] bg-destructive/5 border border-destructive/20 space-y-4">
                   <h4 className="text-xs font-bold text-destructive uppercase tracking-widest">Danger Zone</h4>
                   <p className="text-[10px] text-muted-foreground leading-relaxed">Permanently delete your account and all study data. This action is irreversible.</p>
                   <Button variant="destructive" className="rounded-xl h-10 text-[10px] font-bold uppercase tracking-widest">
                     Request Data Deletion
                   </Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center pb-12">
        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.3em] opacity-40">
          AuraFlow OS v2.0.4 Build 882
        </p>
      </div>
    </div>
  )
}
