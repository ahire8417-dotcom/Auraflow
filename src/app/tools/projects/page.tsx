"use client"

import { useState } from "react"
import { generateProjectIdeas, type ProjectIdeasOutput } from "@/ai/flows/generate-project-ideas"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Lightbulb, Code2, Rocket, ArrowRight } from "lucide-react"

export default function ProjectIdeaGenerator() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ProjectIdeasOutput | null>(null)
  const [skills, setSkills] = useState("")
  const [interest, setInterest] = useState("")

  const handleGenerate = async () => {
    if (!skills || !interest) return
    setLoading(true)
    try {
      const output = await generateProjectIdeas({
        skills: skills.split(',').map(s => s.trim()),
        interestArea: interest,
        complexity: 'intermediate'
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
      <HeaderNav title="Project Spark" subtitle="Portfolio Generator" />

      {!result ? (
        <Card className="glass-panel border-0">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Your Skills (comma separated)</Label>
              <Input 
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Python, Figma, SQL..."
                className="glass-panel"
              />
            </div>
            <div className="space-y-2">
              <Label>Interest Area</Label>
              <Input 
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="Health, Finance, Gaming, AI..."
                className="glass-panel"
              />
            </div>
            <Button 
              className="w-full h-12 rounded-xl text-lg font-headline"
              onClick={handleGenerate}
              disabled={loading || !skills || !interest}
            >
              {loading ? <Loader2 className="mr-2 animate-spin" /> : <Lightbulb className="mr-2" />}
              Ignite Ideas
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6">
            {result.ideas.map((idea, idx) => (
              <Card key={idx} className="glass-panel border-0 overflow-hidden group">
                <CardHeader className="bg-primary/5 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-headline text-primary">{idea.title}</CardTitle>
                    <Rocket className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {idea.description}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-50">Core Features</p>
                    <ul className="grid grid-cols-1 gap-1">
                      {idea.keyFeatures.map((f, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {idea.techStack.map((tech, i) => (
                      <Badge key={i} variant="secondary" className="bg-white/5 border-white/10">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-secondary mb-1">Learning Outcome</p>
                    <p className="text-xs italic">"{idea.learningOutcome}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            variant="outline" 
            className="w-full rounded-xl"
            onClick={() => setResult(null)}
          >
            Generate New Sparks
          </Button>
        </div>
      )}
    </div>
  )
}
