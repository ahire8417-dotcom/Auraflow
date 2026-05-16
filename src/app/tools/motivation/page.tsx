"use client"

import { useState } from "react"
import { getMotivation, type MotivationOutput } from "@/ai/flows/motivation-companion"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Heart, Zap, Quote, Coffee } from "lucide-react"

export default function MotivationCompanion() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MotivationOutput | null>(null)
  const [feeling, setFeeling] = useState("")

  const handleInspire = async () => {
    if (!feeling.trim()) return
    setLoading(true)
    try {
      const output = await getMotivation({ feeling })
      setResult(output)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 pb-24 max-w-xl mx-auto">
      <HeaderNav 
        title="Aura Companion" 
        subtitle="Mental Wellness" 
        info="Empathetic wellness space. Get personalized motivation, wellness exercises, and micro-actions to beat academic stress and burnout."
      />

      {!result ? (
        <div className="space-y-6">
          <Card className="glass-panel border-0">
            <CardHeader>
              <CardTitle className="text-lg">How are you feeling, truly?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                placeholder="I'm feeling overwhelmed by my finals, or I just need a little boost..."
                className="h-32 glass-panel mb-4"
              />
              <Button 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90"
                onClick={handleInspire}
                disabled={loading || !feeling.trim()}
              >
                {loading ? <Loader2 className="mr-2 animate-spin" /> : <Zap className="mr-2" />}
                Get Encouragement
              </Button>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-2xl text-center opacity-60">
              <Coffee className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-[10px] uppercase font-bold">Quick Break</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center opacity-60">
              <Zap className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-[10px] uppercase font-bold">Deep Focus</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="glass-panel bg-white/5 border-0">
            <CardContent className="pt-6">
              <p className="text-lg font-medium italic text-center mb-4 leading-relaxed">
                "{result.message}"
              </p>
              <div className="flex justify-center gap-2">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <section className="glass-panel p-5 rounded-2xl">
              <h3 className="font-bold flex items-center gap-2 mb-2 text-blue-400">
                <Coffee className="w-4 h-4" /> Wellness Tip
              </h3>
              <p className="text-sm text-muted-foreground">{result.wellnessTip}</p>
            </section>

            <section className="glass-panel p-5 rounded-2xl border-l-4 border-l-primary">
              <h3 className="font-bold flex items-center gap-2 mb-2 text-primary">
                <Zap className="w-4 h-4" /> Micro Step
              </h3>
              <p className="text-sm font-medium">{result.actionableStep}</p>
            </section>

            <section className="p-6 relative text-center">
              <Quote className="w-12 h-12 text-primary/10 absolute -top-2 -left-2 rotate-180" />
              <p className="text-sm italic text-muted-foreground">
                "{result.quote}"
              </p>
            </section>
          </div>

          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground hover:bg-white/5 rounded-xl"
            onClick={() => {setResult(null); setFeeling("")}}
          >
            Talk more
          </Button>
        </div>
      )}
    </div>
  )
}
