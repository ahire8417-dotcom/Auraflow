
"use client"

import { useState } from "react"
import { suggestResumeContent, type SuggestResumeContentOutput } from "@/ai/flows/suggest-resume-content"
import { BottomNav } from "@/components/shared/bottom-nav"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, FileText, Sparkles, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ResumeBuilder() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SuggestResumeContentOutput | null>(null)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    section: "Experience",
    summary: "",
    jobDesc: "",
    content: ""
  })

  const handleGenerate = async () => {
    if (!formData.summary) return
    setLoading(true)
    try {
      const output = await suggestResumeContent({
        resumeSection: formData.section,
        studentSummary: formData.summary,
        jobDescription: formData.jobDesc,
        existingSectionContent: formData.content
      })
      setResult(output)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.suggestedContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold gradient-text">Resume Optimizer</h1>
        <p className="text-muted-foreground">Craft ATS-friendly sections with AI precision.</p>
      </header>

      {!result ? (
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Target Section</Label>
              <Input 
                value={formData.section}
                onChange={(e) => setFormData({...formData, section: e.target.value})}
                placeholder="e.g. Experience, Projects, Summary"
                className="glass-panel"
              />
            </div>
            <div className="space-y-2">
              <Label>Your Profile Summary</Label>
              <Textarea 
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                placeholder="Briefly describe your background, skills, and goals..."
                className="h-24 glass-panel"
              />
            </div>
            <div className="space-y-2">
              <Label>Target Job Description (Optional)</Label>
              <Textarea 
                value={formData.jobDesc}
                onChange={(e) => setFormData({...formData, jobDesc: e.target.value})}
                placeholder="Paste the job requirements to tailor your resume..."
                className="h-24 glass-panel"
              />
            </div>
            <div className="space-y-2">
              <Label>Existing Content (Optional)</Label>
              <Textarea 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Any drafted text you want AI to refine..."
                className="h-24 glass-panel"
              />
            </div>
          </div>

          <Button 
            className="w-full h-12 rounded-xl text-lg"
            onClick={handleGenerate}
            disabled={loading || !formData.summary}
          >
            {loading ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
            Generate Professional Content
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="glass-panel border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Suggested Content</CardTitle>
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {result.suggestedContent}
              </div>
            </CardContent>
          </Card>

          <section className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">ATS Key Phrases</h3>
            <div className="flex flex-wrap gap-2">
              {result.keyPhrases.map((phrase, i) => (
                <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {phrase}
                </Badge>
              ))}
            </div>
          </section>

          <Button 
            variant="outline" 
            className="w-full rounded-xl"
            onClick={() => setResult(null)}
          >
            Refine Another Section
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
