"use client"

import { useState, useEffect, useMemo } from "react"
import { Progress } from "@/components/ui/progress"
import { 
  Flame, Star, Bell, Plus, CheckCircle2, Bot, Sparkles, 
  Map, Target, Sidebar as SidebarIcon, Zap, Loader2, 
  Trophy, ArrowUpRight, Calendar, Users, BrainCircuit
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import { useUser, useFirestore, useDoc } from "@/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const { user, loading: userLoading } = useUser()
  const firestore = useFirestore()
  const { toggleSidebar } = useSidebar()
  const [timerActive, setTimerActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1500) // 25 minutes in seconds

  // Memoize ref to prevent unnecessary re-renders
  const userStatsRef = useMemo(() => 
    user && firestore ? doc(firestore, "users", user.uid) : null, 
    [user, firestore]
  )
  const { data: userStats, loading: statsLoading } = useDoc(userStatsRef)

  // Initialize profile for first-time Google sign-ins
  useEffect(() => {
    if (user && !statsLoading && userStats === null && firestore) {
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

  // Timer logic
  useEffect(() => {
    let interval: any
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setTimerActive(false)
      // Logic for focus completion could go here (e.g., award 5 XP)
    }
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const xp = userStats?.totalScore || 0
  const rank = xp >= 500 ? "Master" : xp >= 300 ? "Advanced" : xp >= 150 ? "Skilled" : xp >= 50 ? "Learner" : "Beginner"

  const quickActions = [
    { title: "AI Solver", icon: Bot, href: "/tools/solver", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", desc: "Step-by-step help" },
    { title: "Smart Notes", icon: Sparkles, href: "/tools/summarizer", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", desc: "PDF Synthesizer" },
    { title: "Navigator", icon: Map, href: "/tools/roadmap", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", desc: "Career Strategy" },
    { title: "Battle Arena", icon: Trophy, href: "/tools/quiz", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", desc: "XP Training" },
  ]

  if (userLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0A0714]">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 md:pb-8">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden glass-panel rounded-xl h-10 w-10">
            <SidebarIcon className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
               <h1 className="text-3xl font-headline font-bold gradient-text tracking-tighter">AuraFlow</h1>
               <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase">v2.0 Beta</Badge>
            </div>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em]">Command Center • {user?.displayName || "Scholar"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/tools/quiz/leaderboard" className="hidden sm:flex">
             <div className="glass-panel rounded-2xl px-4 py-2 flex items-center gap-3 border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all cursor-pointer">
              <Users className="w-4 h-4 text-yellow-500" />
              <div className="text-left">
                <p className="text-[8px] uppercase font-bold text-muted-foreground leading-none mb-1">Global Rank</p>
                <p className="text-xs font-bold">Top 5%</p>
              </div>
            </div>
          </Link>
          <div className="glass-panel rounded-2xl px-4 py-2 flex items-center gap-3 border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-all">
            <Flame className="w-4 h-4 text-orange-500" />
            <div className="text-left">
              <p className="text-[8px] uppercase font-bold text-muted-foreground leading-none mb-1">Streak</p>
              <p className="text-xs font-bold">3 Days</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-2xl glass-panel relative h-10 w-10">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progression & Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* XP & Rank Card */}
          <section className="glass-panel p-8 rounded-[3rem] relative overflow-hidden group border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 shadow-2xl">
            <div className="absolute -right-8 -top-8 w-48 h-48 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-500" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scholar Standing</span>
                </div>
                <h2 className="text-4xl font-headline font-bold flex items-center gap-3">
                  {rank}
                  <ArrowUpRight className="w-6 h-6 text-primary animate-bounce-slow" />
                </h2>
                <p className="text-sm text-muted-foreground font-medium italic">"Your trajectory is aiming for Master level by next week."</p>
              </div>
              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-xs font-bold text-primary px-1">
                  <span>{xp} XP Gained</span>
                  <span>Goal: 500 XP</span>
                </div>
                <Progress value={Math.min(100, (xp / 500) * 100)} className="h-3 bg-white/5" />
                <p className="text-[9px] text-right font-bold text-muted-foreground uppercase tracking-wider">Level Progress: {Math.round((xp / 500) * 100)}%</p>
              </div>
            </div>
          </section>

          {/* Quick Arsenal Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" /> Study Arsenal
              </h3>
              <Link href="/tools" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">View All Tools</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href} className="group">
                  <div className={cn(
                    "w-full p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center transition-all group-hover:translate-y-[-6px] group-active:scale-95 border-2 shadow-xl h-full",
                    action.color
                  )}>
                    <div className="bg-white/5 p-3 rounded-2xl mb-4 group-hover:bg-white/10 transition-colors">
                       <action.icon className="w-8 h-8 transition-transform group-hover:scale-110" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest mb-1">{action.title}</p>
                    <p className="text-[9px] opacity-60 font-medium">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Strategic Tasks */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Strategic Focus
              </h3>
              <Link href="/planner" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Full Schedule</Link>
            </div>
            <div className="grid gap-3">
              {[
                { title: "Core Concept Recall", time: "Morning Slot", type: "Active Study", done: xp > 0, icon: BrainCircuit },
                { title: "Portfolio Project Audit", time: "Pending", type: "Career", done: xp > 300, icon: Sparkles },
                { title: "Daily Battle Challenge", time: "High Yield", type: "Training", done: false, icon: Trophy },
              ].map((task, i) => (
                <div key={i} className="glass-panel p-5 rounded-[2rem] flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer hover:bg-white/5 border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-md",
                      task.done ? "bg-green-500/10 text-green-500" : "bg-white/5 text-muted-foreground"
                    )}>
                      {task.done ? <CheckCircle2 className="w-6 h-6" /> : <task.icon className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className={cn("font-bold text-base transition-all", task.done && "line-through opacity-40")}>{task.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{task.time} • {task.type}</p>
                    </div>
                  </div>
                  {!task.done && <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/10"><Plus className="w-4 h-4" /></Button>}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Focus Zone & Insights */}
        <div className="space-y-8">
          {/* Deep Focus Timer */}
          <section className={cn(
            "p-8 rounded-[3.5rem] relative overflow-hidden flex flex-col justify-between h-80 transition-all duration-700 border shadow-2xl group",
            timerActive ? "bg-primary/20 border-primary/50 shadow-primary/40" : "glass-panel border-white/10"
          )}>
            <div className={cn(
              "absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity",
              timerActive && "opacity-100"
            )} />
            <Zap className={cn("absolute -right-8 -top-8 w-40 h-40 rotate-12 transition-all", timerActive ? "text-primary/30 scale-110 animate-pulse" : "text-white/5")} />
            
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-4 flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary" /> Deep Focus Zone
              </p>
              <div className="flex flex-col items-center">
                 <h2 className="text-6xl font-headline font-bold tracking-tighter tabular-nums mb-2">
                   {formatTime(timeLeft)}
                 </h2>
                 <p className="text-xs font-bold text-primary/80 uppercase tracking-widest">{timerActive ? "Locked In" : "Ready to focus?"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
               <Button 
                variant={timerActive ? "destructive" : "default"}
                className={cn(
                  "rounded-2xl font-bold h-12 shadow-lg transition-all active:scale-95",
                  !timerActive && "bg-primary hover:bg-primary/90"
                )}
                onClick={() => setTimerActive(!timerActive)}
              >
                {timerActive ? "Break Flow" : "Start Flow"}
              </Button>
              <Button 
                variant="outline"
                className="rounded-2xl font-bold h-12 border-white/10 hover:bg-white/5"
                onClick={() => { setTimerActive(false); setTimeLeft(1500); }}
              >
                Reset
              </Button>
            </div>
          </section>

          {/* AI Companion Card */}
          <section className="glass-panel p-8 rounded-[3.5rem] border border-white/5 bg-gradient-to-br from-secondary/10 via-transparent to-transparent relative overflow-hidden group shadow-2xl">
             <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-secondary/5 blur-[50px]" />
             <div className="space-y-6 relative z-10">
               <div className="flex items-center gap-3">
                 <div className="bg-primary/20 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(140,106,255,0.2)]">
                   <Bot className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                   <h4 className="font-headline font-bold text-lg leading-none">Aura AI Tutor</h4>
                   <p className="text-[9px] text-green-400 font-bold uppercase mt-1 flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Live Now
                   </p>
                 </div>
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 {xp === 0 ? (
                    "Greetings. To calibrate your rank, I recommend initiating an <span class='text-primary font-bold'>Adaptive Training Session</span> in the Battle Arena."
                 ) : (
                   "Optimal performance window detected. Your speed in the last quiz was <span class='text-white font-bold tracking-tighter'>Elite</span>. Time to level up?"
                 )}
               </p>
               <Link href="/tools/quiz" className="block">
                 <Button className="w-full rounded-2xl h-12 font-bold bg-white text-black hover:bg-white/90 gap-2 text-[11px] uppercase tracking-widest transition-all hover:translate-y-[-2px]">
                   Calibrate Rank <ArrowUpRight className="w-4 h-4" />
                 </Button>
               </Link>
             </div>
          </section>

          {/* Calendar Mini View */}
          <section className="glass-panel p-6 rounded-[2.5rem] border border-white/5 bg-black/20">
             <div className="flex items-center justify-between mb-4 px-1">
               <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-muted-foreground" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today's Timeline</h4>
               </div>
               <Badge variant="outline" className="text-[8px] h-4 border-white/10 opacity-60">Mar 15</Badge>
             </div>
             <div className="space-y-4">
               {[
                 { label: "Morning Sprint", status: "Completed", color: "bg-green-500" },
                 { label: "Doubt Solver Session", status: "Next", color: "bg-primary" },
                 { label: "Project Grind", status: "Upcoming", color: "bg-muted" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 group cursor-default">
                    <div className={cn("w-1.5 h-1.5 rounded-full", item.color)} />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground/90">{item.label}</p>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{item.status}</p>
                    </div>
                 </div>
               ))}
             </div>
          </section>
        </div>
      </div>
    </div>
  )
}
