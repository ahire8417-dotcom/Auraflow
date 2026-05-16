"use client"

import { useState } from "react"
import { generateProjectIdeas, type ProjectIdeasOutput } from "@/ai/flows/generate-project-ideas"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Lightbulb, Code2, Rocket, ArrowRight, Target, Zap, ShieldCheck, Sparkles, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProjectIdeaGenerator() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ProjectIdeasOutput | null>(null)
  const [skills, setSkills] = useState("")
  const [interest, setInterest] = useState("")
  const [complexity, setComplexity] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')

  const handleGenerate = async () => {
    if (!skills || !interest) return
    setLoading(true)
    try {
      const output = await generateProjectIdeas({
        skills: skills.split(',').map(s => s.trim()).filter(s => s !== ""),
        interestArea: interest,
        complexity: complexity
      })
      setResult(output)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <HeaderNav 
        title="Project Spark" 
        subtitle="Elite Portfolio Architect" 
        showBack={true} 
        info="Elite portfolio architect. Generates unique project ideas with creative twists and market impact analysis to make your resume stand out."
      />

      {!result ? (
        <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4">
          <section className="text-center space-y-2">
            <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(140,106,255,0.2)]">
              <Lightbulb className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-headline font-bold">Ignite Your Portfolio</h2>
            <p className="text-muted-foreground text-sm">Generate project concepts that elite recruiters actually care about.</p>
          </section>

          <Card className="glass-panel border-0 p-8 rounded-[3rem]">
            <CardContent className="space-y-8 p-0">
              <div className="grid gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">My Skill Stack</Label>
                  <Input 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, Node.js, Python, Figma"
                    className="glass-panel h-14 rounded-2xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Interest Domain</Label>
                  <Input 
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder="e.g. FinTech, Sustainability, HealthTech, AI"
                    className="glass-panel h-14 rounded-2xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Target Complexity</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setComplexity(lvl as any)}
                        className={cn(
                          "h-12 rounded-xl text-xs font-bold capitalize transition-all border",
                          complexity === lvl 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                            : "glass-panel text-muted-foreground border-white/5 hover:bg-white/5"
                        )}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-16 rounded-[2rem] text-xl font-headline shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
                onClick={handleGenerate}
                disabled={loading || !skills || !interest}
              >
                {loading ? <Loader2 className="mr-3 animate-spin" /> : <Rocket className="mr-3" />}
                {loading ? "Architecting Ideas..." : "Generate Spark"}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center justify-between bg-primary/5 p-6 rounded-[2.5rem] border border-primary/20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Domain Focus</p>
              <h3 className="text-xl font-bold">{interest}</h3>
            </div>
            <Button variant="outline" className="rounded-xl border-white/10 h-10 px-6 font-bold" onClick={() => setResult(null)}>
              Change Parameters
            </Button>
          </div>

          <div className="grid gap-8">
            {result.ideas.map((idea, idx) => (
              <Card key={idx} className="glass-panel border-0 rounded-[3rem] overflow-hidden group hover:border-primary/30 transition-all">
                <CardHeader className="bg-white/5 border-b border-white/5 p-8 flex flex-row items-center justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2 border-primary/30 text-primary text-[9px] uppercase font-bold tracking-widest">
                       {complexity} Challenge
                    </Badge>
                    <CardTitle className="text-2xl font-headline font-bold">{idea.title}</CardTitle>
                  </div>
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-7 h-7 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {idea.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Strategic Features</h4>
                      </div>
                      <ul className="space-y-2">
                        {idea.keyFeatures.map((f, i) => (
                          <li key={i} className="text-sm flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span className="font-medium">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-6">
                       <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/20 relative overflow-hidden">
                          <Sparkles className="absolute -right-2 -top-2 w-12 h-12 text-primary/10" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">The Spark (Unique Twist)</h4>
                          <p className="text-sm font-semibold italic text-foreground leading-relaxed">"{idea.uniqueSpark}"</p>
                       </div>

                       <div className="p-5 bg-secondary/5 rounded-[2rem] border border-secondary/20">
                          <TrendingUp className="w-4 h-4 text-secondary mb-2" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Career & Market Impact</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{idea.marketImpact}</p>
                       </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-2">
                    {idea.techStack.map((tech, i) => (
                      <Badge key={i} variant="secondary" className="bg-white/5 border-white/10 px-4 py-1.5 rounded-full text-[11px] font-bold">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="p-4 bg-black/20 rounded-2xl border border-white/5 flex items-center gap-4">
                    <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Expert Learning Outcome</p>
                      <p className="text-sm font-medium">{idea.learningOutcome}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            className="w-full h-16 rounded-[2rem] bg-white text-black hover:bg-white/90 font-bold transition-all active:scale-95"
            onClick={() => setResult(null)}
          >
            Reset & Engineer New Concepts
          </Button>
        </div>
      )}
    </div>
  )
}
