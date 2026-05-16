"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Flame, Star, Bell, Plus, CheckCircle2, Bot, Sparkles, Map, Target, Sidebar as SidebarIcon, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

export default function Dashboard() {
  const [streak] = useState(12)
  const [xp] = useState(1250)
  const [timerActive, setTimerActive] = useState(false)
  const { toggleSidebar } = useSidebar()

  const quickActions = [
    { title: "AI Solver", icon: Bot, href: "/tools/solver", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    { title: "Smart Notes", icon: Sparkles, href: "/tools/summarizer", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { title: "Navigator", icon: Map, href: "/tools/roadmap", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    { title: "Tools Hub", icon: Plus, href: "/tools", color: "bg-white/5 text-white border-white/10" },
  ]

  return (
    <div className="min-h-full p-4 md:p-8 max-w-5xl mx-auto space-y-10">
      {/* Top Navigation */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden glass-panel rounded-xl">
            <SidebarIcon className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-headline font-bold gradient-text tracking-tight">AuraFlow</h1>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em]">Command Center</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel rounded-2xl px-4 py-2 flex items-center gap-2 border-orange-500/30 bg-orange-500/5">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold">{streak} Day Streak</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-2xl glass-panel relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </Button>
        </div>
      </header>

      <div className="grid gap-8">
        {/* Core Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="glass-panel p-6 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between h-48 border-primary/20 bg-primary/5 group transition-all hover:bg-primary/10">
            <Star className="absolute -right-6 -top-6 w-28 h-28 text-primary/10 rotate-12 transition-transform group-hover:scale-110" />
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Academic Rank</p>
              <h2 className="text-2xl font-headline font-bold">Level 14 Elite</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-primary">
                <span>{xp} XP Earned</span>
                <span>Next Goal: 1500 XP</span>
              </div>
              <Progress value={83} className="h-2 bg-white/5" />
            </div>
          </section>

          <section className={cn(
            "p-6 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between h-48 transition-all duration-700 border shadow-2xl",
            timerActive ? "bg-primary/20 border-primary/50 shadow-primary/20" : "glass-panel border-white/10"
          )}>
            <Zap className={cn("absolute -right-6 -top-6 w-28 h-28 rotate-12 transition-all", timerActive ? "text-primary/40 scale-110" : "text-white/5")} />
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Deep Work Session</p>
              <h2 className="text-3xl font-headline font-bold tabular-nums">{timerActive ? "24:59" : "Ready to Focus?"}</h2>
            </div>
            <Button 
              size="lg" 
              className={cn(
                "w-full rounded-2xl font-bold h-12 transition-all active:scale-[0.98]", 
                timerActive ? "bg-destructive hover:bg-destructive/90 text-white" : "bg-white hover:bg-white/90 text-black"
              )}
              onClick={() => setTimerActive(!timerActive)}
            >
              {timerActive ? "End Session" : "Start Focus Timer (25m)"}
            </Button>
          </section>
        </div>

        {/* Quick Access Arsenal */}
        <section className="space-y-4">
          <h3 className="text-lg font-headline font-bold px-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Quick Arsenal
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href} className="group">
                <div className={cn(
                  "w-full aspect-square rounded-[2rem] flex flex-col items-center justify-center transition-all group-hover:translate-y-[-4px] group-active:scale-95 border-2 shadow-lg",
                  action.color
                )}>
                  <action.icon className="w-8 h-8 mb-3" />
                  <p className="text-[11px] font-bold uppercase tracking-wider">{action.title}</p>
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
                <Target className="w-5 h-5 text-primary" /> Today's Focus
              </h3>
              <Link href="/planner" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Manage Schedule</Link>
            </div>
            <div className="grid gap-3">
              {[
                { title: "Quantum Physics Review", time: "10:30 AM", type: "Study", done: false },
                { title: "Design Portfolio Update", time: "2:00 PM", type: "Career", done: true },
              ].map((task, i) => (
                <div key={i} className="glass-panel p-5 rounded-[2rem] flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md",
                      task.done ? "bg-green-500/10 text-green-500" : "bg-white/5 text-muted-foreground"
                    )}>
                      {task.done ? <CheckCircle2 className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className={cn("font-bold text-base transition-all", task.done && "line-through opacity-40")}>{task.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{task.time} • {task.type}</p>
                    </div>
                  </div>
                  {!task.done && <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/10"><Plus className="w-4 h-4" /></Button>}
                </div>
              ))}
            </div>
          </section>

          {/* AI Insights Card */}
          <section className="relative overflow-hidden p-8 rounded-[3rem] bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 border border-white/5 h-fit">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-3 rounded-2xl shadow-[0_0_20px_rgba(140,106,255,0.4)]">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-headline font-bold text-lg">Aura AI</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "It looks like you have a heavy load on <span className="text-white font-bold">Thursday</span>. I suggest breaking down the <span className="text-primary font-bold">History Essay</span> into 2 focus sessions tonight."
              </p>
              <Button size="sm" variant="outline" className="w-full rounded-2xl border-white/10 text-[10px] h-10 font-bold hover:bg-primary hover:text-white transition-all uppercase tracking-widest">
                Optimize My Plan
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
