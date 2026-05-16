"use client"

import { useState } from "react"
import { getMotivation, type MotivationOutput } from "@/ai/flows/motivation-companion"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Heart, Zap, Quote, Coffee, Sparkles, Smile, Frown, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

const QUICK_VIBES = [
  { label: "Burnt Out", icon: Frown, color: "text-orange-400 bg-orange-400/10" },
  { label: "Anxious", icon: Brain, color: "text-purple-400 bg-purple-400/10" },
  { label: "Need Focus", icon: Zap, color: "text-blue-400 bg-blue-400/10" },
  { label: "Feeling Good", icon: Smile, color: "text-pink-400 bg-pink-400/10" },
]

export default function MotivationCompanion() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MotivationOutput | null>(null)
  const [feeling, setFeeling] = useState("")

  const handleInspire = async (overrideFeeling?: string) => {
    const finalFeeling = overrideFeeling || feeling
    if (!finalFeeling.trim()) return
    setLoading(true)
    try {
      const output = await getMotivation({ feeling: finalFeeling })
      setResult(output)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      <HeaderNav 
        title="Aura Companion" 
        subtitle="Wellness Strategist" 
        info="Empathetic Gen Z companion. Uses AI to validate your stress and provide 'micro-actions' and low-friction wellness tips to get you back in flow."
      />

      {!result ? (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-tr from-primary to-secondary rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 animate-pulse-glow">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
            <h2 className="text-3xl font-headline font-bold">Vibe Check, Scholar?</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">Tell Aura how you're feeling, and let's get you back to your main character energy.</p>
          </div>

          <section className="space-y-4">
             <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quick Vibe Select</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_VIBES.map((vibe) => (
                <button
                  key={vibe.label}
                  onClick={() => handleInspire(vibe.label)}
                  disabled={loading}
                  className={cn(
                    "flex flex-col items-center justify-center p-5 rounded-[2rem] border transition-all gap-2 group",
                    vibe.color,
                    "hover:scale-105 active:scale-95 border-transparent hover:border-white/20"
                  )}
                >
                  <vibe.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{vibe.label}</span>
                </button>
              ))}
            </div>
          </section>

          <Card className="glass-panel border-0 p-8 rounded-[3rem] relative overflow-hidden">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">— OR DESCRIBE IT —</p>
                <Textarea 
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  placeholder="I'm feeling so burnt out from these midterms..."
                  className="h-32 glass-panel rounded-3xl p-6 text-sm leading-relaxed border-white/5 resize-none"
                />
              </div>
              <Button 
                className="w-full h-16 rounded-[2rem] bg-primary text-white hover:bg-primary/90 text-lg font-headline shadow-2xl shadow-primary/20 transition-all active:scale-95"
                onClick={() => handleInspire()}
                disabled={loading || !feeling.trim()}
              >
                {loading ? <Loader2 className="mr-3 animate-spin" /> : <Zap className="mr-3" />}
                {loading ? "Connecting..." : "Sync with Aura"}
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Main Message */}
          <section className="relative">
            <div className="absolute -left-4 -top-4 opacity-10">
              <Quote className="w-20 h-20 text-primary rotate-180" />
            </div>
            <Card className="glass-panel border-0 bg-primary/5 rounded-[3rem] p-10 relative z-10">
              <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-foreground text-center">
                "{result.message}"
              </p>
              <div className="flex justify-center gap-2 mt-8">
                {[1, 2, 3].map(i => <Heart key={i} className="w-5 h-5 text-pink-500 fill-pink-500" />)}
              </div>
            </Card>
          </section>

          {/* Action Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="glass-panel p-8 rounded-[2.5rem] bg-blue-500/5 border-blue-500/20 group hover:bg-blue-500/10 transition-all">
              <h3 className="font-bold flex items-center gap-3 mb-4 text-blue-400">
                <Coffee className="w-6 h-6" /> 
                <span className="text-xs uppercase tracking-widest">Wellness Ritual</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.wellnessTip}</p>
            </section>

            <section className="glass-panel p-8 rounded-[2.5rem] bg-orange-500/5 border-orange-500/20 group hover:bg-orange-500/10 transition-all border-l-4 border-l-orange-500/50">
              <h3 className="font-bold flex items-center gap-3 mb-4 text-orange-400">
                <Zap className="w-6 h-6" /> 
                <span className="text-xs uppercase tracking-widest">Micro Step</span>
              </h3>
              <p className="text-base font-bold text-foreground leading-tight">{result.actionableStep}</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">DO THIS NOW</p>
            </section>
          </div>

          {/* Quote Section */}
          <section className="text-center p-8 bg-black/20 rounded-[3rem] border border-white/5 relative overflow-hidden group">
            <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-primary/5 rotate-12 group-hover:rotate-0 transition-transform" />
            <p className="text-sm italic text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed relative z-10">
              "{result.quote}"
            </p>
          </section>

          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 text-muted-foreground font-bold transition-all"
            onClick={() => {setResult(null); setFeeling("")}}
          >
            I need more help
          </Button>
        </div>
      )}
    </div>
  )
}
