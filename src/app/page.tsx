"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Progress } from "@/components/ui/progress"
import { 
  Flame, Bell, Bot, Sparkles, 
  Map, Trophy, ArrowUpRight, Users, BrainCircuit, Zap, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useDoc, useAuth } from "@/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { signInAnonymously } from "firebase/auth"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { user, loading: userLoading } = useUser()
  const auth = useAuth()
  const firestore = useFirestore()
  
  const [timerActive, setTimerActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1500)

  // Auto-initialization with stable dependencies
  useEffect(() => {
    if (!userLoading && !user && auth) {
      signInAnonymously(auth).catch(err => {
        if (err.code !== 'auth/api-key-not-valid') {
          console.error("Silent sync error:", err)
        }
      })
    }
  }, [user, userLoading, auth])

  // Memoize document reference to prevent listener thrashing
  const userStatsRef = useMemo(() => 
    user && firestore ? doc(firestore, "users", user.uid) : null, 
    [user?.uid, firestore]
  )
  
  const { data: userStats, loading: statsLoading } = useDoc(userStatsRef)

  // Initial data setup - only runs once when stats are missing
  useEffect(() => {
    if (user && !statsLoading && firestore && userStats === null) {
      const statsRef = doc(firestore, "users", user.uid)
      setDoc(statsRef, {
        uid: user.uid,
        displayName: user.displayName || "Elite Scholar",
        photoURL: user.photoURL || "",
        totalScore: 0,
        level: "Beginner",
        quizzesCompleted: 0,
        lastActive: serverTimestamp(),
      }, { merge: true })
    }
  }, [user, userStats, statsLoading, firestore])

  // Optimized high-precision timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setTimerActive(false)
      toast({ title: "Focus Complete", description: "Flow session ended. Excellent discipline." })
    }
    return () => { if (interval) clearInterval(interval) }
  }, [timerActive, timeLeft])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const xp = userStats?.totalScore || 0
  const rank = useMemo(() => {
    if (xp >= 500) return "Master"
    if (xp >= 300) return "Advanced"
    if (xp >= 150) return "Skilled"
    if (xp >= 50) return "Learner"
    return "Beginner"
  }, [xp])

  const quickActions = [
    { title: "AI Solver", icon: Bot, href: "/tools/solver", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", desc: "Step-by-step help" },
    { title: "Smart Notes", icon: Sparkles, href: "/tools/summarizer", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", desc: "PDF Synthesizer" },
    { title: "Navigator", icon: Map, href: "/tools/roadmap", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", desc: "Career Strategy" },
    { title: "Battle Arena", icon: Trophy, href: "/tools/quiz", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", desc: "XP Training" },
  ]

  if (userLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0A0714]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 gpu-layer">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
               <h1 className="text-4xl font-headline font-bold gradient-text tracking-tighter">AuraFlow</h1>
               <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-3">Live</Badge>
            </div>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.3em] opacity-60">Command Center • {userStats?.displayName || "Scholar"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/tools/quiz/leaderboard" className="hidden sm:flex group">
             <div className="glass-panel rounded-[1.5rem] px-5 py-3 flex items-center gap-4 border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all cursor-pointer">
              <Users className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest leading-none mb-1">Global Standing</p>
                <p className="text-xs font-bold">{xp > 0 ? "Top 5% Elite" : "Unranked"}</p>
              </div>
            </div>
          </Link>
          <div className="glass-panel rounded-[1.5rem] px-5 py-3 flex items-center gap-4 border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-all">
            <Flame className="w-4 h-4 text-orange-500" />
            <div className="text-left">
              <p className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest leading-none mb-1">Scholar Streak</p>
              <p className="text-xs font-bold">{xp > 0 ? "3 Days" : "New Journey"}</p>
            </div>
          </div>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="rounded-2xl glass-panel relative h-12 w-12 hover:bg-primary/10">
              <Bell className="w-6 h-6" />
              {xp === 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-2 ring-background animate-pulse" />}
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <section className="animate-in slide-in-from-left-8 duration-700 gpu-layer">
            <div className="glass-panel p-10 rounded-[3.5rem] relative overflow-hidden group border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 shadow-2xl transition-all hover:border-primary/40">
              <div className="absolute -right-8 -top-8 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-xl">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Mastery Level</span>
                  </div>
                  <h2 className="text-5xl font-headline font-bold flex items-center gap-4 tracking-tighter">
                    {rank}
                    <ArrowUpRight className="w-8 h-8 text-primary animate-bounce-slow" />
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium italic opacity-80">
                    {xp === 0 
                      ? "System initialized. Complete a module to analyze your velocity." 
                      : "Optimal study velocity detected. Trajectory aims for Grandmaster tier."}
                  </p>
                </div>
                <div className="w-full md:w-72 space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-primary px-2 uppercase tracking-widest">
                    <span>{xp} XP Earned</span>
                    <span>Goal: 500 XP</span>
                  </div>
                  <Progress value={Math.min(100, (xp / 500) * 100)} className="h-4 bg-white/5 border border-white/5" />
                  <div className="flex justify-between items-center px-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency: {Math.round((xp / 500) * 100)}%</p>
                    <Badge variant="outline" className="text-[8px] py-0 border-white/10 opacity-60">Exp. 4h</Badge>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-200 gpu-layer">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-headline font-bold flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-primary" /> Study Arsenal
              </h3>
              <Link href="/tools" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-[0.2em] opacity-80">View All Systems</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href} className="group">
                  <div className={cn(
                    "w-full p-8 rounded-[3rem] flex flex-col items-center justify-center text-center transition-all group-hover:translate-y-[-8px] group-active:scale-95 border-2 shadow-xl h-full relative overflow-hidden gpu-layer",
                    action.color
                  )}>
                    <div className="bg-white/5 p-4 rounded-2xl mb-5 group-hover:scale-110 transition-all shadow-lg relative z-10">
                       <action.icon className="w-8 h-8" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">{action.title}</p>
                    <p className="text-[9px] opacity-60 font-bold uppercase tracking-widest relative z-10">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10 animate-in slide-in-from-right-8 duration-700 delay-300 gpu-layer">
          <section className={cn(
            "p-10 rounded-[4rem] relative overflow-hidden flex flex-col justify-between h-96 transition-all duration-1000 border shadow-2xl group gpu-layer",
            timerActive ? "bg-primary/20 border-primary/50" : "glass-panel border-white/10"
          )}>
            <Zap className={cn("absolute -right-12 -top-12 w-56 h-56 rotate-12 transition-all duration-1000", timerActive ? "text-primary/30 scale-110 animate-pulse" : "text-white/5")} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> Focus Zone
                </p>
                {timerActive && <Badge className="bg-primary text-white animate-pulse text-[8px] font-black border-0">LOCKED IN</Badge>}
              </div>
              <div className="flex flex-col items-center">
                 <h2 className="text-7xl font-headline font-bold tracking-tighter tabular-nums mb-3 drop-shadow-2xl">
                   {formatTime(timeLeft)}
                 </h2>
                 <p className="text-[10px] font-black text-primary/80 uppercase tracking-[0.3em]">{timerActive ? "Neural Sync Active" : "Initiate Flow State?"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
               <Button 
                variant={timerActive ? "destructive" : "default"}
                className={cn("rounded-[1.5rem] font-bold h-16 shadow-2xl transition-all active:scale-95 text-xs uppercase tracking-widest", !timerActive && "bg-primary text-white")}
                onClick={() => setTimerActive(!timerActive)}
              >
                {timerActive ? "Abort Sync" : "Launch Sync"}
              </Button>
              <Button 
                variant="outline"
                className="rounded-[1.5rem] font-bold h-16 border-white/10 hover:bg-white/5 text-xs uppercase tracking-widest"
                onClick={() => { setTimerActive(false); setTimeLeft(1500); }}
              >
                Reset
              </Button>
            </div>
          </section>

          <section className="glass-panel p-10 rounded-[3.5rem] border border-white/5 bg-gradient-to-br from-secondary/10 via-transparent to-transparent relative overflow-hidden group shadow-2xl gpu-layer">
             <div className="space-y-8 relative z-10">
               <div className="flex items-center gap-4">
                 <div className="bg-primary/20 p-3.5 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                   <Bot className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <h4 className="font-headline font-bold text-xl leading-none tracking-tight">Aura Intel</h4>
                   <p className="text-[9px] text-green-400 font-bold uppercase mt-2 flex items-center gap-2 tracking-widest">
                     <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Neural Live
                   </p>
                 </div>
               </div>
               <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                 {xp === 0 ? (
                    "Welcome scholar. Your profile is at <span class='text-primary font-bold'>0% calibration</span>. Complete a quiz to define your trajectory."
                 ) : (
                   "Cognitive peak detected. Your performance is in the <span class='text-white font-bold tracking-tighter'>92nd percentile</span>. Maintain momentum."
                 )}
               </p>
               <Link href="/tools/quiz" className="block">
                 <Button className="w-full rounded-[1.5rem] h-14 font-black bg-white text-black hover:bg-white/90 gap-3 text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl">
                   Calibrate Mastery <ArrowUpRight className="w-5 h-5" />
                 </Button>
               </Link>
             </div>
          </section>
        </div>
      </div>
    </div>
  )
}
