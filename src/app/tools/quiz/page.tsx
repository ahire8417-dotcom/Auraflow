"use client"

import { useState, useMemo } from "react"
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
    <div className="min-h-full p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <HeaderNav 
          title="Quiz Master" 
          subtitle="Adaptive Arena" 
          showBack={true} 
          className="mb-0 flex-1" 
          info="Adaptive arena. Quizzes get harder as you win. Earn XP and climb the global ranks by proving your mastery."
        />
        <Link href="/tools/quiz/leaderboard" className="ml-4">
          <Button variant="ghost" size="sm" className="rounded-xl glass-panel text-yellow-500 gap-2">
            <Medal className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Global Ranks</span>
          </Button>
        </Link>
      </div>

      {!quiz && !showResults && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="glass-panel border-0 p-6 bg-primary/5 rounded-[2.5rem]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Score</p>
              <h3 className="text-3xl font-headline font-bold text-primary">{userStats?.totalScore || 0}</h3>
            </Card>
            <Card className="glass-panel border-0 p-6 bg-secondary/5 rounded-[2.5rem]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Rank Status</p>
              <h3 className="text-xl font-headline font-bold text-secondary">{getLevel(userStats?.totalScore || 0)}</h3>
            </Card>
          </div>

          <Card className="glass-panel border-0 p-8 rounded-[3rem]">
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BrainCircuit className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-headline font-bold">Start Challenge</CardTitle>
                <p className="text-sm text-muted-foreground">Select your level to unlock subject-specific quizzes.</p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> 1. Academic Level
                  </Label>
                  <Select onValueChange={setSelectedLevel} value={selectedLevel}>
                    <SelectTrigger className="h-14 rounded-2xl glass-panel border-white/10 bg-white/5">
                      <SelectValue placeholder="Select your grade/stream" />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-white/10 rounded-2xl bg-[#0A0714]">
                      {EDUCATION_CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id} className="rounded-xl">{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={cn("space-y-4 transition-all duration-500", !selectedLevel && "opacity-30 pointer-events-none")}>
                   <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" /> 2. Pick a Subject
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSubjects.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => { setTopic(sub); handleGenerate(sub); }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase text-center">— OR ENTER CUSTOM —</p>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g. Modern Physics, World War II"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="glass-panel h-12 rounded-xl"
                      />
                      <Button onClick={() => handleGenerate()} disabled={loading || !topic.trim()} className="h-12 rounded-xl">
                        <Zap className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {quiz && !showResults && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between px-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stage {currentStep + 1}</span>
              <div className="w-32 bg-white/10 h-1.5 rounded-full overflow-hidden">
                 <div className="h-full bg-primary transition-all" style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }} />
              </div>
            </div>
            <div className={cn(
               "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg",
               currentDifficulty === 'easy' && "text-green-400 border-green-400/30 bg-green-400/5",
               currentDifficulty === 'medium' && "text-blue-400 border-blue-400/30 bg-blue-400/5",
               currentDifficulty === 'hard' && "text-orange-400 border-orange-400/30 bg-orange-400/5",
               currentDifficulty === 'expert' && "text-red-400 border-red-400/30 bg-red-400/5",
             )}>
               {currentDifficulty} Mode
            </div>
          </div>

          <Card className="glass-panel border-0 p-8 rounded-[3rem] relative overflow-hidden">
            <h3 className="text-xl font-headline font-bold mb-8 leading-tight relative z-10">{quiz.questions[currentStep].question}</h3>
            <RadioGroup value={answers[currentStep]?.toString()} onValueChange={(val) => handleSelectAnswer(parseInt(val))} className="space-y-3">
              {quiz.questions[currentStep].options.map((opt, i) => {
                const isSelected = answers[currentStep] === i
                const isCorrect = i === quiz.questions[currentStep].correctAnswerIndex
                return (
                  <Label key={i} className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer relative",
                    !showFeedback && "hover:bg-white/5 border-white/5",
                    showFeedback && isCorrect && "bg-green-500/10 border-green-500/50 ring-2 ring-green-500/20",
                    showFeedback && isSelected && !isCorrect && "bg-destructive/20 border-destructive/50 ring-2 ring-destructive/30",
                    showFeedback && !isSelected && !isCorrect && "opacity-40"
                  )}>
                    <RadioGroupItem value={i.toString()} className="sr-only" />
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center border text-[10px] font-bold transition-colors",
                      isSelected && !showFeedback ? "bg-primary border-primary text-white" : "border-white/10",
                      showFeedback && isCorrect ? "bg-green-500 border-green-500 text-white" : "",
                      showFeedback && isSelected && !isCorrect ? "bg-destructive border-destructive text-white" : ""
                    )}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm font-medium pr-8">{opt}</span>
                    {showFeedback && isCorrect && (
                      <div className="absolute right-6 animate-in zoom-in-50 duration-300">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <div className="absolute right-6 animate-in zoom-in-50 duration-300">
                        <XCircle className="w-6 h-6 text-destructive" />
                      </div>
                    )}
                  </Label>
                )
              })}
            </RadioGroup>
            {showFeedback && (
              <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5 animate-in slide-in-from-top-2">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Master Insight</p>
                <p className="text-xs italic text-muted-foreground leading-relaxed">{quiz.questions[currentStep].explanation}</p>
              </div>
            )}
          </Card>

          {showFeedback && (
            <Button className="w-full h-14 rounded-2xl text-lg font-headline shadow-xl shadow-primary/20" onClick={nextStep}>
              {currentStep === quiz.questions.length - 1 ? (currentDifficulty === 'expert' ? "Complete Arena" : "Level Up") : "Next Tactic"}
              <TrendingUp className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {showResults && (
        <Card className="glass-panel border-0 text-center py-12 rounded-[3.5rem] relative overflow-hidden animate-in zoom-in-95">
          <div className="relative z-10 space-y-6">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
            <h2 className="text-3xl font-headline font-bold">Arena Victory!</h2>
            <div className="flex justify-center gap-12 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">XP EARNED</p>
                <p className="text-3xl font-headline font-bold text-primary">+{sessionScore}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">STATUS</p>
                <p className="text-xl font-headline font-bold text-secondary">{getLevel(userStats?.totalScore || 0)}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 px-8">
               <Button className="flex-1 rounded-xl h-12" onClick={() => { setQuiz(null); setShowResults(false); }}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Battle Again
               </Button>
               <Link href="/tools/quiz/leaderboard" className="flex-1">
                  <Button className="w-full rounded-xl h-12" variant="outline">Global Arena</Button>
               </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
