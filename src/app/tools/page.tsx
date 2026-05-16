"use client"

import { BottomNav } from "@/components/shared/bottom-nav"
import { Bot, FileText, MessageSquare, Map, Pencil } from "lucide-react"
import Link from "next/link"

const tools = [
  {
    title: "Document Synthesizer",
    desc: "PDF to short notes & flashcards",
    icon: FileText,
    href: "/tools/summarizer",
    color: "bg-blue-500"
  },
  {
    title: "Doubt Solver",
    desc: "Instant academic step-by-step help",
    icon: MessageSquare,
    href: "/tools/solver",
    color: "bg-purple-500"
  },
  {
    title: "Resume Builder",
    desc: "AI-powered professional resumes",
    icon: Pencil,
    href: "/career/resume",
    color: "bg-emerald-500"
  },
  {
    title: "Career Roadmap",
    desc: "Pathways to your dream job",
    icon: Map,
    href: "/career/roadmap",
    color: "bg-orange-500"
  }
]

export default function AITools() {
  return (
    <div className="min-h-screen p-4 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold gradient-text">AI Arsenal</h1>
        <p className="text-muted-foreground">Supercharge your studies with intelligence.</p>
      </header>

      <div className="grid gap-4">
        {tools.map((tool) => (
          <Link key={tool.title} href={tool.href}>
            <div className="glass-panel p-5 rounded-2xl flex items-center gap-5 hover:border-primary/50 transition-all group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white", tool.color)}>
                <tool.icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-headline font-bold text-lg">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
import { Plus } from "lucide-react"
