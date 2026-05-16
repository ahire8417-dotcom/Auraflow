"use client"

import { useState, useEffect, useMemo } from "react"
import { Progress } from "@/components/ui/progress"
import { Flame, Star, Bell, Plus, CheckCircle2, Bot, Sparkles, Map, Target, Sidebar as SidebarIcon, Zap, Loader2, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import { useUser, useFirestore, useDoc } from "@/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

export default function Dashboard() {
  const { user, loading: userLoading } = useUser()
  const firestore = useFirestore()
  const { toggleSidebar } = useSidebar()
  const [timerActive, setTimerActive] = useState(false)

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

  const xp = userStats?.totalScore || 0
  const rank = xp >= 500 ? "Master" : xp >= 300 ? "Advanced" : xp >= 150 ? "Skilled" : xp >= 50 ? "Learner" : "Beginner"

  const quickActions = [
    { title: "AI Solver", icon: Bot, href: "/tools/solver", color: "bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-purple-500/10" },
    { title: "Smart Notes", icon: Sparkles, href: "/tools/summarizer", color: "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-blue-500/10" },
    { title: "Navigator", icon: Map, href: "/tools/roadmap", color: "bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-orange-500/10" },
    { title: "Battle Arena", icon: Trophy, href: "/tools/quiz", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/10" },
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
    <div className="min-h-full p-4 md:p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Top Navigation */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden glass-panel rounded-xl h-10 w-10">
            <SidebarIcon className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-headline font-bold gradient-text tracking-tight">AuraFlow</h1>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em]">Scholar Intel Command</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel rounded-2xl px-4 py-2 flex items-center gap-2 border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 transition-colors">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold">1 Day Streak</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-2xl glass-panel relative h-10 w-10">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </Button>
        </div>
      </header>

      <div className="grid gap-8">
        {/* Core Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="glass-panel p-6 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between h-52 border-primary/20 bg-primary/5 group transition-all hover:bg-primary/10 hover:scale-[1.02]">
            <Star className="absolute -right-6 -top-6 w-32 h-32 text-primary/10 rotate-12 transition-transform group-hover:scale-110" />
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2 flex items-center gap-2">
                <Trophy className="w-3 h-3 text-primary" /> Current Standing
              </p>
              <h2 className="text-3xl font-headline font-bold">{rank} Scholar</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-primary">
                <span>{xp} XP Gathered</span>
                <span>Next Rank: {xp < 50 ? "50" : xp < 150 ? "150" : xp < 300 ? "300" : "500"} XP</span>
              </div>
              <Progress value={Math.min(100, (xp / 500) * 100)} className="h-2.5 bg-white/5" />
            </div>
          </section>

          <section className={cn(
            "p-6 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between h-52 transition-all duration-700 border shadow-2xl",
            timerActive ? "bg-primary/20 border-primary/50 shadow-primary/30" : "glass-panel border-white/10"
          )}>
            <Zap className={cn("absolute -right-6 -top-6 w-32 h-32 rotate-12 transition-all", timerActive ? "text-primary/40 scale-110" : "text-white/5")} />
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Deep Focus Mode</p>
              <h2 className="text-4xl font-headline font-bold tabular-nums">{timerActive ? "24:59" : "Locked In?"}</h2>
            </div>
            <Button 
              size="lg" 
              className={cn(
                "w-full rounded-2xl font-bold h-12 transition-all active:scale-[0.98] shadow-lg", 
                timerActive ? "bg-destructive hover:bg-destructive/90 text-white" : "bg-white hover:bg-white/90 text-black"
              )}
              onClick={() => setTimerActive(!timerActive)}
            >
              {timerActive ? "Break Flow" : "Start Focus Timer (25m)"}
            </Button>
          </section>
        </div>

        {/* Quick Access Arsenal */}
        <section className="space-y-4">
          <h3 className="text-lg font-headline font-bold px-2 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" /> Study Arsenal
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href} className="group">
                <div className={cn(
                  "w-full aspect-square rounded-[2.5rem] flex flex-col items-center justify-center transition-all group-hover:translate-y-[-6px] group-active:scale-95 border-2 shadow-xl",
                  action.color
                )}>
                  <action.icon className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-[11px] font-bold uppercase tracking-widest">{action.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Priorities Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Strategic Focus
              </h3>
              <Link href="/planner" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Full Schedule</Link>
            </div>
            <div className="grid gap-4">
              {[
                { title: "Mastering Core Concepts", time: "Active Now", type: "Study", done: xp > 0 },
                { title: "Strategic Career Audit", time: "Pending", type: "Career", done: xp > 200 },
              ].map((task, i) => (
                <div key={i} className="glass-panel p-6 rounded-[2rem] flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer hover:bg-white/5">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md",
                      task.done ? "bg-green-500/10 text-green-500" : "bg-white/5 text-muted-foreground"
                    )}>
                      {task.done ? <CheckCircle2 className="w-7 h-7" /> : <Zap className="w-7 h-7" />}
                    </div>
                    <div>
                      <h4 className={cn("font-bold text-lg transition-all", task.done && "line-through opacity-40")}>{task.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{task.time} • {task.type}</p>
                    </div>
                  </div>
                  {!task.done && <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/10"><Plus className="w-4 h-4" /></Button>}
                </div>
              ))}
            </div>
          </section>

          {/* AI Insights Card */}
          <section className="relative overflow-hidden p-8 rounded-[3rem] bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 border border-white/5 h-fit shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-3 rounded-2xl shadow-[0_0_25px_rgba(140,106,255,0.4)] animate-pulse-glow">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-headline font-bold text-xl">Aura AI</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {xp === 0 ? (
                   "Greetings, Scholar. To initialize your rank and unlock the global arena, start your first <span class='text-primary font-bold'>Adaptive Training Session</span>."
                ) : (
                  "Your trajectory is <span class='text-white font-bold uppercase tracking-tighter'>Elite</span>. I've calculated your next peak focus window based on your recent Battle Arena results."
                )}
              </p>
              <Link href="/tools/quiz" className="block w-full">
                <Button size="sm" variant="outline" className="w-full rounded-2xl border-white/10 text-[10px] h-11 font-bold hover:bg-primary hover:text-white transition-all uppercase tracking-widest shadow-lg">
                  Initiate Training
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
