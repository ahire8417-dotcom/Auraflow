
"use client"

import { useState, useEffect, useMemo } from "react"
import { generateQuiz, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-flow"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, BrainCircuit, CheckCircle2, XCircle, Trophy, RotateCcw, Zap, Target, TrendingUp, Medal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useDoc } from "@/firebase"
import { doc, setDoc, updateDoc, increment, serverTimestamp, collection, query, orderBy, limit } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import Link from "next/link"

const POINTS_PER_CORRECT = 5

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
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('easy')
  const [sessionScore, setSessionScore] = useState(0)

  // Fetch user stats
  const userStatsRef = useMemo(() => (user && firestore ? doc(firestore, "users", user.uid) : null), [user, firestore])
  const { data: userStats } = useDoc(userStatsRef)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setQuiz(null)
    setShowResults(false)
    setSessionScore(0)
    setCurrentDifficulty('easy')
    try {
      const result = await generateQuiz({ topic, difficulty: 'easy', numQuestions: 3 })
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
      // Quiz finished - Check if we should increase difficulty or end
      const correctCount = answers.filter((ans, idx) => ans === quiz?.questions[idx].correctAnswerIndex).length
      
      // Dynamic difficulty logic: if performed well, increase difficulty
      if (correctCount >= 2 && currentDifficulty !== 'expert') {
        setLoading(true)
        const nextDiffMap: Record<string, 'easy'|'medium'|'hard'|'expert'> = { 
          easy: 'medium', medium: 'hard', hard: 'expert' 
        }
        const nextDiff = nextDiffMap[currentDifficulty]
        setCurrentDifficulty(nextDiff)
        try {
          const result = await generateQuiz({ topic, difficulty: nextDiff, numQuestions: 3 })
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

    // Update user stats
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

    // Save attempt history
    setDoc(historyRef, {
      userId: user.uid,
      subject: topic,
      score: pointsEarned,
      correctAnswers: correctCount,
      totalQuestions: quiz?.questions.length || 0,
      difficulty: currentDifficulty,
      timestamp: serverTimestamp(),
    }).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: historyRef.path,
        operation: 'create'
      }))
    })
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <HeaderNav title="Quiz Master" subtitle="The Arena" showBack={true} className="mb-0" />
        <Link href="/tools/quiz/leaderboard">
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Rank Level</p>
              <h3 className="text-xl font-headline font-bold text-secondary">{getLevel(userStats?.totalScore || 0)}</h3>
            </Card>
          </div>

          <Card className="glass-panel border-0 p-8 rounded-[3rem]">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(140,106,255,0.2)]">
                  <BrainCircuit className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-headline font-bold">What is the challenge?</CardTitle>
                <p className="text-sm text-muted-foreground">Pick a topic. AI adapts difficulty based on your performance.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Subject or Topic</Label>
                  <Input 
                    placeholder="e.g. Ancient Rome, React Hooks, Organic Chemistry"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="glass-panel h-14 rounded-2xl"
                  />
                </div>
                <Button className="w-full h-14 rounded-2xl font-bold shadow-xl shadow-primary/20" onClick={handleGenerate} disabled={loading || !topic.trim()}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
                  Generate AI Challenge
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {quiz && !showResults && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Game HUD */}
          <div className="flex items-center justify-between px-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Progress</span>
              <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden">
                 <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }} />
              </div>
            </div>
            <div className="text-right space-y-1">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Difficulty</span>
               <div className={cn(
                 "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                 currentDifficulty === 'easy' && "text-green-400 border-green-400/30 bg-green-400/5",
                 currentDifficulty === 'medium' && "text-blue-400 border-blue-400/30 bg-blue-400/5",
                 currentDifficulty === 'hard' && "text-orange-400 border-orange-400/30 bg-orange-400/5",
                 currentDifficulty === 'expert' && "text-red-400 border-red-400/30 bg-red-400/5",
               )}>
                 {currentDifficulty}
               </div>
            </div>
          </div>

          <Card className="glass-panel border-0 p-8 rounded-[3rem] relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            
            <h3 className="text-xl font-headline font-bold mb-8 leading-tight relative z-10">
              {quiz.questions[currentStep].question}
            </h3>

            <RadioGroup 
              value={answers[currentStep]?.toString()} 
              onValueChange={(val) => handleSelectAnswer(parseInt(val))}
              className="space-y-3"
            >
              {quiz.questions[currentStep].options.map((opt, i) => {
                const isSelected = answers[currentStep] === i
                const isCorrect = i === quiz.questions[currentStep].correctAnswerIndex
                
                return (
                  <Label
                    key={i}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                      !showFeedback && "hover:bg-white/5 border-white/5",
                      showFeedback && isCorrect && "bg-green-500/10 border-green-500/50",
                      showFeedback && isSelected && !isCorrect && "bg-destructive/10 border-destructive/50",
                      showFeedback && !isSelected && !isCorrect && "opacity-40 border-white/5"
                    )}
                  >
                    <RadioGroupItem value={i.toString()} className="sr-only" />
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center border text-[10px] font-bold transition-all",
                      isSelected ? "bg-primary border-primary text-white" : "border-white/10",
                      showFeedback && isCorrect && "bg-green-500 border-green-500 text-white",
                      showFeedback && isSelected && !isCorrect && "bg-destructive border-destructive text-white"
                    )}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm font-medium pr-8">{opt}</span>
                    {showFeedback && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-5" />}
                    {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive absolute right-5" />}
                  </Label>
                )
              })}
            </RadioGroup>

            {showFeedback && (
              <div className="mt-8 p-6 bg-white/5 rounded-[2rem] border border-white/5 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Insight</p>
                <p className="text-xs italic text-muted-foreground leading-relaxed">
                  {quiz.questions[currentStep].explanation}
                </p>
              </div>
            )}
          </Card>

          {showFeedback && (
            <Button className="w-full h-14 rounded-2xl text-lg font-headline shadow-lg" onClick={nextStep}>
              {currentStep === quiz.questions.length - 1 ? (currentDifficulty === 'expert' ? "Finish Challenge" : "Next Level") : "Next Question"}
              <TrendingUp className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {showResults && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <Card className="glass-panel border-0 text-center py-12 rounded-[3.5rem] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <div className="relative z-10 space-y-6">
              <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-headline font-bold">Arena Victory!</h2>
                <p className="text-muted-foreground text-sm">You've climbed to new academic heights.</p>
              </div>
              <div className="flex justify-center gap-10 py-4">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Session XP</p>
                  <p className="text-3xl font-headline font-bold text-primary">+{sessionScore}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Accuracy</p>
                  <p className="text-3xl font-headline font-bold text-secondary">
                    {Math.round((answers.filter((ans, idx) => ans === quiz?.questions[idx].correctAnswerIndex).length / (quiz?.questions.length || 1)) * 100)}%
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 px-10">
                 <Button className="flex-1 rounded-2xl h-14 font-bold" onClick={handleGenerate}>
                    <RotateCcw className="w-5 h-5 mr-2" /> Play Again
                 </Button>
                 <Link href="/tools/quiz/leaderboard" className="flex-1">
                    <Button className="w-full rounded-2xl h-14 font-bold" variant="outline">
                       <Medal className="w-5 h-5 mr-2" /> Global Ranks
                    </Button>
                 </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
