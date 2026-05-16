"use client"

import { useState } from "react"
import { summarizeStudyDocument, type SummarizeStudyDocumentOutput } from "@/ai/flows/summarize-study-document"
import { BottomNav } from "@/components/shared/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, Loader2, BookOpen, Key, LayoutGrid, CheckCircle } from "lucide-react"

export default function Summarizer() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SummarizeStudyDocumentOutput | null>(null)
  const [fileData, setFileData] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
        documentDescription: "Academic notes upload"
      })
      setResult(summary)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold gradient-text">Smart Synthesizer</h1>
        <p className="text-muted-foreground">Upload PDFs/Notes for instant study aids.</p>
      </header>

      {!result ? (
        <div className="max-w-md mx-auto space-y-6">
          <div className="glass-panel border-dashed border-2 border-white/20 rounded-3xl p-12 text-center relative hover:border-primary/50 transition-all">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <FileUp className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-bold">Click or drag to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, or TXT (Max 10MB)</p>
              </div>
            </div>
          </div>
          
          {fileData && (
            <div className="flex items-center justify-between p-4 glass-panel rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Document ready</span>
              </div>
              <Button onClick={handleSummarize} disabled={loading} size="sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Generate
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid grid-cols-4 glass-panel bg-white/5 h-12 rounded-xl mb-6">
              <TabsTrigger value="notes"><BookOpen className="w-4 h-4 mr-1 md:mr-2" /></TabsTrigger>
              <TabsTrigger value="points"><Key className="w-4 h-4 mr-1 md:mr-2" /></TabsTrigger>
              <TabsTrigger value="flashcards"><LayoutGrid className="w-4 h-4 mr-1 md:mr-2" /></TabsTrigger>
              <TabsTrigger value="chapters">Sections</TabsTrigger>
            </TabsList>

            <TabsContent value="notes">
              <Card className="glass-panel">
                <CardHeader><CardTitle className="text-lg">Overall Summary</CardTitle></CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">{result.shortNotes}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="points">
              <div className="grid gap-3">
                {result.keyPoints.map((point, i) => (
                  <div key={i} className="glass-panel p-4 rounded-xl flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <p className="text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="flashcards">
              <div className="grid gap-4">
                {result.flashcards.map((card, i) => (
                  <Card key={i} className="glass-panel overflow-hidden border-l-4 border-l-primary">
                    <CardContent className="p-4 space-y-2">
                      <p className="font-bold text-sm">Q: {card.question}</p>
                      <p className="text-sm text-muted-foreground italic">A: {card.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chapters">
              <div className="space-y-4">
                {result.chapterSummaries.map((chapter, i) => (
                  <div key={i} className="glass-panel p-5 rounded-2xl">
                    <h3 className="font-bold text-primary mb-2">{chapter.chapterTitle || `Section ${i+1}`}</h3>
                    <p className="text-sm text-muted-foreground">{chapter.summary}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Button variant="outline" className="w-full rounded-xl" onClick={() => {setResult(null); setFileData(null)}}>
            Upload New Document
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
