"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "@/components/shared/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Flame, Star, Clock, Bell, Plus, CheckCircle2, Bot, Sparkles, Map, Zap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const [streak, setStreak] = useState(12)
  const [xp, setXp] = useState(1250)
  const [timerActive, setTimerActive] = useState(false)

  const quickActions = [
    { title: "Solver", icon: Bot, href: "/tools/solver", color: "bg-purple-500/20 text-purple-400" },
    { title: "Notes", icon: Sparkles, href: "/tools/summarizer", color: "bg-blue-500/20 text-blue-400" },
    { title: "Future", icon: Map, href: "/tools/roadmap", color: "bg-orange-500/20 text-orange-400" },
    { title: "More", icon: Plus, href: "/tools", color: "bg-white/10 text-white" },
  ]

  return (
    <div className="min-h-screen bg-[#0A0714] text-white p-4 pb-24 md:p-8 max-w-4xl mx-auto">
      {/* Top Bar */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold gradient-text">AuraFlow</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Student Command Center</p>
        </div>
        <div className="flex gap-2">
          <div className="glass-panel rounded-2xl px-3 py-1.5 flex items-center gap-2 border-orange-500/20">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold">{streak}</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-2xl glass-panel">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="grid gap-6">
        {/* User Progress Stats */}
        <div className="grid grid-cols-2 gap-4">
          <section className="glass-panel p-5 rounded-[2rem] relative overflow-hidden flex flex-col justify-between h-40">
            <Star className="absolute -right-4 -top-4 w-20 h-20 text-primary/10 rotate-12" />
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Current Rank</p>
              <h2 className="text-xl font-bold">Lvl 14 Elite</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold">
                <span>{xp} XP</span>
                <span>1500 XP</span>
              </div>
              <Progress value={83} className="h-1.5 bg-white/5" />
            </div>
          </section>

          <section className={cn(
            "p-5 rounded-[2rem] relative overflow-hidden flex flex-col justify-between h-40 transition-all duration-500",
            timerActive ? "bg-primary/20 border-primary/50" : "glass-panel"
          )}>
            <Zap className={cn("absolute -right-4 -top-4 w-20 h-20 rotate-12 transition-colors", timerActive ? "text-primary/40" : "text-white/5")} />
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Focus Mode</p>
              <h2 className="text-xl font-bold">{timerActive ? "24:59" : "Ready?"}</h2>
            </div>
            <Button 
              size="sm" 
              className={cn("w-full rounded-xl font-bold", timerActive ? "bg-destructive text-white" : "bg-white text-black")}
              onClick={() => setTimerActive(!timerActive)}
            >
              {timerActive ? "Stop Session" : "Start 25m"}
            </Button>
          </section>
        </div>

        {/* Action Grid */}
        <section className="grid grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="group">
              <div className={cn(
                "w-full aspect-square rounded-3xl flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95",
                action.color
              )}>
                <action.icon className="w-7 h-7" />
              </div>
              <p className="text-center text-[10px] font-bold mt-2 text-muted-foreground group-hover:text-white">{action.title}</p>
            </Link>
          ))}
        </section>

        {/* Tasks Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-headline font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Today's Focus
            </h3>
            <Link href="/planner" className="text-xs font-bold text-primary hover:underline">Edit Schedule</Link>
          </div>
          <div className="grid gap-3">
            {[
              { title: "Quantum Physics Review", time: "10:30 AM", type: "Study", done: false },
              { title: "Design Portfolio Update", time: "2:00 PM", type: "Career", done: true },
            ].map((task, i) => (
              <div key={i} className="glass-panel p-4 rounded-3xl flex items-center justify-between group hover:border-primary/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    task.done ? "bg-green-500/10 text-green-500" : "bg-white/5 text-muted-foreground"
                  )}>
                    {task.done ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className={cn("font-bold text-sm", task.done && "line-through opacity-40")}>{task.title}</h4>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{task.time} • {task.type}</p>
                  </div>
                </div>
                {!task.done && <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/10"><Plus className="w-4 h-4" /></Button>}
              </div>
            ))}
          </div>
        </section>

        {/* AI Insight Card */}
        <section className="relative overflow-hidden p-6 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 border border-white/5">
          <div className="flex gap-4">
            <div className="bg-primary p-3 rounded-2xl h-fit shadow-[0_0_20px_rgba(140,106,255,0.4)]">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold">Aura Intelligence</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Based on your schedule, you have a heavy workload on Thursday. I recommend starting the <span className="text-white font-medium">History Essay</span> tonight to avoid burnout.
              </p>
              <Button size="sm" variant="outline" className="rounded-full border-white/10 text-[10px] h-8 px-4 font-bold">
                Adjust Plan
              </Button>
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
