"use client"

import { useState } from "react"
import { summarizeStudyDocument, type SummarizeStudyDocumentOutput } from "@/ai/flows/summarize-study-document"
import { BottomNav } from "@/components/shared/bottom-nav"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, Loader2, BookOpen, Key, LayoutGrid, FileText, Download, Sparkles } from "lucide-react"

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

  return (
    <div className="min-h-screen p-4 pb-24 max-w-4xl mx-auto">
      <HeaderNav title="Smart Synthesizer" subtitle="Document IQ" />

      {!result ? (
        <div className="max-w-xl mx-auto space-y-8 py-12">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-headline font-bold">Synthesize Knowledge</h2>
            <p className="text-muted-foreground text-sm">Upload study materials to generate notes and flashcards instantly.</p>
          </div>

          <div className="glass-panel border-dashed border-2 border-white/10 rounded-[3rem] p-16 text-center relative hover:border-primary/50 transition-all group bg-primary/5">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt"
            />
            <div className="flex flex-col items-center gap-6 relative z-0">
              <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                <FileUp className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold">Drop your notes here</p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, or Text (Max 10MB)</p>
              </div>
            </div>
          </div>
          
          {fileData && (
            <div className="flex items-center justify-between p-5 glass-panel rounded-3xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold truncate max-w-[150px]">{fileName}</p>
                  <p className="text-[10px] text-green-500 font-bold uppercase">Ready for Analysis</p>
                </div>
              </div>
              <Button onClick={handleSummarize} disabled={loading} className="rounded-2xl h-12 px-8 shadow-lg shadow-primary/20">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                Analyze
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10">
            <div className="flex gap-4 items-center">
               <div className="bg-primary/20 p-2 rounded-xl"><FileText className="w-5 h-5 text-primary" /></div>
               <p className="font-bold text-sm truncate max-w-[200px]">{fileName}</p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-xl text-[10px] uppercase font-bold tracking-widest" onClick={() => {setResult(null); setFileData(null)}}>
              Reset
            </Button>
          </div>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid grid-cols-4 glass-panel bg-white/5 h-16 rounded-[2rem] p-2 mb-8 border-white/5 shadow-2xl">
              <TabsTrigger value="notes" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 mr-2" /><span className="hidden md:inline">Summary</span>
              </TabsTrigger>
              <TabsTrigger value="points" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <Key className="w-4 h-4 mr-2" /><span className="hidden md:inline">Key Takeaways</span>
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <LayoutGrid className="w-4 h-4 mr-2" /><span className="hidden md:inline">Flashcards</span>
              </TabsTrigger>
              <TabsTrigger value="chapters" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <span className="hidden md:inline">Sections</span>
                <FileText className="w-4 h-4 md:hidden" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="mt-0">
              <Card className="glass-panel border-0 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5">
                  <CardTitle className="text-xl flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Executive Notes</CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {result.shortNotes}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="points" className="mt-0">
              <div className="grid gap-4">
                {result.keyPoints.map((point, i) => (
                  <div key={i} className="glass-panel p-6 rounded-[2rem] flex gap-5 items-start hover:bg-white/5 transition-colors group">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium leading-relaxed pt-1.5">{point}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="flashcards" className="mt-0">
              <div className="grid md:grid-cols-2 gap-4">
                {result.flashcards.map((card, i) => (
                  <Card key={i} className="glass-panel border-0 rounded-[2rem] hover:border-primary/30 transition-all border border-transparent">
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Question</p>
                        <p className="font-bold text-sm leading-snug">{card.question}</p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Answer</p>
                         <p className="text-xs text-muted-foreground italic leading-relaxed">{card.answer}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chapters" className="mt-0">
              <div className="space-y-4">
                {result.chapterSummaries.map((chapter, i) => (
                  <div key={i} className="glass-panel p-8 rounded-[2.5rem] border-l-4 border-l-primary">
                    <h3 className="text-lg font-bold text-white mb-3">{chapter.chapterTitle || `Section ${i+1}`}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{chapter.summary}"</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4">
             <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => {setResult(null); setFileData(null)}}>
                Upload New
             </Button>
             <Button className="flex-1 h-14 rounded-2xl font-bold gap-2">
                <Download className="w-5 h-5" /> Export PDF
             </Button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
