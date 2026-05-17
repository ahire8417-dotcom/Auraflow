"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import { 
  Flame, Bot, Sparkles, 
  Map, Trophy, ArrowUpRight, BrainCircuit, Loader2,
  Moon, Sun, Clock, Zap, ShieldCheck, AlertCircle, Share2
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
  const [healthStatus, setHealthStatus] = useState<'nominal' | 'degraded'>('nominal')

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const syncAttempted = useRef(false)

  useEffect(() => {
    setIsClient(true)
    const savedDnd = localStorage.getItem('aura_dnd_active') === 'true'
    setDndActive(savedDnd)
    
    // Check Neural Link Status based on config availability
    if (!auth || !auth.config) {
      setHealthStatus('degraded')
    } else {
      setHealthStatus('nominal')
    }
  }, [auth])

  useEffect(() => {
    if (isClient && !userLoading && !user && auth && !syncAttempted.current) {
      syncAttempted.current = true
      signInAnonymously(auth).catch((err) => {
        console.error("Neural Sync Failed:", err)
        setHealthStatus('degraded')
      })
    }
  }, [user, userLoading, auth, isClient])

  // Stabilized path-memoized reference
  const userStatsRef = useMemo(() => 
    user && firestore ? doc(firestore, "users", user.uid) : null, 
    [user?.uid, firestore]
  )
  
  const { data: userStats } = useDoc(userStatsRef)

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false)
      toast({ 
        title: "Focus Achieved", 
        description: "Your session objective has been synchronized.",
      })
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning, timeLeft, toast])

  const toggleDnd = (active: boolean) => {
    setDndActive(active)
    localStorage.setItem('aura_dnd_active', String(active))
    window.dispatchEvent(new Event('aura_dnd_update'))
    
    toast({ 
      title: active ? "Deep Focus Engaged" : "Aura Restored", 
      description: active ? "Neural notifications suppressed." : "System link active.",
    })
  }

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const xp = userStats?.totalScore || 0
  const rank = xp >= 500 ? "Master" : xp >= 300 ? "Advanced" : xp >= 150 ? "Skilled" : xp >= 50 ? "Learner" : "Beginner"

  if (userLoading || !isClient) {
    return (
      <div className="h-svh flex items-center justify-center bg-[#0A0714]">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full" />
          <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "min-h-full p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12 transition-all duration-700 transform-gpu pb-32",
      dndActive && "brightness-[0.9]"
    )}>
      {healthStatus === 'degraded' && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[2000] animate-in slide-in-from-top-4">
          <Badge variant="destructive" className="px-6 py-2.5 rounded-full flex items-center gap-3 backdrop-blur-2xl border-destructive/30 shadow-2xl animate-pulse">
            <AlertCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Link Destabilized</span>
          </Badge>
        </div>
      )}

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className={cn(
            "text-4xl md:text-6xl font-headline font-bold transition-all tracking-tighter",
            dndActive ? "opacity-70 scale-95 origin-left" : "gradient-text"
          )}>AuraFlow</h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.25em] opacity-60">
              {userStats?.displayName || "Elite Scholar"} • Dashboard
            </p>
            {dndActive && <Badge className="h-4 bg-primary/20 text-primary border-primary/30 text-[8px] uppercase font-black px-2">Focus Mode</Badge>}
          </div>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-center">
          <div className={cn(
            "rounded-2xl px-5 py-3 flex items-center gap-4 border transition-all glass-panel",
            dndActive ? "border-primary/40 bg-primary/10" : "bg-white/5 border-white/5"
          )}>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleDnd(!dndActive)}>
              {dndActive ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-yellow-500" />}
              <Label className="text-[10px] font-black uppercase tracking-widest cursor-pointer ml-1">Deep Focus</Label>
            </div>
            <Switch checked={dndActive} onCheckedChange={toggleDnd} className="data-[state=checked]:bg-primary" />
          </div>

          <div className="glass-panel rounded-2xl px-6 py-4 flex items-center gap-4 border-orange-500/20 bg-orange-500/5">
            <Flame className="w-5 h-5 text-orange-500" />
            <div className="text-left hidden md:block">
              <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest leading-none mb-1">XP Level</p>
              <p className="text-xs font-bold">{rank}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section className={cn(
            "p-10 md:p-14 rounded-[4rem] relative overflow-hidden group border transition-all duration-700 transform-gpu shadow-2xl",
            dndActive ? "border-primary/10 bg-black/40" : "glass-panel border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
          )}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">Mastery Progression</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-headline font-bold flex items-center gap-6 tracking-tighter">
                  {xp} XP
                  <ArrowUpRight className={cn("w-10 h-10 text-primary transition-all", dndActive ? "opacity-20" : "animate-bounce-slow")} />
                </h2>
                <Button className="rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] h-10 px-6 gap-2 hover:bg-primary hover:text-white transition-all">
                  <Share2 className="w-3 h-3" /> Publish Achievements
                </Button>
              </div>
              <div className="w-full md:w-96 space-y-5">
                <div className="flex justify-between text-[11px] font-black text-primary px-1 uppercase tracking-widest">
                  <span>Level Rank: {rank}</span>
                  <span>Target 500</span>
                </div>
                <Progress value={Math.min(100, (xp / 500) * 100)} className="h-4 bg-white/5" />
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-2xl font-headline font-bold px-2 flex items-center gap-4">
              <BrainCircuit className="w-7 h-7 text-primary" /> Arsenal Modules
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { title: "Solver", icon: Bot, href: "/tools/solver", color: "text-purple-400 bg-purple-500/10" },
                { title: "Synthesizer", icon: Sparkles, href: "/tools/summarizer", color: "text-blue-400 bg-blue-500/10" },
                { title: "Navigator", icon: Map, href: "/tools/roadmap", color: "text-orange-400 bg-orange-500/10" },
                { title: "Arena", icon: Trophy, href: "/tools/quiz", color: "text-yellow-400 bg-yellow-500/10" },
              ].map((tool, i) => (
                <Link key={i} href={tool.href} className="group">
                  <div className={cn(
                    "glass-panel p-8 md:p-10 rounded-[3rem] flex flex-col items-center justify-center text-center transition-all border-2 border-transparent hover:border-primary/30 h-full transform-gpu shadow-xl",
                    dndActive ? "opacity-50 grayscale hover:opacity-100" : "group-hover:-translate-y-2 group-hover:bg-primary/5"
                  )}>
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-2xl", tool.color)}>
                      <tool.icon className="w-8 h-8" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest mb-1.5">{tool.title}</p>
                    <p className="text-[9px] opacity-40 uppercase font-black tracking-tighter">Enter Module</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <section className={cn(
            "p-10 md:p-12 rounded-[4rem] relative overflow-hidden flex flex-col justify-between min-h-[480px] transition-all duration-700 border shadow-2xl transform-gpu",
            timerRunning ? "bg-primary/10 border-primary/40" : "glass-panel border-white/5"
          )}>
            <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-12">
               <div className="text-center">
                  <h2 className="text-7xl md:text-8xl font-headline font-bold tracking-tighter tabular-nums mb-3">
                    {formatTime(timeLeft)}
                  </h2>
                  <p className="text-[10px] font-black text-primary/80 uppercase tracking-[0.4em]">
                    {timerRunning ? "Active Focus" : "Neural Timer"}
                  </p>
               </div>

               <div className="grid grid-cols-3 gap-3 w-full">
                  {[25, 45, 60].map((m) => (
                    <button 
                      key={m} 
                      onClick={() => { setTimeLeft(m * 60); setTimerRunning(false); }}
                      className="rounded-2xl border border-white/5 h-12 text-[10px] font-black hover:bg-primary/20 glass-panel bg-white/5 transition-all"
                    >
                      {m}M
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10 mt-10">
               <Button 
                variant={timerRunning ? "destructive" : "default"}
                className="rounded-[2rem] font-black h-16 text-[11px] uppercase tracking-widest shadow-2xl"
                onClick={() => setTimerRunning(!timerRunning)}
              >
                {timerRunning ? "Abort" : "Ignite"}
              </Button>
              <Button 
                variant="outline"
                className="rounded-[2rem] font-black h-16 border-white/10 text-[11px] uppercase tracking-widest hover:bg-white/5"
                onClick={() => { setTimerRunning(false); setTimeLeft(1500); }}
              >
                Reset
              </Button>
            </div>
          </section>

          <section className="glass-panel p-10 rounded-[3rem] border-white/5 space-y-6">
             <div className="flex items-center gap-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Neural Sync Status</h4>
             </div>
             <p className="text-xs text-muted-foreground leading-relaxed font-medium">
               All strategic intelligence modules are synchronized via production link. Latency optimized for high-velocity operations.
             </p>
          </section>
        </div>
      </div>
    </div>
  )
}
