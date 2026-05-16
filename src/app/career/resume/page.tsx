"use client"

import { useState } from "react"
import { suggestResumeContent, type SuggestResumeContentOutput } from "@/ai/flows/suggest-resume-content"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, FileText, Sparkles, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { HeaderNav } from "@/components/shared/header-nav"

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
    <div className="min-h-full p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      <HeaderNav title="Resume Optimizer" subtitle="ATS-friendly builder" showBack={true} />

      {!result ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Target Section</Label>
              <Input 
                value={formData.section}
                onChange={(e) => setFormData({...formData, section: e.target.value})}
                placeholder="e.g. Experience, Projects, Summary"
                className="glass-panel h-12 rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Your Profile Summary</Label>
              <Textarea 
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                placeholder="Briefly describe your background, skills, and goals..."
                className="h-32 glass-panel rounded-2xl p-4"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Job Description (Optional)</Label>
              <Textarea 
                value={formData.jobDesc}
                onChange={(e) => setFormData({...formData, jobDesc: e.target.value})}
                placeholder="Paste the job requirements to tailor content..."
                className="h-32 glass-panel rounded-2xl p-4"
              />
            </div>
          </div>

          <Button 
            className="w-full h-14 rounded-2xl text-lg font-headline shadow-lg shadow-primary/20"
            onClick={handleGenerate}
            disabled={loading || !formData.summary}
          >
            {loading ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
            Generate Content
          </Button>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <Card className="glass-panel border-0 border-l-4 border-l-primary rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white/5">
              <CardTitle className="text-lg font-bold">Suggested Content</CardTitle>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} className="hover:bg-primary/20">
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground bg-black/20 p-4 rounded-2xl border border-white/5">
                {result.suggestedContent}
              </div>
            </CardContent>
          </Card>

          <section className="space-y-4 px-2">
            <h3 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText className="w-3 h-3" /> ATS Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.keyPhrases.map((phrase, i) => (
                <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full">
                  {phrase}
                </Badge>
              ))}
            </div>
          </section>

          <Button 
            variant="outline" 
            className="w-full rounded-2xl h-12 border-white/10"
            onClick={() => setResult(null)}
          >
            Refine Another Section
          </Button>
        </div>
      )}
    </div>
  )
}
