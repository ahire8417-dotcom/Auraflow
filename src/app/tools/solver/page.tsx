"use client"

import { useState, useRef, useEffect } from "react"
import { solveAcademicDoubt } from "@/ai/flows/solve-academic-doubt-flow"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, Bot, User, Sparkles, Trash2, Zap } from "lucide-react"
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
  }, [messages, loading])

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
      setMessages(prev => [...prev, { role: 'ai', content: "I encountered a minor glitch. I'm ready to try again—could you rephrase your question?" }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => setMessages([])

  return (
    <div className="flex flex-col h-[calc(100svh-64px)] md:h-screen bg-transparent">
      <div className="p-4 bg-background/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-10 flex items-center justify-between">
        <HeaderNav title="Aura AI Tutor" subtitle="Adaptive Intellect" className="mb-0" />
        {messages.length > 0 && (
          <Button variant="ghost" size="icon" onClick={clearChat} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto space-y-8 py-10 px-4">
          {messages.length === 0 && (
            <div className="text-center py-16 space-y-8 animate-in fade-in duration-1000">
              <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(140,106,255,0.2)]">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-headline font-bold">ChatGPT-Level Academic Support</h2>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Ask easy questions for quick answers, or request detailed breakdowns for complex topics. I adapt to your needs instantly.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                {[
                  "Explain quantum entanglement simply", 
                  "Compare capitalism and socialism in detail", 
                  "Quick check: 15% of 250",
                  "Why is the sky blue?"
                ].map((s, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full border-white/10 text-xs bg-white/5 hover:bg-primary hover:text-white transition-all px-4 h-9"
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
              "flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xl",
                msg.role === 'user' ? "bg-secondary" : "bg-primary"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={cn(
                "p-5 md:p-6 rounded-[2rem] text-sm leading-relaxed shadow-2xl max-w-[90%] md:max-w-[80%]",
                msg.role === 'user' 
                  ? "bg-secondary/20 border border-secondary/30 rounded-tr-none text-white ml-auto" 
                  : "glass-panel rounded-tl-none text-foreground border-white/5 mr-auto whitespace-pre-wrap"
              )}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="glass-panel p-6 rounded-[2rem] rounded-tl-none flex items-center gap-4 border-primary/20 bg-primary/5">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Evaluating Complexity...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-4" />
        </div>
      </ScrollArea>

      <div className="p-4 bg-background border-t border-white/5 sticky bottom-0 z-20">
        <div className="max-w-3xl mx-auto relative">
          <Textarea 
            placeholder="Ask anything... (Shift+Enter for new line)"
            className="min-h-[60px] max-h-[250px] pr-16 pl-6 rounded-3xl border-white/10 bg-white/5 focus:ring-primary focus:border-primary/50 transition-all text-sm py-5 resize-none shadow-inner"
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
            className="absolute right-3 bottom-3 rounded-2xl h-11 w-11 shadow-lg bg-primary hover:bg-primary/90 transition-all active:scale-95"
            disabled={loading || !question.trim()}
            onClick={handleSolve}
          >
            <Zap className={cn("w-5 h-5", loading && "animate-pulse")} />
          </Button>
        </div>
      </div>
    </div>
  )
}
