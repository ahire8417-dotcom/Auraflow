"use client"

import { useState, useRef, useEffect } from "react"
import { solveAcademicDoubt } from "@/ai/flows/solve-academic-doubt-flow"
import { BottomNav } from "@/components/shared/bottom-nav"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, Bot, User, Sparkles, MessageSquare } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export default function DoubtSolver() {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSolve = async () => {
    if (!question.trim() || loading) return
    
    const userMsg = question
    setQuestion("")
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const result = await solveAcademicDoubt({ question: userMsg })
      setMessages(prev => [...prev, { role: 'ai', content: result.explanation }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "I encountered a minor glitch while processing that. Could you try rephrasing?" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0714]">
      <div className="p-4 bg-background/50 backdrop-blur-xl border-b border-white/5">
        <HeaderNav title="Doubt Solver" subtitle="AI Academic Tutor" />
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="max-w-2xl mx-auto space-y-6 py-8 pb-32">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto animate-pulse-glow">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-headline font-bold">What's on your mind?</h2>
                <p className="text-sm text-muted-foreground px-8">
                  Ask complex equations, historical facts, or coding bugs. I provide step-by-step logic.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Solve x² + 5x + 6 = 0", "Explain Photosynthesis", "React Hook Rules"].map((s, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full border-white/5 text-[10px] bg-white/5"
                    onClick={() => setQuestion(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-3 max-w-[90%] md:max-w-[80%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}>
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                msg.role === 'user' ? "bg-secondary" : "bg-primary"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={cn(
                "p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-xl",
                msg.role === 'user' 
                  ? "bg-secondary/10 border border-secondary/20 rounded-tr-none text-white" 
                  : "glass-panel rounded-tl-none text-muted-foreground"
              )}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="glass-panel p-5 rounded-[1.5rem] rounded-tl-none flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Decoding complexity...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 glass-panel border-t border-white/5 fixed bottom-16 left-0 right-0 z-20 md:bottom-0">
        <div className="max-w-2xl mx-auto relative group">
          <Textarea 
            placeholder="Type your academic doubt here..."
            className="min-h-[60px] max-h-[150px] pr-14 rounded-2xl border-white/10 bg-black/40 focus:ring-primary focus:border-primary/50 transition-all text-sm py-4"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSolve()
              }
            }}
          />
          <Button 
            size="icon" 
            className="absolute right-3 bottom-3 rounded-xl h-10 w-10 shadow-lg"
            disabled={loading || !question.trim()}
            onClick={handleSolve}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
