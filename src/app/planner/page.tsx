"use client"

import { useState } from "react"
import { generateStudyTimetable, type GenerateStudyTimetableOutput } from "@/ai/flows/generate-study-timetable"
import { HeaderNav } from "@/components/shared/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Calendar as CalendarIcon, Clock, Plus, Trash2, GraduationCap, Sparkles } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const EDUCATION_CATEGORIES = [
  { 
    id: "primary", 
    label: "Primary (1-5)", 
    subjects: ["Mathematics", "English", "General Science", "Social Studies", "Arts"] 
  },
  { 
    id: "middle", 
    label: "Middle School (6-8)", 
    subjects: ["Algebra", "Biology", "Geography", "History", "Literature", "Physical Education"] 
  },
  { 
    id: "high", 
    label: "High School (9-12)", 
    subjects: ["Physics", "Chemistry", "Calculus", "Economics", "Computer Science", "Psychology"] 
  },
  { 
    id: "higher", 
    label: "Graduation / Higher Ed", 
    subjects: ["Data Structures", "Quantum Physics", "Marketing", "Corporate Law", "Anatomy", "Macroeconomics"] 
  }
]

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState<string[]>([])
  const [newSubject, setNewSubject] = useState("")
  const [dailyHours, setDailyHours] = useState(4)
  const [loading, setLoading] = useState(false)
  const [timetable, setTimetable] = useState<GenerateStudyTimetableOutput | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const addSubject = (subjectName?: string) => {
    const name = subjectName || newSubject.trim()
    if (name && !subjects.includes(name)) {
      setSubjects([...subjects, name])
      if (!subjectName) setNewSubject("")
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
      
      const categoryLabel = EDUCATION_CATEGORIES.find(c => c.id === selectedCategory)?.label || "General"

      const result = await generateStudyTimetable({
        subjects,
        dailyStudyHours: dailyHours,
        examDates: [],
        startDate: today,
        endDate: nextWeek,
        additionalNotes: `Student level: ${categoryLabel}. Optimize for high academic performance at this specific level.`
      })
      setTimetable(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const suggestedSubjects = EDUCATION_CATEGORIES.find(c => c.id === selectedCategory)?.subjects || []

  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <HeaderNav title="Dynamic Planner" subtitle="Category-Driven Strategy" showBack={false} />

      {!timetable ? (
        <div className="space-y-10 max-w-2xl mx-auto">
          {/* Step 1: Education Level */}
          <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 px-1">
              <GraduationCap className="w-5 h-5 text-primary" />
              <Label className="text-[10px] font-headline uppercase tracking-widest text-muted-foreground font-bold">1. Select Education Level</Label>
            </div>
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger className="h-14 rounded-2xl glass-panel border-white/10">
                <SelectValue placeholder="Where are you currently studying?" />
              </SelectTrigger>
              <SelectContent className="glass-panel border-white/10 rounded-2xl">
                {EDUCATION_CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id} className="rounded-xl focus:bg-primary/20">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          {/* Step 2: Subjects */}
          <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-2 px-1">
              <Plus className="w-5 h-5 text-primary" />
              <Label className="text-[10px] font-headline uppercase tracking-widest text-muted-foreground font-bold">2. Add Your Subjects</Label>
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Type a subject..." 
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="rounded-xl glass-panel h-12 border-white/5"
                onKeyDown={(e) => e.key === 'Enter' && addSubject()}
              />
              <Button size="icon" onClick={() => addSubject()} className="shrink-0 rounded-xl h-12 w-12 bg-primary hover:bg-primary/90">
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Suggestions */}
            {selectedCategory && (
              <div className="space-y-2 pt-2">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter px-1 flex items-center gap-1">
                   <Sparkles className="w-3 h-3 text-yellow-500" /> Suggestions for {EDUCATION_CATEGORIES.find(c => c.id === selectedCategory)?.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSubjects.map((sub, i) => (
                    <button
                      key={i}
                      onClick={() => addSubject(sub)}
                      disabled={subjects.includes(sub)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                        subjects.includes(sub) 
                          ? "bg-primary/10 border-primary/20 text-primary opacity-50 cursor-not-allowed" 
                          : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Subjects List */}
            <div className="flex flex-wrap gap-2 mt-4 min-h-[40px] p-4 rounded-3xl bg-black/20 border border-white/5">
              {subjects.length === 0 ? (
                <p className="text-xs text-muted-foreground italic w-full text-center py-2">No subjects added yet</p>
              ) : (
                subjects.map((sub, i) => (
                  <div key={i} className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 text-sm border-primary/20 bg-primary/5 animate-in fade-in zoom-in-95 group">
                    <span className="font-bold">{sub}</span>
                    <button onClick={() => removeSubject(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Step 3: Intensity */}
          <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <Label className="text-[10px] font-headline uppercase tracking-widest text-muted-foreground font-bold">3. Daily Study Goal</Label>
              </div>
              <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-xs">{dailyHours}h</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="12" 
              value={dailyHours} 
              onChange={(e) => setDailyHours(parseInt(e.target.value))}
              className="w-full accent-primary bg-white/10 h-2 rounded-full appearance-none cursor-pointer"
            />
          </section>

          <Button 
            className="w-full rounded-[2rem] h-16 text-xl font-headline shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all active:scale-95 mt-4" 
            onClick={handleGenerate} 
            disabled={loading || subjects.length === 0 || !selectedCategory}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <CalendarIcon className="w-6 h-6 mr-3" />}
            {loading ? "Optimizing Strategy..." : "Generate AI Strategy"}
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="glass-panel p-6 rounded-[2.5rem] border-l-4 border-l-primary mb-4 bg-primary/5 relative overflow-hidden">
            <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-primary/5 rotate-12" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
               <Bot className="w-4 h-4" /> Aura Insight
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed italic relative z-10">
              {timetable.summary}
            </p>
          </div>

          <div className="space-y-10">
            {timetable.timetable.map((day, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-3 px-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(140,106,255,0.5)]" />
                  {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>
                <div className="grid gap-3">
                  {day.studyBlocks.map((block, bIdx) => (
                    <div key={bIdx} className="glass-panel p-5 rounded-[2rem] flex items-center justify-between group hover:border-primary/40 transition-all cursor-default">
                      <div className="flex gap-5 items-center">
                        <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-primary/10 transition-colors">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base">{block.subject}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">{block.topic || "Intensive Review"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-bold tracking-tighter bg-white/5 px-3 py-1 rounded-lg">{block.startTime} — {block.endTime}</p>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1">{block.durationMinutes} MINS</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full rounded-2xl h-14 border-white/10 hover:bg-white/5 font-bold mt-8" onClick={() => setTimetable(null)}>
            Reset & Build New Plan
          </Button>
        </div>
      )}
    </div>
  )
}
