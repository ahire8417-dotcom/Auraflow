"use client"

import { useState } from "react"
import { solveAcademicDoubt } from "@/ai/flows/solve-academic-doubt-flow"
import { BottomNav } from "@/components/shared/bottom-nav"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, Bot, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DoubtSolver() {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([])
  const [loading, setLoading] = useState(false)

  const handleSolve = async () => {
    if (!question.trim()) return
    
    const userMsg = question
    setQuestion("")
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const result = await solveAcademicDoubt({ question: userMsg })
      setMessages(prev => [...prev, { role: 'ai', content: result.explanation }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 border-b glass-panel sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-headline font-bold">Academic Solver</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Tutor Online</p>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
              <h2 className="text-xl font-headline font-bold mb-2">How can I help you today?</h2>
              <p className="text-sm text-muted-foreground px-10">Ask me any complex academic question and I'll explain it step-by-step.</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-secondary text-white" : "bg-primary text-white"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' ? "bg-secondary/10 border border-secondary/20 rounded-tr-none" : "glass-panel rounded-tl-none"
              )}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="glass-panel p-4 rounded-2xl flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Analysing question...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 glass-panel border-t sticky bottom-16 md:bottom-0">
        <div className="max-w-2xl mx-auto relative">
          <Textarea 
            placeholder="Describe your doubt here..."
            className="min-h-[60px] pr-12 rounded-2xl border-white/10 focus:ring-primary"
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
            className="absolute right-2 bottom-2 rounded-xl"
            disabled={loading}
            onClick={handleSolve}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
