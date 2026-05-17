"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import { 
  Flame, Bot, Sparkles, 
  Map, Trophy, ArrowUpRight, BrainCircuit, Loader2,
  Moon, Sun, Clock, Zap, ShieldCheck, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useDoc, useAuth } from "@/firebase"
import { doc } from "firebase/firestore"
import { signInAnonymously } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const { user, loading: userLoading } = useUser()
  const auth = useAuth()
  const firestore = useFirestore()
  const { toast } = useToast()
  
  const [isClient, setIsClient] = useState(false)
  const [dndActive, setDndActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1500)
  const [timerRunning, setTimerRunning] = useState(false)
  const [customMinutes, setCustomMinutes] = useState("")
  const [healthStatus, setHealthStatus] = useState<'nominal' | 'degraded'>('nominal')

  // Timer reference for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsClient(true)
    const savedDnd = localStorage.getItem('aura_dnd_active') === 'true'
    setDndActive(savedDnd)
    
    // Feature Health Check
    if (!auth || !firestore) setHealthStatus('degraded')
  }, [auth, firestore])

  useEffect(() => {
    if (isClient && !userLoading && !user && auth) {
      signInAnonymously(auth).catch(() => {})
    }
  }, [user, userLoading, auth, isClient])

  const userStatsRef = useMemo(() => 
    user && firestore ? doc(firestore, "users", user.uid) : null, 
    [user?.uid, firestore]
  )
  
  const { data: userStats } = useDoc(userStatsRef)

  // Timer Logic
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false)
      // Notifications are globally handled by Toaster.tsx now
      toast({ 
        title: "Focus Session Complete", 
        description: "Your neural sync was successful. Session logged.",
        action: <Button variant="outline" size="sm" onClick={() => setTimeLeft(1500)}>Extend</Button>
      })
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning, timeLeft, toast])

  const toggleDnd = (active: boolean) => {
    setDndActive(active)
    localStorage.setItem('aura_dnd_active', String(active))
    // Trigger storage event for other components (like BottomNav)
    window.dispatchEvent(new Event('storage'))
    
    if (active) {
      toast({ 
        title: "Deep Focus Engaged", 
        description: "Study notifications suppressed. Study only mode active." 
      })
    }
  }

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const setTimerPreset = (mins: number) => {
    setTimeLeft(mins * 60)
    setTimerRunning(false)
  }

  const xp = userStats?.totalScore || 0
  const rank = useMemo(() => {
    if (xp >= 500) return "Master"
    if (xp >= 300) return "Advanced"
    if (xp >= 150) return "Skilled"
    if (xp >= 50) return "Learner"
    return "Beginner"
  }, [xp])

  if (userLoading || !isClient) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0A0714]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className={cn(
      "min-h-full p-4 md:p-8 max-w-6xl mx-auto space-y-12 pb-32 transition-all duration-1000",
      dndActive ? "bg-[#05040a]" : "bg-[#0A0714]"
    )}>
      {/* Feature Health Checker Overlay */}
      {healthStatus === 'degraded' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4">
          <div className="bg-destructive/10 backdrop-blur-md border border-destructive/20 px-4 py-2 rounded-full flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-[10px] font-bold text-destructive uppercase tracking-widest">Neural Link Degraded • Reconnecting</span>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <h1 className={cn(
              "text-4xl font-headline font-bold transition-all tracking-tighter",
              dndActive ? "text-primary/70 scale-95" : "gradient-text"
            )}>AuraFlow</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.3em] opacity-60">
                Command Center • {userStats?.displayName || "Scholar"}
              </p>
              {dndActive && (
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] h-4 uppercase px-2 animate-pulse">Deep Study Active</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* DND Toggle Switch */}
          <div className={cn(
            "rounded-2xl px-4 py-2 flex items-center gap-3 border transition-all",
            dndActive ? "bg-primary/10 border-primary/30" : "glass-panel border-white/5 bg-white/5"
          )}>
            <div className="flex items-center gap-2">
              {dndActive ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-yellow-500" />}
              <Label className="text-[10px] font-bold uppercase tracking-widest cursor-pointer" htmlFor="dnd-mode">DND</Label>
            </div>
            <Switch 
              id="dnd-mode" 
              checked={dndActive} 
              onCheckedChange={toggleDnd}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className={cn(
            "glass-panel rounded-2xl px-5 py-3 flex items-center gap-4 border transition-all",
            dndActive ? "opacity-40 grayscale" : "border-orange-500/20 bg-orange-500/5"
          )}>
            <Flame className="w-4 h-4 text-orange-500" />
            <div className="text-left">
              <p className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest leading-none mb-1">Scholar Streak</p>
              <p className="text-xs font-bold">{xp > 0 ? "3 Days" : "New Journey"}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Mastery Section */}
          <section>
            <div className={cn(
              "p-10 rounded-[3.5rem] relative overflow-hidden group border transition-all duration-1000",
              dndActive ? "border-primary/10 bg-black/40 shadow-none scale-[0.98]" : "glass-panel border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 shadow-2xl"
            )}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Mastery Level</span>
                  </div>
                  <h2 className={cn(
                    "text-5xl font-headline font-bold flex items-center gap-4 tracking-tighter transition-all",
                    dndActive && "opacity-60"
                  )}>
                    {rank}
                    {!dndActive && <ArrowUpRight className="w-8 h-8 text-primary animate-bounce-slow" />}
                  </h2>
                </div>
                <div className="w-full md:w-72 space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-primary px-2 uppercase tracking-widest">
                    <span>{xp} XP Earned</span>
                    <span>Goal: 500 XP</span>
                  </div>
                  <Progress value={Math.min(100, (xp / 500) * 100)} className={cn("h-4", dndActive ? "bg-white/5 opacity-50" : "bg-white/5")} />
                </div>
              </div>
            </div>
          </section>

          {/* Quick Tools Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-headline font-bold flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-primary" /> Study Arsenal
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "AI Solver", icon: Bot, href: "/tools/solver", color: "bg-purple-500/20 text-purple-400", desc: "Step-by-step help" },
                { title: "Smart Notes", icon: Sparkles, href: "/tools/summarizer", color: "bg-blue-500/20 text-blue-400", desc: "PDF Synthesizer" },
                { title: "Navigator", icon: Map, href: "/tools/roadmap", color: "bg-orange-500/20 text-orange-400", desc: "Career Strategy" },
                { title: "Battle Arena", icon: Trophy, href: "/tools/quiz", color: "bg-yellow-500/20 text-yellow-400", desc: "XP Training" },
              ].map((action, i) => (
                <Link key={i} href={action.href} className="group">
                  <div className={cn(
                    "w-full p-8 rounded-[3rem] flex flex-col items-center justify-center text-center transition-all border-2 shadow-xl h-full",
                    dndActive ? "border-white/5 opacity-30 grayscale hover:opacity-100" : cn("group-hover:translate-y-[-8px]", action.color, "border-transparent hover:border-white/10")
                  )}>
                    <action.icon className="w-8 h-8 mb-5" />
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-2">{action.title}</p>
                    <p className="text-[9px] opacity-60 font-bold uppercase tracking-widest">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Neural Sync / DND Timer Section */}
        <div className="space-y-10">
          <section className={cn(
            "p-10 rounded-[4rem] relative overflow-hidden flex flex-col justify-between h-[500px] transition-all duration-1000 border shadow-2xl",
            timerRunning ? "bg-primary/20 border-primary/50" : "glass-panel border-white/10"
          )}>
            <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-8">
               <div className="text-center">
                  <h2 className="text-7xl font-headline font-bold tracking-tighter tabular-nums mb-3">
                    {formatTime(timeLeft)}
                  </h2>
                  <p className="text-[10px] font-black text-primary/80 uppercase tracking-[0.3em]">
                    {timerRunning ? "Neural Sync Active" : "Initiate Flow State?"}
                  </p>
               </div>

               {/* Timer Presets */}
               <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                  {[25, 45, 60].map((m) => (
                    <Button 
                      key={m} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setTimerPreset(m)}
                      className="rounded-xl border-white/10 text-[10px] h-10 font-black hover:bg-primary/20"
                    >
                      {m}M
                    </Button>
                  ))}
               </div>

               {/* Custom Timer Input */}
               <div className="flex gap-2 w-full max-w-xs">
                  <input 
                    type="number" 
                    placeholder="Custom mins..."
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 text-xs font-bold outline-none focus:border-primary/40"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => {
                      const m = parseInt(customMinutes)
                      if (m > 0) setTimerPreset(m)
                    }}
                    className="rounded-xl h-10 w-10 p-0"
                  >
                    <Clock className="w-4 h-4" />
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10 mt-auto">
               <Button 
                variant={timerRunning ? "destructive" : "default"}
                className="rounded-[1.5rem] font-bold h-16 shadow-2xl text-xs uppercase tracking-widest"
                onClick={() => setTimerRunning(!timerRunning)}
              >
                {timerRunning ? "Abort Sync" : "Launch Sync"}
              </Button>
              <Button 
                variant="outline"
                className="rounded-[1.5rem] font-bold h-16 border-white/10 hover:bg-white/5 text-xs uppercase tracking-widest"
                onClick={() => { setTimerRunning(false); setTimeLeft(1500); }}
              >
                Reset
              </Button>
            </div>

            {/* Background Focus Orb */}
            {timerRunning && (
              <div className="absolute inset-0 bg-primary/10 animate-pulse-glow z-0" />
            )}
          </section>

          {/* Productivity Guard Card */}
          <section className="glass-panel p-8 rounded-[3rem] border-white/5 space-y-4">
             <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Focus Shield</h4>
             </div>
             <p className="text-xs text-muted-foreground leading-relaxed">
               System is optimized for deep work. App notifications are silent to maximize cognitive throughput.
             </p>
          </section>
        </div>
      </div>
    </div>
  )
}
