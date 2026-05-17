"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Progress } from "@/components/ui/progress"
import { 
  Flame, Bell, Bot, Sparkles, 
  Map, Trophy, ArrowUpRight, BrainCircuit, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useDoc, useAuth, errorEmitter, FirestorePermissionError } from "@/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { signInAnonymously } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { user, loading: userLoading } = useUser()
  const auth = useAuth()
  const firestore = useFirestore()
  const { toast } = useToast()
  
  const [timerActive, setTimerActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1500)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !userLoading && !user && auth) {
      signInAnonymously(auth).catch(() => {})
    }
  }, [user, userLoading, auth, isClient])

  const userStatsRef = useMemo(() => 
    user && firestore ? doc(firestore, "users", user.uid) : null, 
    [user?.uid, firestore]
  )
  
  const { data: userStats, loading: statsLoading } = useDoc(userStatsRef)

  useEffect(() => {
    if (user && !statsLoading && firestore && userStats === null) {
      const statsRef = doc(firestore, "users", user.uid)
      const initialData = {
        uid: user.uid,
        displayName: user.displayName || "Elite Scholar",
        totalScore: 0,
        level: "Beginner",
        quizzesCompleted: 0,
        lastActive: serverTimestamp(),
      }
      
      setDoc(statsRef, initialData, { merge: true })
        .catch((err) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: statsRef.path,
            operation: 'create',
            requestResourceData: initialData
          }))
        })
    }
  }, [user, userStats, statsLoading, firestore])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false)
      toast({ title: "Focus Complete", description: "Excellent discipline." })
    }
    return () => { if (interval) clearInterval(interval) }
  }, [timerActive, timeLeft, toast])

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

  if (userLoading || !isClient) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0A0714]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold gradient-text tracking-tighter">AuraFlow</h1>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.3em] opacity-60">
              Command Center • {userStats?.displayName || "Scholar"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-panel rounded-[1.5rem] px-5 py-3 flex items-center gap-4 border-orange-500/20 bg-orange-500/5">
            <Flame className="w-4 h-4 text-orange-500" />
            <div className="text-left">
              <p className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest leading-none mb-1">Scholar Streak</p>
              <p className="text-xs font-bold">{xp > 0 ? "3 Days" : "New Journey"}</p>
            </div>
          </div>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="rounded-2xl glass-panel h-12 w-12 hover:bg-primary/10">
              <Bell className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="glass-panel p-10 rounded-[3.5rem] relative overflow-hidden group border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Mastery Level</span>
                  </div>
                  <h2 className="text-5xl font-headline font-bold flex items-center gap-4 tracking-tighter">
                    {rank}
                    <ArrowUpRight className="w-8 h-8 text-primary animate-bounce-slow" />
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium italic opacity-80">
                    {xp === 0 ? "System initialized." : "Optimal study velocity detected."}
                  </p>
                </div>
                <div className="w-full md:w-72 space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-primary px-2 uppercase tracking-widest">
                    <span>{xp} XP Earned</span>
                    <span>Goal: 500 XP</span>
                  </div>
                  <Progress value={Math.min(100, (xp / 500) * 100)} className="h-4 bg-white/5" />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-headline font-bold flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-primary" /> Study Arsenal
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href} className="group">
                  <div className={cn(
                    "w-full p-8 rounded-[3rem] flex flex-col items-center justify-center text-center transition-all group-hover:translate-y-[-8px] border-2 shadow-xl h-full",
                    action.color
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

        <div className="space-y-10">
          <section className={cn(
            "p-10 rounded-[4rem] relative overflow-hidden flex flex-col justify-between h-96 transition-all duration-1000 border shadow-2xl",
            timerActive ? "bg-primary/20 border-primary/50" : "glass-panel border-white/10"
          )}>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
               <h2 className="text-7xl font-headline font-bold tracking-tighter tabular-nums mb-3">
                 {formatTime(timeLeft)}
               </h2>
               <p className="text-[10px] font-black text-primary/80 uppercase tracking-[0.3em]">{timerActive ? "Neural Sync Active" : "Initiate Flow State?"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10 mt-auto">
               <Button 
                variant={timerActive ? "destructive" : "default"}
                className="rounded-[1.5rem] font-bold h-16 shadow-2xl text-xs uppercase tracking-widest"
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
        </div>
      </div>
    </div>
  )
}
