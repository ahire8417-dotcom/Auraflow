
"use client"

import { useState } from "react"
import { suggestResumeContent, type SuggestResumeContentOutput } from "@/ai/flows/suggest-resume-content"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, FileText, Sparkles, Copy, Check, Zap, Target, Briefcase, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { HeaderNav } from "@/components/shared/header-nav"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

const QUICK_SECTIONS = [
  { label: "Experience", icon: Briefcase },
  { label: "Projects", icon: Target },
  { label: "Summary", icon: Zap },
  { label: "Skills", icon: Award },
]

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
    if (!formData.summary) {
      toast({ variant: "destructive", title: "Missing Context", description: "Please provide your experience details." })
      return
    }
    setLoading(true)
    try {
      const output = await suggestResumeContent({
        resumeSection: formData.section,
        studentSummary: formData.summary,
        jobDescription: formData.jobDesc,
        existingSectionContent: formData.content
      })
      setResult(output)
      toast({ title: "Strategy Generated", description: "ATS-optimized content is ready." })
    } catch (err) {
      console.error(err)
      toast({ variant: "destructive", title: "Synthesis Error", description: "Failed to engineer resume content." })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.suggestedContent)
      setCopied(true)
      toast({ title: "Copied!", description: "Content ready for your resume document." })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <HeaderNav 
        title="Resume Optimizer" 
        subtitle="Identity Strategist" 
        showBack={true} 
        info="ATS-optimized professional strategist. Crafts powerful bullet points using high-impact action verbs and metric-driven results tailored to specific roles."
      />

      {!result ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Quick Selection Grid */}
          <section className="space-y-3">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Target Section</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {QUICK_SECTIONS.map((sec) => (
                <button
                  key={sec.label}
                  onClick={() => setFormData({ ...formData, section: sec.label })}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
                    formData.section === sec.label
                      ? "bg-primary/10 border-primary text-primary"
                      : "glass-panel hover:bg-white/5 border-white/5"
                  )}
                >
                  <sec.icon className="w-5 h-5" />
                  <span className="text-xs font-bold">{sec.label}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="grid gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Your Context / Experience</Label>
              <Textarea 
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                placeholder="e.g., I built a React app for a local library that handles 100+ daily visitors..."
                className="h-32 glass-panel rounded-[1.5rem] p-4 text-sm leading-relaxed border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">Target Job Description (Optional)</Label>
                <Badge variant="outline" className="text-[9px] opacity-60 border-primary/20">Boosts ATS</Badge>
              </div>
              <Textarea 
                value={formData.jobDesc}
                onChange={(e) => setFormData({...formData, jobDesc: e.target.value})}
                placeholder="Paste the job requirements to tailor with high-impact keywords..."
                className="h-32 glass-panel rounded-[1.5rem] p-4 text-sm leading-relaxed border-white/10"
              />
            </div>
          </div>

          <Button 
            className="w-full h-16 rounded-[2rem] text-lg font-headline shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
            onClick={handleGenerate}
            disabled={loading || !formData.summary}
          >
            {loading ? <Loader2 className="mr-3 animate-spin" /> : <Sparkles className="mr-3" />}
            {loading ? "Engineering Strategy..." : "Generate Pro Points"}
          </Button>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Result Card */}
          <Card className="glass-panel border-0 border-l-4 border-l-primary rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4 bg-primary/5">
              <div>
                <CardTitle className="text-lg font-bold">Refined {formData.section}</CardTitle>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Ready for copy-paste</p>
              </div>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-12 w-12 rounded-xl hover:bg-primary/20">
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground bg-black/20 p-6 rounded-[2rem] border border-white/5 font-medium">
                {result.suggestedContent}
              </div>
            </CardContent>
          </Card>

          {/* AI Pro Tip */}
          <section className="glass-panel p-6 rounded-[2.5rem] bg-secondary/5 border-secondary/20 relative overflow-hidden group">
            <Sparkles className="absolute -right-4 -top-4 w-20 h-20 text-secondary/10 rotate-12 group-hover:rotate-0 transition-transform" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" /> AI Strategist Tip
            </h4>
            <p className="text-sm italic text-muted-foreground leading-relaxed relative z-10">
              "{result.proTip}"
            </p>
          </section>

          {/* Keywords Section */}
          <section className="space-y-4 px-2">
            <h3 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Target className="w-3 h-3" /> Top ATS Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.keyPhrases.map((phrase, i) => (
                <Badge key={phrase + i} variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold">
                  {phrase}
                </Badge>
              ))}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-4 pb-12">
            <Button 
              variant="outline" 
              className="flex-1 rounded-2xl h-14 border-white/10 hover:bg-white/5 font-bold"
              onClick={() => setResult(null)}
            >
              Adjust Strategy
            </Button>
            <Button 
              className="flex-1 rounded-2xl h-14 bg-primary hover:bg-primary/90 font-bold shadow-xl shadow-primary/20"
              onClick={copyToClipboard}
            >
              {copied ? "Copied!" : "Copy Content"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
