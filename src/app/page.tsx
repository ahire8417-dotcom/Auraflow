"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "@/components/shared/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Flame, Star, Clock, Bell, Plus, CheckCircle2, Bot, Sparkles, GraduationCap, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const [streak, setStreak] = useState(0)
  const [xp, setXp] = useState(0)

  useEffect(() => {
    setStreak(12)
    setXp(1250)
  }, [])

  const tasks = [
    { id: 1, title: "Quantum Physics Chapter 4", status: "pending", time: "10:00 AM" },
    { id: 2, title: "Modern Art History Essay", status: "completed", time: "1:30 PM" },
    { id: 3, title: "Advanced Calculus Quiz", status: "pending", time: "4:00 PM" },
  ]

  const quickActions = [
    { title: "Solver", icon: Bot, href: "/tools/solver", color: "text-purple-400" },
    { title: "Planner", icon: Clock, href: "/planner", color: "text-blue-400" },
    { title: "Roadmap", icon: Map, href: "/tools/roadmap", color: "text-orange-400" },
    { title: "Projects", icon: Sparkles, href: "/tools/projects", color: "text-yellow-400" },
  ]

  return (
    <div className="min-h-screen p-4 pb-24 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold gradient-text">AuraFlow</h1>
          <p className="text-muted-foreground text-sm">Welcome back, Alex!</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full glass-panel">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="glass-panel rounded-full px-3 py-1 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold">{streak}</span>
          </div>
        </div>
      </header>

      <div className="grid gap-6">
        {/* XP & Progress Card */}
        <section className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star className="w-24 h-24" />
          </div>
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Level 14 Scout</p>
              <h2 className="text-2xl font-bold">{xp} XP</h2>
            </div>
            <p className="text-xs font-medium text-muted-foreground">Next: 1500 XP</p>
          </div>
          <Progress value={83} className="h-2 mb-2 bg-white/10" />
          <p className="text-xs text-muted-foreground italic">"Consistent effort is the key to mastery."</p>
        </section>

        {/* Quick Access AI Tools */}
        <section className="grid grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="flex flex-col items-center gap-2">
              <div className="w-full aspect-square glass-panel rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all">
                <action.icon className={cn("w-6 h-6", action.color)} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{action.title}</span>
            </Link>
          ))}
        </section>

        {/* Daily Tasks */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-headline font-semibold">Today's Focus</h3>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto">View All</Button>
          </div>
          <div className="grid gap-3">
            {tasks.map(task => (
              <div key={task.id} className="glass-panel p-4 rounded-xl flex items-center justify-between group hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    task.status === 'completed' ? "bg-green-500/20 text-green-500" : "bg-white/5 text-muted-foreground"
                  )}>
                    {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className={cn("font-medium", task.status === 'completed' && "line-through opacity-50 text-muted-foreground")}>{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.time}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                  <Plus className="w-4 h-4 rotate-45" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* AI Suggestions */}
        <section className="glass-panel p-4 rounded-xl border-l-4 border-l-secondary">
          <div className="flex gap-3">
            <div className="bg-secondary/20 p-2 rounded-lg h-fit">
              <Bot className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h4 className="text-sm font-bold mb-1">Aura Suggestion</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You have a Physics exam in 3 days. Focus on "Electromagnetism" today. I've updated your schedule for optimal retention.
              </p>
              <Button size="sm" variant="outline" className="mt-2 h-7 text-[10px] rounded-full border-secondary/30">
                View Updated Plan
              </Button>
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
