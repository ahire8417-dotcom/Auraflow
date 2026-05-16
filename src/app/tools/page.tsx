"use client"

import { HeaderNav } from "@/components/shared/header-nav"
import { Bot, FileText, MessageSquare, Map, Pencil, Heart, Lightbulb, Plus, BrainCircuit } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const tools = [
  {
    title: "Doubt Solver",
    desc: "Instant academic step-by-step help",
    icon: MessageSquare,
    href: "/tools/solver",
    color: "bg-purple-500"
  },
  {
    title: "Document Synthesizer",
    desc: "PDF to short notes & flashcards",
    icon: FileText,
    href: "/tools/summarizer",
    color: "bg-blue-500"
  },
  {
    title: "Quiz Master",
    desc: "AI-generated study challenges",
    icon: BrainCircuit,
    href: "/tools/quiz",
    color: "bg-indigo-500"
  },
  {
    title: "Project Spark",
    desc: "AI-generated portfolio ideas",
    icon: Lightbulb,
    href: "/tools/projects",
    color: "bg-yellow-500"
  },
  {
    title: "Aura Companion",
    desc: "Motivation & Wellness support",
    icon: Heart,
    href: "/tools/motivation",
    color: "bg-pink-500"
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
    href: "/tools/roadmap",
    color: "bg-orange-500"
  }
]

export default function AITools() {
  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto">
      <HeaderNav title="AI Arsenal" subtitle="Supercharge your intellect" showBack={true} />

      <div className="grid gap-4 mt-6">
        {tools.map((tool) => (
          <Link key={tool.title} href={tool.href}>
            <div className="glass-panel p-5 rounded-2xl flex items-center gap-5 hover:border-primary/50 transition-all group cursor-pointer active:scale-[0.98]">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform group-hover:scale-110", tool.color)}>
                <tool.icon className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-headline font-bold text-lg truncate">{tool.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{tool.desc}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
