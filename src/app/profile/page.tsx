
"use client"

import { useEffect } from "react"
import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, Loader2, Sparkles, Map, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderNav } from "@/components/shared/header-nav"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function Profile() {
  const { user, loading } = useUser()
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/auth/login")
  }

  if (loading || !user) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <HeaderNav title="Scholar Profile" subtitle="Identity Hub" showBack={true} />

      <div className="flex flex-col items-center mb-10 space-y-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all duration-700" />
          <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105">
            <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200`} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl font-headline">
              {user.displayName?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] px-4 py-1.5 rounded-full font-black shadow-xl shadow-primary/30 z-20 uppercase tracking-widest border-2 border-[#0A0714]">
            MASTER
          </div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-headline font-bold gradient-text">{user.displayName || "Aura Scholar"}</h2>
          <p className="text-sm text-muted-foreground font-medium tracking-tight opacity-80">{user.email}</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-1.5 font-bold uppercase text-[9px] tracking-widest">Elite Tier</Badge>
          <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-6 py-1.5 font-bold uppercase text-[9px] tracking-widest">Beta Scholar</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Achievements Card */}
        <section className="glass-panel p-8 rounded-[3rem] relative overflow-hidden group border-primary/10 bg-primary/5">
          <div className="absolute -right-8 -top-8 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Trophy className="w-48 h-48" />
          </div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="font-headline font-bold text-lg">Milestone Hall</h3>
            </div>
            <Link href="/tools/quiz/leaderboard">
               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/20">
                 <Target className="w-5 h-5" />
               </Button>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-4 relative z-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center hover:bg-primary/10 transition-all cursor-pointer group/item hover:-translate-y-1">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  i === 1 ? "bg-primary/20 text-primary shadow-lg shadow-primary/20" : "bg-white/5 text-muted-foreground opacity-40"
                )}>
                  {i === 1 ? <Sparkles className="w-5 h-5" /> : i}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-6 text-center font-bold uppercase tracking-widest opacity-60">1 / 24 Strategist badges</p>
        </section>

        {/* Action Menu */}
        <section className="space-y-4">
          <Link href="/settings" className="block">
            <div className="glass-panel p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/5 transition-all group cursor-pointer active:scale-95 border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Hub Settings</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Configure your experience</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/career" className="block">
            <div className="glass-panel p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/5 transition-all group cursor-pointer active:scale-95 border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Map className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Career Roadmap</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Strategic trajectory</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Button 
            variant="ghost" 
            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive rounded-[2rem] h-16 flex items-center justify-between px-8 transition-all group border border-transparent hover:border-destructive/20"
            onClick={handleLogout}
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                 <LogOut className="w-6 h-6" />
              </div>
              <span className="font-bold text-base">Security Logout</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40" />
          </Button>
        </section>
      </div>
    </div>
  )
}
