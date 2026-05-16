"use client"

import { useState, useRef, useEffect } from "react"
import { solveAcademicDoubt } from "@/ai/flows/solve-academic-doubt-flow"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, Bot, User, Sparkles } from "lucide-react"
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
      setMessages(prev => [...prev, { role: 'ai', content: "I encountered a minor glitch. Could you try rephrasing?" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100svh-64px)] md:h-screen bg-transparent">
      <div className="p-4 bg-background/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-10">
        <HeaderNav title="Doubt Solver" subtitle="AI Academic Tutor" />
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-2xl mx-auto space-y-6 py-8 px-4">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-6 animate-in fade-in duration-700">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto animate-pulse-glow">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-headline font-bold">What's the doubt?</h2>
                <p className="text-sm text-muted-foreground px-8 leading-relaxed">
                  Complex equations, historical facts, or coding bugs. I provide step-by-step logic.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Solve x² + 5x + 6 = 0", "Explain Photosynthesis", "React Hook Rules"].map((s, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full border-white/10 text-[10px] bg-white/5 hover:bg-primary hover:text-white transition-all"
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
              "flex gap-3 max-w-[95%] md:max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}>
              <div className={cn(
                "w-9 h-9 md:w-10 md:h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                msg.role === 'user' ? "bg-secondary" : "bg-primary"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={cn(
                "p-4 md:p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-xl",
                msg.role === 'user' 
                  ? "bg-secondary/10 border border-secondary/20 rounded-tr-none text-white" 
                  : "glass-panel rounded-tl-none text-muted-foreground border-white/5"
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
          <div ref={scrollRef} className="h-4" />
        </div>
      </ScrollArea>

      <div className="p-4 bg-[#0A0714] border-t border-white/5 sticky bottom-0 z-20">
        <div className="max-w-2xl mx-auto relative group">
          <Textarea 
            placeholder="Type your academic doubt here..."
            className="min-h-[60px] max-h-[150px] pr-14 rounded-2xl border-white/10 bg-black/40 focus:ring-primary focus:border-primary/50 transition-all text-sm py-4 resize-none"
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
    </div>
  )
}
