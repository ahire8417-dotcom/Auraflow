"use client"

import { useState } from "react"
import { generateCareerRoadmap, type GenerateCareerRoadmapOutput } from "@/ai/flows/generate-career-roadmap"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Map, CheckCircle2, BookOpen, Briefcase, Sparkles, TrendingUp, Zap, Target, ArrowRight, Share2, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const QUICK_STREAMS = ["Computer Science", "Commerce / Finance", "Science (PCM/PCB)", "Humanities / Arts", "Design / Creative"]
const QUICK_INTERESTS = ["AI & Machine Learning", "Sustainability", "Digital Marketing", "Psychology", "Content Creation", "Finance & Web3"]

export default function CareerRoadmapPage() {
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [result, setResult] = useState<GenerateCareerRoadmapOutput | null>(null)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    stream: "",
    interests: [] as string[],
    goals: ""
  })

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleGenerate = async () => {
    if (!formData.stream || !formData.goals) return
    setLoading(true)
    try {
      const output = await generateCareerRoadmap({
        academicStream: formData.stream,
        interests: formData.interests,
        careerGoals: formData.goals
      })
      setResult(output)
    } catch (err) {
      console.error(err)
      toast({ variant: "destructive", title: "Strategy Error", description: "Failed to architect roadmap." })
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = () => {
    setPublishing(true)
    setTimeout(() => {
      setPublishing(false)
      toast({
        title: "Roadmap Published",
        description: "Your career trajectory is now visible in the Global Portfolio.",
      })
    }, 1500)
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-3xl mx-auto space-y-8">
      <HeaderNav 
        title="Career Navigator" 
        subtitle="Strategic Career Architect" 
        showBack={true} 
        info="Elite Gen Z career strategist. Charts a high-velocity roadmap leveraging modern industry shifts like AI, the creator economy, and purpose-driven roles."
      />

      {!result ? (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-3">
             <div className="w-20 h-20 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(140,106,255,0.2)]">
                <Map className="w-10 h-10 text-primary" />
             </div>
             <h2 className="text-3xl font-headline font-bold">Chart Your Trajectory</h2>
             <p className="text-muted-foreground text-sm max-w-sm mx-auto">Strategic pathways for the modern economy. No outdated advice, just high-impact roadmaps.</p>
          </div>

          <Card className="glass-panel border-0 p-8 rounded-[3rem] space-y-8">
            <div className="grid gap-8">
              {/* Stream Selection */}
              <div className="space-y-4">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-1">1. Academic Context</Label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_STREAMS.map(s => (
                    <button
                      key={s}
                      onClick={() => setFormData({ ...formData, stream: s })}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                        formData.stream === s 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                          : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <Input 
                  value={formData.stream}
                  onChange={(e) => setFormData({...formData, stream: e.target.value})}
                  placeholder="Or type custom stream..."
                  className="glass-panel h-12 rounded-xl border-white/5"
                />
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-1">2. Modern Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_INTERESTS.map(i => (
                    <button
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                        formData.interests.includes(i) 
                          ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20" 
                          : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ambition */}
              <div className="space-y-4">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-1">3. Future Vision</Label>
                <Textarea 
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  placeholder="Where do you want to be in 5 years? (e.g. Lead Engineer at a green-tech startup, Creative Director for a major brand...)"
                  className="h-32 glass-panel rounded-3xl p-6 text-sm leading-relaxed border-white/5 resize-none"
                />
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-[2rem] text-xl font-headline shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 transition-all active:scale-95"
              onClick={handleGenerate}
              disabled={loading || !formData.stream || !formData.goals}
            >
              {loading ? <Loader2 className="mr-3 animate-spin" /> : <TrendingUp className="mr-3" />}
              {loading ? "Architecting Roadmap..." : "Generate Strategy"}
            </Button>
          </Card>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Header Briefing */}
          <section className="glass-panel border-0 bg-primary/5 rounded-[3.5rem] p-10 relative overflow-hidden">
            <Sparkles className="absolute -right-6 -top-6 w-32 h-32 text-primary/5 rotate-12" />
            <div className="relative z-10 space-y-4">
               <div className="flex items-center justify-between">
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Expert Recommendation
                  </Badge>
                  <div className="text-[10px] font-bold text-secondary flex items-center gap-1.5">
                    <Zap className="w-3 h-3" /> MARKET VIBE: {result.marketVibe}
                  </div>
               </div>
               <h2 className="text-3xl md:text-4xl font-headline font-bold gradient-text">{result.careerPathTitle}</h2>
               <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                  {result.careerSummary}
               </p>
            </div>
          </section>

          {/* Strategic Timeline */}
          <section className="space-y-6">
            <h3 className="text-lg font-headline font-bold flex items-center gap-3 px-2">
              <Target className="w-5 h-5 text-primary" /> Strategic Milestones
            </h3>
            <div className="space-y-4 relative">
              <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary via-secondary to-transparent hidden md:block" />
              {result.milestones.map((step, i) => (
                <div key={i} className="glass-panel p-6 rounded-[2.5rem] flex gap-6 items-start hover:border-primary/40 transition-all relative group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all shadow-xl">
                    <span className="text-lg font-headline font-bold text-primary">{i + 1}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-lg leading-tight">{step.title}</h4>
                      <Badge variant="outline" className="border-white/10 text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                        {step.timeframe}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills & Resources Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-panel border-0 rounded-[2.5rem] p-8 space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                <Zap className="w-4 h-4" /> Essential Skill Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.recommendedSkills.map((s, i) => (
                  <Badge key={i} className="bg-secondary/10 text-secondary border-secondary/20 px-4 py-2 rounded-xl text-xs font-bold">
                    {s}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="glass-panel border-0 rounded-[2.5rem] p-8 space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-orange-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Top Opportunities
              </h4>
              <div className="space-y-3">
                {result.futureOpportunities.map((o, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 group hover:bg-orange-400/10 hover:border-orange-400/30 transition-all">
                     <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                     <span className="text-sm font-bold text-foreground/90">{o}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="pt-6 pb-12 flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              className="flex-1 rounded-2xl h-14 border-white/10 hover:bg-white/5 font-bold"
              onClick={() => setResult(null)}
            >
              Reset & Adjust Goals
            </Button>
            <Button 
              className="flex-1 rounded-2xl h-14 bg-primary hover:bg-primary/90 font-bold shadow-xl shadow-primary/20 gap-2"
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              {publishing ? "Publishing..." : "Publish to Portfolio"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
