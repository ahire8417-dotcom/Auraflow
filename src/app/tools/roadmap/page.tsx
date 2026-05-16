"use client"

import { useState } from "react"
import { generateCareerRoadmap, type GenerateCareerRoadmapOutput } from "@/ai/flows/generate-career-roadmap"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Map, CheckCircle2, BookOpen, Briefcase } from "lucide-react"

export default function CareerRoadmapPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateCareerRoadmapOutput | null>(null)
  const [formData, setFormData] = useState({
    stream: "",
    interests: "",
    goals: ""
  })

  const handleGenerate = async () => {
    if (!formData.stream || !formData.goals) return
    setLoading(true)
    try {
      const output = await generateCareerRoadmap({
        academicStream: formData.stream,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i !== ""),
        careerGoals: formData.goals
      })
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
        title="Career Navigator" 
        subtitle="AI Pathways" 
        showBack={true} 
        info="Strategic career navigator. Charts a detailed roadmap to your goals, identifying essential skills, courses, and jobs for your specific field."
      />

      {!result ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Academic Stream</Label>
              <Input 
                value={formData.stream}
                onChange={(e) => setFormData({...formData, stream: e.target.value})}
                placeholder="e.g. Computer Science, Economics"
                className="glass-panel h-12 rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Interests</Label>
              <Input 
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
                placeholder="e.g. AI, Design, Web Development"
                className="glass-panel h-12 rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Career Ambition</Label>
              <Textarea 
                value={formData.goals}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
                placeholder="Where do you see yourself in 5 years?"
                className="h-32 glass-panel rounded-2xl p-4"
              />
            </div>
          </div>

          <Button 
            className="w-full h-14 rounded-2xl text-lg font-headline shadow-lg shadow-primary/20"
            onClick={handleGenerate}
            disabled={loading || !formData.stream || !formData.goals}
          >
            {loading ? <Loader2 className="mr-2 animate-spin" /> : <Map className="mr-2" />}
            Chart My Future
          </Button>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <Card className="glass-panel border-0 bg-primary/5 rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-white/5">
              <CardTitle className="gradient-text text-2xl font-headline font-bold">{result.careerPathTitle}</CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed italic pt-2">
                "{result.careerSummary}"
              </p>
            </CardHeader>
          </Card>

          <div className="grid gap-6">
            <section className="space-y-4">
              <h3 className="font-bold flex items-center gap-2 px-1"><CheckCircle2 className="w-5 h-5 text-primary" /> Roadmap Steps</h3>
              <div className="space-y-3">
                {result.stepsToAchieve.map((step, i) => (
                  <div key={i} className="glass-panel p-4 rounded-2xl text-sm flex gap-4 items-start hover:border-primary/30 transition-all">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary font-bold text-[10px] shrink-0">{i + 1}</span>
                    <p className="pt-1 font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-4">
              <Card className="glass-panel border-0 rounded-3xl">
                <CardHeader className="pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Essential Skills
                  </h4>
                </CardHeader>
                <CardContent className="space-y-1.5 pt-0">
                  {result.recommendedSkills.map((s, i) => <p key={i} className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-secondary" /> {s}</p>)}
                </CardContent>
              </Card>
              <Card className="glass-panel border-0 rounded-3xl">
                <CardHeader className="pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-orange-400 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Top Opportunities
                  </h4>
                </CardHeader>
                <CardContent className="space-y-1.5 pt-0">
                  {result.futureOpportunities.map((o, i) => <p key={i} className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-orange-400" /> {o}</p>)}
                </CardContent>
              </Card>
            </section>
          </div>

          <Button variant="outline" className="w-full rounded-2xl h-12 border-white/10" onClick={() => setResult(null)}>
            Generate New Roadmap
          </Button>
        </div>
      )}
    </div>
  )
}
