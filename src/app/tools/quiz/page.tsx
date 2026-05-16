"use client"

import { useState } from "react"
import { generateQuiz, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-flow"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, BrainCircuit, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

export default function QuizMaster() {
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState("")
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    try {
      const result = await generateQuiz({ topic, difficulty: 'medium', numQuestions: 5 })
      setQuiz(result)
      setCurrentStep(0)
      setAnswers([])
      setShowResults(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (index: number) => {
    const newAnswers = [...answers]
    newAnswers[currentStep] = index
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentStep < (quiz?.questions.length || 0) - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const score = quiz?.questions.reduce((acc, q, i) => {
    return acc + (answers[i] === q.correctAnswerIndex ? 1 : 0)
  }, 0) || 0

  return (
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto">
      <HeaderNav title="Quiz Master" subtitle="Test Your Knowledge" />

      {!quiz ? (
        <Card className="glass-panel border-0 mt-8">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BrainCircuit className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>What should we test today?</CardTitle>
            <p className="text-sm text-muted-foreground">Enter a topic and AI will generate a personalized challenge.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Topic or Study Subject</Label>
              <Input 
                placeholder="e.g. Cellular Biology, Civil War, Python Loops..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="glass-panel h-12"
              />
            </div>
            <Button className="w-full h-12 rounded-xl" onClick={handleGenerate} disabled={loading || !topic.trim()}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <BrainCircuit className="w-5 h-5 mr-2" />}
              Generate Quiz
            </Button>
          </CardContent>
        </Card>
      ) : showResults ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="glass-panel border-0 text-center py-10">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-headline font-bold mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground mb-6">You scored <span className="text-primary font-bold text-xl">{score} / {quiz.questions.length}</span></p>
            <div className="flex gap-4 px-8">
               <Button className="flex-1 rounded-xl" variant="outline" onClick={() => setQuiz(null)}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Try New
               </Button>
            </div>
          </Card>

          <div className="space-y-4">
            {quiz.questions.map((q, i) => (
              <Card key={i} className={cn(
                "glass-panel border-l-4",
                answers[i] === q.correctAnswerIndex ? "border-l-green-500" : "border-l-destructive"
              )}>
                <CardContent className="pt-6">
                  <div className="flex gap-3 items-start mb-4">
                    {answers[i] === q.correctAnswerIndex ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" /> : <XCircle className="w-5 h-5 text-destructive mt-1" />}
                    <p className="font-bold">{q.question}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-sm italic text-muted-foreground">
                    <p className="text-primary font-bold mb-1 not-italic text-[10px] uppercase">Explanation</p>
                    {q.explanation}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Question {currentStep + 1} of {quiz.questions.length}</span>
            <div className="w-24 bg-white/10 h-1.5 rounded-full overflow-hidden">
               <div className="h-full bg-primary" style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }} />
            </div>
          </div>

          <Card className="glass-panel border-0 p-6">
            <h3 className="text-xl font-headline font-bold mb-8 leading-tight">
              {quiz.questions[currentStep].question}
            </h3>
            <RadioGroup 
              value={answers[currentStep]?.toString()} 
              onValueChange={(val) => handleSelectAnswer(parseInt(val))}
              className="space-y-3"
            >
              {quiz.questions[currentStep].options.map((opt, i) => (
                <Label
                  key={i}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border border-white/5 cursor-pointer transition-all hover:bg-white/5",
                    answers[currentStep] === i ? "bg-primary/20 border-primary/50" : "bg-white/5"
                  )}
                >
                  <RadioGroupItem value={i.toString()} className="sr-only" />
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center border text-[10px] font-bold",
                    answers[currentStep] === i ? "bg-primary border-primary text-white" : "border-white/20"
                  )}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-sm font-medium">{opt}</span>
                </Label>
              ))}
            </RadioGroup>
          </Card>

          <Button 
            className="w-full h-14 rounded-2xl text-lg font-headline"
            onClick={nextQuestion}
            disabled={answers[currentStep] === undefined}
          >
            {currentStep === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        </div>
      )}
    </div>
  )
}
