"use client"

import { useState, useMemo, useEffect } from "react"
import { generateQuiz, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-flow"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, BrainCircuit, CheckCircle2, XCircle, Trophy, RotateCcw, Zap, TrendingUp, Medal, Sparkles, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useDoc } from "@/firebase"
import { doc, setDoc, increment, serverTimestamp, collection } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import Link from "next/link"

const POINTS_PER_CORRECT = 5

const EDUCATION_CATEGORIES = [
  { 
    id: "primary", 
    label: "Primary (Class 1-5)", 
    subjects: ["Mathematics", "English", "Science", "Social Studies", "Hindi", "Computer Science"] 
  },
  { 
    id: "middle", 
    label: "Middle School (Class 6-8)", 
    subjects: ["Algebra", "Physics", "Civics", "Geography", "History", "Hindi", "Coding"] 
  },
  { 
    id: "secondary", 
    label: "Secondary (Class 9-10)", 
    subjects: ["Biology", "Chemistry", "Physics", "Maths", "Economics", "History"] 
  },
  { 
    id: "senior-science", 
    label: "Senior Secondary - Science", 
    subjects: ["Advanced Physics", "Organic Chemistry", "Calculus", "Zoology", "Botany"] 
  },
  { 
    id: "senior-commerce", 
    label: "Senior Secondary - Commerce", 
    subjects: ["Accountancy", "Business Studies", "Macro Economics", "Statistics"] 
  },
  { 
    id: "higher", 
    label: "UPSC / Higher Ed", 
    subjects: ["Indian Polity", "Ethics", "Modern History", "Data Structures", "Quantum Physics"] 
  }
]

const getLevel = (score: number) => {
  if (score < 50) return "Beginner"
  if (score < 150) return "Learner"
  if (score < 300) return "Skilled"
  if (score < 500) return "Advanced"
  return "Master"
}

export default function QuizMaster() {
  const { user } = useUser()
  const firestore = useFirestore()
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('easy')
  const [sessionScore, setSessionScore] = useState(0)

  const userStatsRef = useMemo(() => (user && firestore ? doc(firestore, "users", user.uid) : null), [user, firestore])
  const { data: userStats } = useDoc(userStatsRef)

  const suggestedSubjects = EDUCATION_CATEGORIES.find(c => c.id === selectedLevel)?.subjects || []

  const handleGenerate = async (overriddenTopic?: string) => {
    const finalTopic = overriddenTopic || topic
    if (!finalTopic.trim()) return
    setLoading(true)
    setQuiz(null)
    setShowResults(false)
    setSessionScore(0)
    setCurrentDifficulty('easy')
    try {
      const result = await generateQuiz({ 
        topic: finalTopic, 
        difficulty: 'easy', 
        numQuestions: 3,
        academicLevel: EDUCATION_CATEGORIES.find(c => c.id === selectedLevel)?.label
      })
      setQuiz(result)
      setCurrentStep(0)
      setAnswers([])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return
    const newAnswers = [...answers]
    newAnswers[currentStep] = index
    setAnswers(newAnswers)
    setShowFeedback(true)

    const isCorrect = index === quiz?.questions[currentStep].correctAnswerIndex
    if (isCorrect) {
      setSessionScore(prev => prev + POINTS_PER_CORRECT)
    }
  }

  const nextStep = async () => {
    setShowFeedback(false)
    if (currentStep < (quiz?.questions.length || 0) - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const correctCount = answers.filter((ans, idx) => ans === quiz?.questions[idx].correctAnswerIndex).length
      
      if (correctCount >= 2 && currentDifficulty !== 'expert') {
        setLoading(true)
        const nextDiffMap: Record<string, 'easy'|'medium'|'hard'|'expert'> = { 
          easy: 'medium', medium: 'hard', hard: 'expert' 
        }
        const nextDiff = nextDiffMap[currentDifficulty]
        setCurrentDifficulty(nextDiff)
        try {
          const result = await generateQuiz({ 
            topic, 
            difficulty: nextDiff, 
            numQuestions: 3,
            academicLevel: EDUCATION_CATEGORIES.find(c => c.id === selectedLevel)?.label
          })
          setQuiz(result)
          setCurrentStep(0)
          setAnswers([])
        } catch (err) {
          console.error(err)
          setShowResults(true)
        } finally {
          setLoading(false)
        }
      } else {
        setShowResults(true)
        saveResults()
      }
    }
  }

  const saveResults = () => {
    if (!user || !firestore) return
    const correctCount = answers.filter((ans, idx) => ans === quiz?.questions[idx].correctAnswerIndex).length
    const pointsEarned = correctCount * POINTS_PER_CORRECT
    const statsRef = doc(firestore, "users", user.uid)
    const historyRef = doc(collection(firestore, "users", user.uid, "quizHistory"))

    setDoc(statsRef, {
      uid: user.uid,
      displayName: user.displayName || "Anonymous Scholar",
      photoURL: user.photoURL || "",
      totalScore: increment(pointsEarned),
      quizzesCompleted: increment(1),
      lastActive: serverTimestamp(),
    }, { merge: true }).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: statsRef.path,
        operation: 'update',
        requestResourceData: { totalScore: pointsEarned }
      }))
    })

    setDoc(historyRef, {
      userId: user.uid,
      subject: topic,
      score: pointsEarned,
      correctAnswers: correctCount,
      totalQuestions: quiz?.questions.length || 0,
      difficulty: currentDifficulty,
      timestamp: serverTimestamp(),
    })
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto pb-24 lg:pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <HeaderNav 
          title="Quiz Arena" 
          subtitle="Adaptive Intelligence" 
          showBack={true} 
          backHref="/tools"
          className="mb-0 flex-1" 
        />
        <Link href="/tools/quiz/leaderboard" className="self-end sm:self-auto">
          <Button variant="outline" size="sm" className="rounded-xl glass-panel text-yellow-500 gap-2 h-10 px-4">
            <Medal className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Rankings</span>
          </Button>
        </Link>
      </div>

      {!quiz && !showResults && (
        <div className="space-y-6 md:space-y-10 animate-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="glass-panel border-0 p-6 md:p-8 bg-primary/5 rounded-[2.5rem]">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Scholar Score</p>
              <h3 className="text-4xl font-headline font-bold text-primary">{userStats?.totalScore || 0} XP</h3>
            </Card>
            <Card className="glass-panel border-0 p-6 md:p-8 bg-secondary/5 rounded-[2.5rem]">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Neural Rank</p>
              <h3 className="text-2xl font-headline font-bold text-secondary">{getLevel(userStats?.totalScore || 0)}</h3>
            </Card>
          </div>

          <Card className="glass-panel border-0 p-8 md:p-12 rounded-[3.5rem] shadow-2xl">
            <div className="space-y-10 max-w-lg mx-auto">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <BrainCircuit className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-headline font-bold">Initiate Challenge</h2>
                <p className="text-sm text-muted-foreground">Select your stream to unlock adaptive curriculum sessions.</p>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Academic Context</Label>
                  <Select onValueChange={setSelectedLevel} value={selectedLevel}>
                    <SelectTrigger className="h-14 rounded-2xl glass-panel border-white/5 bg-white/5">
                      <SelectValue placeholder="Target grade or major" />
                    </SelectTrigger>
                    <SelectContent className="glass-panel rounded-2xl bg-background">
                      {EDUCATION_CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id} className="rounded-xl">{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={cn("space-y-6 transition-all duration-700", !selectedLevel && "opacity-20 pointer-events-none")}>
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Strategic Subjects</Label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSubjects.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => { setTopic(sub); handleGenerate(sub); }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/10 transition-all active:scale-95"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                    <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest"><span className="bg-transparent px-4 text-muted-foreground">Custom Vector</span></div>
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter custom topic..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="glass-panel h-14 rounded-2xl border-white/5"
                    />
                    <Button onClick={() => handleGenerate()} disabled={loading || !topic.trim()} className="h-14 w-14 shrink-0 rounded-2xl bg-primary shadow-xl shadow-primary/20">
                      <Zap className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {quiz && !showResults && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-4">
            <div className="space-y-2 flex-1 max-w-[200px]">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                <span className="text-primary">Sync {currentStep + 1} / {quiz.questions.length}</span>
                <span className="text-muted-foreground">{Math.round(((currentStep + 1) / quiz.questions.length) * 100)}%</span>
              </div>
              <Progress value={((currentStep + 1) / quiz.questions.length) * 100} className="h-2 bg-white/5" />
            </div>
            <Badge className={cn(
               "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 gpu-layer",
               currentDifficulty === 'easy' && "text-green-400 border-green-400/20 bg-green-400/5",
               currentDifficulty === 'medium' && "text-blue-400 border-blue-400/20 bg-blue-400/5",
               currentDifficulty === 'hard' && "text-orange-400 border-orange-400/20 bg-orange-400/5",
               currentDifficulty === 'expert' && "text-red-400 border-red-400/20 bg-red-400/5",
             )}>
               {currentDifficulty} AI
            </Badge>
          </div>

          <Card className="glass-panel border-0 p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
            <h3 className="text-xl md:text-3xl font-headline font-bold mb-10 leading-tight relative z-10">{quiz.questions[currentStep].question}</h3>
            <RadioGroup value={answers[currentStep]?.toString()} onValueChange={(val) => handleSelectAnswer(parseInt(val))} className="space-y-4">
              {quiz.questions[currentStep].options.map((opt, i) => {
                const isSelected = answers[currentStep] === i
                const isCorrect = i === quiz.questions[currentStep].correctAnswerIndex
                return (
                  <Label key={i} className={cn(
                    "flex items-center gap-5 p-5 md:p-6 rounded-[2rem] border transition-all cursor-pointer relative gpu-layer active:scale-[0.98]",
                    !showFeedback && "hover:bg-white/5 border-white/5",
                    showFeedback && isCorrect && "bg-green-500/10 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]",
                    showFeedback && isSelected && !isCorrect && "bg-destructive/10 border-destructive/50",
                    showFeedback && !isSelected && !isCorrect && "opacity-30 grayscale"
                  )}>
                    <RadioGroupItem value={i.toString()} className="sr-only" />
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center border text-xs font-black transition-all",
                      isSelected && !showFeedback ? "bg-primary border-primary text-white scale-110 shadow-lg" : "border-white/10",
                      showFeedback && isCorrect ? "bg-green-500 border-green-500 text-white" : "",
                      showFeedback && isSelected && !isCorrect ? "bg-destructive border-destructive text-white" : ""
                    )}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm md:text-base font-bold pr-10">{opt}</span>
                    {showFeedback && (isCorrect || (isSelected && !isCorrect)) && (
                      <div className="absolute right-8 animate-in zoom-in-50 duration-500">
                        {isCorrect ? <CheckCircle2 className="w-7 h-7 text-green-500" /> : <XCircle className="w-7 h-7 text-destructive" />}
                      </div>
                    )}
                  </Label>
                )
              })}
            </RadioGroup>
            {showFeedback && (
              <div className="mt-10 p-6 md:p-8 bg-white/5 rounded-[2rem] border border-white/5 animate-in slide-in-from-top-4 duration-700">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3">AI Synthesis</p>
                <p className="text-sm italic text-muted-foreground leading-relaxed font-medium">{quiz.questions[currentStep].explanation}</p>
              </div>
            )}
          </Card>

          {showFeedback && (
            <Button className="w-full h-16 rounded-[2rem] text-lg font-headline shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 transition-all active:scale-95" onClick={nextStep}>
              {currentStep === quiz.questions.length - 1 ? (currentDifficulty === 'expert' ? "Complete Arena" : "Level Up Sequence") : "Initiate Next Phase"}
              <TrendingUp className="ml-3 w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {showResults && (
        <Card className="glass-panel border-0 text-center py-16 md:py-24 rounded-[4rem] relative overflow-hidden animate-in zoom-in-95 duration-700 shadow-2xl">
          <div className="relative z-10 space-y-8 max-w-sm mx-auto">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto drop-shadow-[0_0_30px_rgba(234,179,8,0.4)] animate-bounce-slow" />
            <h2 className="text-4xl font-headline font-bold tracking-tighter">Arena Victory</h2>
            <div className="flex justify-center gap-10 py-6">
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">XP ACQUIRED</p>
                <p className="text-4xl font-headline font-bold text-primary">+{sessionScore}</p>
              </div>
              <div className="w-px h-12 bg-white/10 self-center" />
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">MASTER STATUS</p>
                <p className="text-xl font-headline font-bold text-secondary uppercase tracking-tighter">{getLevel(userStats?.totalScore || 0)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 px-6">
               <Button className="w-full rounded-[1.5rem] h-14 font-bold shadow-xl shadow-primary/20" onClick={() => { setQuiz(null); setShowResults(false); }}>
                  <RotateCcw className="w-4 h-4 mr-3" /> Battle Again
               </Button>
               <Link href="/tools/quiz/leaderboard">
                  <Button className="w-full rounded-[1.5rem] h-14 font-bold" variant="outline">Global Leaderboard</Button>
               </Link>
            </div>
          </div>
          <div className="absolute inset-0 bg-primary/5 animate-pulse-glow" />
        </Card>
      )}
    </div>
  )
}