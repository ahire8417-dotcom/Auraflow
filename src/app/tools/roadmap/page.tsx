
"use client"

import { useState } from "react"
import { generateCareerRoadmap, type GenerateCareerRoadmapOutput } from "@/ai/flows/generate-career-roadmap"
import { BottomNav } from "@/components/shared/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Map, CheckCircle2, BookOpen, GraduationCap, Briefcase } from "lucide-react"

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
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold gradient-text">Career Navigator</h1>
        <p className="text-muted-foreground">AI-driven roadmap for your professional journey.</p>
      </header>

      {!result ? (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Academic Stream / Major</Label>
              <Input 
                value={formData.stream}
                onChange={(e) => setFormData({...formData, stream: e.target.value})}
                placeholder="e.g. Computer Science, Economics"
                className="glass-panel"
              />
            </div>
            <div className="space-y-2">
              <Label>Interests (comma separated)</Label>
              <Input 
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
                placeholder="e.g. AI, Music, Finance"
                className="glass-panel"
              />
            </div>
            <div className="space-y-2">
              <Label>Long-term Career Goals</Label>
              <Textarea 
                value={formData.goals}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
                placeholder="Where do you see yourself in 5 years?"
                className="h-24 glass-panel"
              />
            </div>
          </div>

          <Button 
            className="w-full h-12 rounded-xl text-lg"
            onClick={handleGenerate}
            disabled={loading || !formData.stream || !formData.goals}
          >
            {loading ? <Loader2 className="mr-2 animate-spin" /> : <Map className="mr-2" />}
            Chart My Future
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="glass-panel border-0 bg-primary/5">
            <CardHeader>
              <CardTitle className="gradient-text">{result.careerPathTitle}</CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.careerSummary}
              </p>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            <section className="space-y-3">
              <h3 className="font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Roadmap Steps</h3>
              <div className="space-y-2">
                {result.stepsToAchieve.map((step, i) => (
                  <div key={i} className="glass-panel p-3 rounded-xl text-sm flex gap-3">
                    <span className="font-bold text-primary">{i + 1}.</span>
                    {step}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold flex items-center gap-2"><BookOpen className="w-4 h-4 text-secondary" /> Skills & Courses</h3>
              <div className="grid grid-cols-2 gap-3">
                <Card className="glass-panel">
                  <CardContent className="p-3 text-[10px] space-y-1">
                    <p className="font-bold text-xs mb-2">Essential Skills</p>
                    {result.recommendedSkills.map((s, i) => <p key={i}>• {s}</p>)}
                  </CardContent>
                </Card>
                <Card className="glass-panel">
                  <CardContent className="p-3 text-[10px] space-y-1">
                    <p className="font-bold text-xs mb-2">Top Courses</p>
                    {result.recommendedCourses.map((c, i) => <p key={i}>• {c}</p>)}
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold flex items-center gap-2"><Briefcase className="w-4 h-4 text-orange-500" /> Opportunities</h3>
              <div className="flex flex-wrap gap-2">
                {result.futureOpportunities.map((o, i) => (
                  <div key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10">
                    {o}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <Button variant="outline" className="w-full rounded-xl" onClick={() => setResult(null)}>
            Generate New Roadmap
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
