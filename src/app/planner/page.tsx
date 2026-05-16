"use client"

import { useState } from "react"
import { generateStudyTimetable, type GenerateStudyTimetableOutput } from "@/ai/flows/generate-study-timetable"
import { BottomNav } from "@/components/shared/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Calendar as CalendarIcon, Clock, Plus, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState<string[]>([])
  const [newSubject, setNewSubject] = useState("")
  const [dailyHours, setDailyHours] = useState(4)
  const [loading, setLoading] = useState(false)
  const [timetable, setTimetable] = useState<GenerateStudyTimetableOutput | null>(null)

  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, newSubject.trim()])
      setNewSubject("")
    }
  }

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    if (subjects.length === 0) return
    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      const result = await generateStudyTimetable({
        subjects,
        dailyStudyHours: dailyHours,
        examDates: [],
        startDate: today,
        endDate: nextWeek
      })
      setTimetable(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold gradient-text">Dynamic Planner</h1>
        <p className="text-muted-foreground">AI-optimized schedule for peak performance.</p>
      </header>

      {!timetable ? (
        <div className="space-y-8 max-w-lg mx-auto">
          <div className="space-y-4">
            <Label className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Your Subjects</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="e.g. Mathematics" 
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="rounded-xl glass-panel"
              />
              <Button size="icon" onClick={addSubject} className="shrink-0 rounded-xl">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map((sub, i) => (
                <div key={i} className="glass-panel px-3 py-1 rounded-full flex items-center gap-2 text-sm border-primary/20 bg-primary/5">
                  {sub}
                  <button onClick={() => removeSubject(i)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Daily Study Goal</Label>
              <span className="font-bold text-primary">{dailyHours}h</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="12" 
              value={dailyHours} 
              onChange={(e) => setDailyHours(parseInt(e.target.value))}
              className="w-full accent-primary bg-white/10 h-1.5 rounded-full appearance-none"
            />
          </div>

          <Button className="w-full rounded-2xl h-14 text-lg font-headline" onClick={handleGenerate} disabled={loading || subjects.length === 0}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CalendarIcon className="w-5 h-5 mr-2" />}
            Generate Strategy
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-secondary mb-4">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              {timetable.summary}
            </p>
          </div>

          <div className="space-y-8">
            {timetable.timetable.map((day, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <div className="w-2 h-6 bg-primary rounded-full" />
                  {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>
                <div className="grid gap-3">
                  {day.studyBlocks.map((block, bIdx) => (
                    <div key={bIdx} className="glass-panel p-4 rounded-2xl flex items-center justify-between group hover:border-primary/40 transition-all">
                      <div className="flex gap-4 items-center">
                        <div className="bg-white/5 p-3 rounded-xl">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold">{block.subject}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{block.topic || "General Study"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono">{block.startTime} - {block.endTime}</p>
                        <p className="text-[10px] text-muted-foreground">{block.durationMinutes} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full rounded-xl" onClick={() => setTimetable(null)}>
            Reset & Replan
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
