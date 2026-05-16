
"use client"

import { useState, useEffect, useMemo } from "react"
import { Progress } from "@/components/ui/progress"
import { 
  Flame, Bell, Plus, CheckCircle2, Bot, Sparkles, 
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
  const [timeLeft, setTimeLeft] = useState(1500)

  const userStatsRef = useMemo(() => 
    user && firestore ? doc(firestore, "users", user.uid) : null, 
    [user, firestore]
  )
  const { data: userStats, loading: statsLoading } = useDoc(userStatsRef)

  // Auto-initialize or update user stats on dashboard load
  useEffect(() => {
    if (user && !statsLoading && firestore) {
      const statsRef = doc(firestore, "users", user.uid)
      // We use setDoc with merge to either create or just update the last active timestamp
      setDoc(statsRef, {
        uid: user.uid,
        displayName: user.displayName || "Elite Scholar",
        photoURL: user.photoURL || "",
        // Only set these if they don't exist to avoid resetting score on every load
        ...(userStats === null && {
          totalScore: 0,
          level: "Beginner",
          quizzesCompleted: 0,
        }),
        lastActive: serverTimestamp(),
      }, { merge: true })
    }
  }, [user, userStats, statsLoading, firestore])

  useEffect(() => {
    let interval: any
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setTimerActive(false)
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
    <div className="min-h-full p-4 md:p-8 max-w-6xl mx-auto space-y-12 pb-20 md:pb-8">
      {/* Header with entrance animation */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden glass-panel rounded-xl h-10 w-10">
            <SidebarIcon className="w-5 h-5" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
               <h1 className="text-4xl font-headline font-bold gradient-text tracking-tighter">AuraFlow</h1>
               <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-3">v2.1 Live</Badge>
            </div>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.3em] opacity-60">Command Center • {user?.displayName || "Scholar"}</p>
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
        {/* Main Progression & Actions */}
        <div className="lg:col-span-2 space-y-12">
          {/* XP & Rank Card */}
          <section className="animate-in fade-in slide-in-from-left-8 duration-700 [animation-delay:200ms]">
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
                      ? "System initialized. Complete your first training module to analyze velocity." 
                      : "Optimal study velocity detected. Trajectory aims for Grandmaster tier."}
                  </p>
                </div>
                <div className="w-full md:w-72 space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-primary px-2 uppercase tracking-widest">
                    <span>{xp} XP Earned</span>
                    <span>Goal: 500 XP</span>
                  </div>
                  <Progress value={Math.min(100, (xp / 500) * 100)} className="h-4 bg-white/5 border border-white/5 shadow-inner" />
                  <div className="flex justify-between items-center px-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency: {Math.round((xp / 500) * 100)}%</p>
                    <Badge variant="outline" className="text-[8px] py-0 border-white/10 opacity-60">Exp. 4h</Badge>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Arsenal Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-headline font-bold flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-primary" /> Study Arsenal
              </h3>
              <Link href="/tools" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-[0.2em] opacity-80">View All Systems</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href} className={cn(
                  "group animate-in fade-in zoom-in-95 duration-500",
                  i === 0 && "[animation-delay:400ms]",
                  i === 1 && "[animation-delay:500ms]",
                  i === 2 && "[animation-delay:600ms]",
                  i === 3 && "[animation-delay:700ms]"
                )}>
                  <div className={cn(
                    "w-full p-8 rounded-[3rem] flex flex-col items-center justify-center text-center transition-all group-hover:translate-y-[-8px] group-active:scale-95 border-2 shadow-xl h-full relative overflow-hidden",
                    action.color
                  )}>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="bg-white/5 p-4 rounded-2xl mb-5 group-hover:bg-white/10 transition-all group-hover:scale-110 shadow-lg relative z-10">
                       <action.icon className="w-8 h-8" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">{action.title}</p>
                    <p className="text-[9px] opacity-60 font-bold uppercase tracking-widest relative z-10">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Strategic Tasks */}
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 [animation-delay:800ms]">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-headline font-bold flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" /> Strategic Focus
              </h3>
              <Link href="/planner" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-[0.2em]">Full Operations Map</Link>
            </div>
            <div className="grid gap-4">
              {[
                { title: "Core Concept Recall", time: "Morning Slot", type: "Active Study", done: xp > 0, icon: BrainCircuit },
                { title: "Portfolio Project Audit", time: "Pending", type: "Career", done: xp > 300, icon: Sparkles },
                { title: "Daily Battle Challenge", time: "High Yield", type: "Training", done: false, icon: Trophy },
              ].map((task, i) => (
                <div key={i} className="glass-panel p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer hover:bg-white/5 border border-white/5 active:scale-[0.99]">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl group-hover:rotate-6",
                      task.done ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-white/5 text-muted-foreground border border-white/10"
                    )}>
                      {task.done ? <CheckCircle2 className="w-7 h-7" /> : <task.icon className="w-7 h-7" />}
                    </div>
                    <div>
                      <h4 className={cn("font-bold text-lg transition-all tracking-tight", task.done && "line-through opacity-40")}>{task.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1.5">{task.time} • {task.type}</p>
                    </div>
                  </div>
                  {!task.done && <Button size="icon" variant="ghost" className="rounded-2xl hover:bg-white/10 h-12 w-12"><Plus className="w-5 h-5" /></Button>}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Focus Zone & Insights */}
        <div className="space-y-10">
          {/* Deep Focus Timer */}
          <section className={cn(
            "p-10 rounded-[4rem] relative overflow-hidden flex flex-col justify-between h-96 transition-all duration-1000 border shadow-[0_20px_50px_rgba(140,106,255,0.15)] group animate-in fade-in zoom-in-95 [animation-delay:400ms]",
            timerActive ? "bg-primary/20 border-primary/50 shadow-primary/40" : "glass-panel border-white/10"
          )}>
            <div className={cn(
              "absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 transition-opacity duration-1000",
              timerActive && "opacity-100"
            )} />
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
                className={cn(
                  "rounded-[1.5rem] font-bold h-16 shadow-2xl transition-all active:scale-95 text-xs uppercase tracking-widest",
                  !timerActive && "bg-primary hover:bg-primary/90 text-white"
                )}
                onClick={() => setTimerActive(!timerActive)}
              >
                {timerActive ? "Abort Flow" : "Launch Sync"}
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

          {/* AI Companion Card */}
          <section className="glass-panel p-10 rounded-[3.5rem] border border-white/5 bg-gradient-to-br from-secondary/10 via-transparent to-transparent relative overflow-hidden group shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000 [animation-delay:600ms]">
             <div className="absolute -right-4 -bottom-4 w-48 h-48 bg-secondary/5 blur-[70px] group-hover:bg-secondary/10 transition-all duration-700" />
             <div className="space-y-8 relative z-10">
               <div className="flex items-center gap-4">
                 <div className="bg-primary/20 p-3.5 rounded-2xl shadow-[0_0_30px_rgba(140,106,255,0.3)] group-hover:scale-110 transition-transform">
                   <Bot className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <h4 className="font-headline font-bold text-xl leading-none tracking-tight">Aura Intel</h4>
                   <p className="text-[9px] text-green-400 font-bold uppercase mt-2 flex items-center gap-2 tracking-widest">
                     <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" /> Neural Live
                   </p>
                 </div>
               </div>
               <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                 {xp === 0 ? (
                    "Welcome back. System is at 0% calibration. Complete a <span class='text-primary font-bold'>Battle Arena session</span> to initialize your skill profile."
                 ) : (
                   "Cognitive peak detected. Your accuracy in the last module was <span class='text-white font-bold tracking-tighter'>92nd percentile</span>. Maintain momentum."
                 )}
               </p>
               <Link href="/tools/quiz" className="block">
                 <Button className="w-full rounded-[1.5rem] h-14 font-black bg-white text-black hover:bg-white/90 gap-3 text-[10px] uppercase tracking-[0.2em] transition-all hover:translate-y-[-4px] shadow-xl">
                   Calibrate Rank <ArrowUpRight className="w-5 h-5" />
                 </Button>
               </Link>
             </div>
          </section>

          {/* Calendar Mini View */}
          <section className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-black/30 animate-in fade-in slide-in-from-bottom-8 duration-1000 [animation-delay:800ms]">
             <div className="flex items-center justify-between mb-6 px-1">
               <div className="flex items-center gap-3">
                 <Calendar className="w-5 h-5 text-muted-foreground opacity-60" />
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">Operations Timeline</h4>
               </div>
               <Badge variant="outline" className="text-[9px] h-5 border-white/10 opacity-40 font-black px-3">
                 {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
               </Badge>
             </div>
             <div className="space-y-5">
               {[
                 { label: "Deep Focus Sprint", status: xp > 0 ? "Completed" : "Pending", color: xp > 0 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-white/10" },
                 { label: "AI Intel Analysis", status: "Active", color: "bg-primary shadow-[0_0_10px_rgba(140,106,255,0.3)] animate-pulse" },
                 { label: "Strategic Grind", status: "Queue", color: "bg-white/10" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-5 group cursor-default p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className={cn("w-2 h-2 rounded-full", item.color)} />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground/90 tracking-tight">{item.label}</p>
                      <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1 opacity-60">{item.status}</p>
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
