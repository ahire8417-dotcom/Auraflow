
"use client"

import { useState } from "react"
import { summarizeStudyDocument, type SummarizeStudyDocumentOutput } from "@/ai/flows/summarize-study-document"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, Loader2, BookOpen, Key, LayoutGrid, FileText, Download, Sparkles, RefreshCcw } from "lucide-react"

export default function Summarizer() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SummarizeStudyDocumentOutput | null>(null)
  const [fileData, setFileData] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onloadend = () => {
      setFileData(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSummarize = async () => {
    if (!fileData) return
    setLoading(true)
    try {
      const summary = await summarizeStudyDocument({
        fileContent: fileData,
        documentDescription: `Upload: ${fileName}`
      })
      setResult(summary)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setFileData(null)
    setFileName(null)
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto pb-24">
      <HeaderNav 
        title="Smart Synthesizer" 
        subtitle="High-IQ Analysis" 
        backHref="/tools"
        info="PDF to smart notes. Upload documents to instantly extract executive summaries, key exam points, and active recall flashcards."
      />

      {!result ? (
        <div className="max-w-xl mx-auto space-y-8 py-12 animate-in fade-in duration-500">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-4xl font-headline font-bold">Synthesize Knowledge</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">Upload PDFs or Notes. Aura AI extracts the absolute essentials in seconds.</p>
          </div>

          <div className="glass-panel border-dashed border-2 border-primary/20 rounded-[3rem] p-16 text-center relative hover:border-primary/50 transition-all group bg-primary/5 cursor-pointer">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt"
            />
            <div className="flex flex-col items-center gap-6 relative z-0">
              <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(140,106,255,0.2)]">
                <FileUp className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold">Drop your notes here</p>
                <p className="text-xs text-muted-foreground font-medium">PDF, DOCX, or Text (Max 10MB)</p>
              </div>
            </div>
          </div>
          
          {fileData && (
            <div className="flex items-center justify-between p-6 glass-panel rounded-3xl animate-in slide-in-from-bottom-4 border-primary/30">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold truncate max-w-[180px]">{fileName}</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">Ready for AI processing</p>
                </div>
              </div>
              <Button onClick={handleSummarize} disabled={loading} className="rounded-2xl h-12 px-10 shadow-lg shadow-primary/20 font-bold">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {loading ? "Synthesizing..." : "Analyze"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="flex justify-between items-center bg-white/5 p-5 rounded-[2rem] border border-white/10">
            <div className="flex gap-4 items-center">
               <div className="bg-primary/20 p-3 rounded-2xl"><FileText className="w-6 h-6 text-primary" /></div>
               <div>
                  <p className="font-bold text-sm truncate max-w-[200px]">{fileName}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Analysis Complete</p>
               </div>
            </div>
            <Button variant="ghost" size="sm" className="rounded-xl h-10 px-4 hover:bg-white/10" onClick={reset}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid grid-cols-4 glass-panel bg-white/5 h-16 rounded-[2rem] p-2 mb-8 border-white/5 shadow-2xl">
              <TabsTrigger value="notes" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs">
                <BookOpen className="w-4 h-4 mr-2" /><span className="hidden md:inline">Synthesis</span>
              </TabsTrigger>
              <TabsTrigger value="points" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs">
                <Key className="w-4 h-4 mr-2" /><span className="hidden md:inline">Takeaways</span>
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs">
                <LayoutGrid className="w-4 h-4 mr-2" /><span className="hidden md:inline">Flashcards</span>
              </TabsTrigger>
              <TabsTrigger value="chapters" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-xs">
                <FileText className="w-4 h-4 mr-2" /><span className="hidden md:inline">Structure</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="mt-0 outline-none">
              <Card className="glass-panel border-0 rounded-[3rem] overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 px-8 py-6">
                  <CardTitle className="text-xl font-headline font-bold flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Executive Synthesis</CardTitle>
                </CardHeader>
                <CardContent className="p-10 text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {result.shortNotes}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="points" className="mt-0 outline-none">
              <div className="grid gap-4">
                {result.keyPoints.map((point, i) => (
                  <div key={i} className="glass-panel p-6 rounded-[2rem] flex gap-5 items-start hover:bg-white/5 transition-all group border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Key className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold leading-relaxed pt-2 text-foreground/90">{point}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="flashcards" className="mt-0 outline-none">
              <div className="grid md:grid-cols-2 gap-5">
                {result.flashcards.map((card, i) => (
                  <Card key={i} className="glass-panel border-0 rounded-[2.5rem] hover:border-primary/40 transition-all border border-transparent shadow-xl">
                    <CardContent className="p-8 space-y-5">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Active Recall Q</p>
                        <p className="font-bold text-base leading-tight">{card.question}</p>
                      </div>
                      <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Answer Breakdown</p>
                         <p className="text-sm text-muted-foreground italic leading-relaxed">{card.answer}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chapters" className="mt-0 outline-none">
              <div className="space-y-5">
                {result.chapterSummaries.map((chapter, i) => (
                  <div key={i} className="glass-panel p-10 rounded-[3rem] border-l-4 border-l-primary bg-primary/5">
                    <h3 className="text-xl font-headline font-bold text-white mb-4">{chapter.chapterTitle || `Section ${i+1}`}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80">"{chapter.summary}"</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-4">
             <Button variant="outline" className="flex-1 h-16 rounded-[2rem] font-bold border-white/10 hover:bg-white/5" onClick={reset}>
                New Analysis
             </Button>
             <Button className="flex-1 h-16 rounded-[2rem] font-bold gap-3 shadow-xl shadow-primary/30">
                <Download className="w-5 h-5" /> Export Synthesis
             </Button>
          </div>
        </div>
      )}
    </div>
  )
}
