
"use client"

import { useState } from "react"
import { 
  GraduationCap, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowUpRight, 
  Sparkles, 
  Globe, 
  Code2, 
  Cpu, 
  Leaf, 
  Coins 
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { HeaderNav } from "@/components/shared/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const CAREER_NICHES = [
  { 
    title: "AI Architect", 
    vibe: "High Velocity", 
    icon: Cpu, 
    color: "text-purple-400 bg-purple-400/10",
    desc: "Designing neural architectures for the next decade."
  },
  { 
    title: "Eco-Tech Lead", 
    vibe: "Purpose Driven", 
    icon: Leaf, 
    color: "text-green-400 bg-green-400/10",
    desc: "Scaling sustainability through engineering & policy."
  },
  { 
    title: "Web3 Strategist", 
    vibe: "Decentralized", 
    icon: Coins, 
    color: "text-orange-400 bg-orange-400/10",
    desc: "Defining the economics of digital ownership."
  },
  { 
    title: "Cyber Guardian", 
    vibe: "Mission Critical", 
    icon: Target, 
    color: "text-blue-400 bg-blue-400/10",
    desc: "Protecting global infrastructure from neural threats."
  }
]

export default function CareerHub() {
  const [activeTab, setActiveTab] = useState('strategy')

  return (
    <div className="min-h-full p-4 md:p-8 max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      <HeaderNav 
        title="Future Path" 
        subtitle="Career Intelligence Hub" 
        showBack={true} 
        info="Strategic career architect. Charts high-velocity trajectories by analyzing industry shifts, AI disruption, and emerging global niches."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Strategic Tools */}
        <div className="lg:col-span-2 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/tools/roadmap" className="block group">
              <div className="glass-panel p-8 rounded-[2.5rem] border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer relative overflow-hidden h-full">
                <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-primary/10 group-hover:rotate-12 transition-transform" />
                <div className="bg-primary/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-bold mb-2">Career Navigator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Generate a high-velocity, milestone-driven roadmap for your target role.</p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                  Launch Strategist <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            <Link href="/career/resume" className="block group">
              <div className="glass-panel p-8 rounded-[2.5rem] border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-all cursor-pointer relative overflow-hidden h-full">
                <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-secondary/10 group-hover:rotate-12 transition-transform" />
                <div className="bg-secondary/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-secondary/20">
                  <FileText className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-headline font-bold mb-2">Resume Optimizer</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">ATS-optimized content engineering for elite professional profiles.</p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest">
                  Refine Identity <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </section>

          {/* High Velocity Niches */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-headline font-bold flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" /> High-Velocity Niches
              </h3>
              <Badge variant="outline" className="border-primary/20 text-primary text-[9px] uppercase tracking-widest">Trending 2024</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CAREER_NICHES.map((niche, i) => (
                <div key={i} className="glass-panel p-6 rounded-[2rem] border-white/5 bg-white/5 hover:bg-white/10 transition-all group flex items-start gap-5">
                  <div className={cn("p-4 rounded-2xl shrink-0 transition-transform group-hover:scale-110", niche.color)}>
                    <niche.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{niche.title}</h4>
                      <Badge className="bg-white/10 text-[8px] font-bold uppercase tracking-tighter px-2 h-4">{niche.vibe}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">{niche.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Tracking & Alerts */}
        <div className="space-y-8">
          {/* Tracker Card */}
          <section className="glass-panel p-8 rounded-[3rem] border-primary/10 relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
            <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-3 relative z-10">
              <Target className="w-5 h-5 text-primary" /> App Tracker
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Portfolio Readiness</span>
                  <span className="text-primary">85%</span>
                </div>
                <Progress value={85} className="h-2 bg-white/5" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-2xl font-headline font-bold">12</p>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Applications</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-2xl font-headline font-bold text-green-400">3</p>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Interviews</p>
                </div>
              </div>
            </div>
          </section>

          {/* Scholarship Alerts */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-headline font-bold flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-secondary" /> Grant Alerts
              </h3>
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(75,120,255,0.5)]" />
            </div>
            <div className="grid gap-3">
              {[
                { title: "Quantum Science Grant", amount: "$15,000", deadline: "Mar 12" },
                { title: "Open Source Fellowship", amount: "$5,000", deadline: "Apr 05" },
                { title: "Next-Gen Design Award", amount: "$2,500", deadline: "May 20" },
              ].map((item, i) => (
                <div key={i} className="glass-panel p-4 rounded-2xl flex items-center justify-between border-white/5 hover:border-secondary/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                      <Zap className="w-5 h-5 text-muted-foreground group-hover:text-secondary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{item.title}</h4>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Deadline: {item.deadline}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-green-500">{item.amount}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Industry Vibe Check */}
          <section className="glass-panel p-6 rounded-[2.5rem] bg-orange-500/5 border-orange-500/20 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
               <Globe className="w-4 h-4 text-orange-400" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">Market Briefing</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              "Industry is shifting toward <span className="text-white font-bold">T-shaped mastery</span>. Deep expertise in AI paired with strong soft-skill storytelling is currently the highest-value combo. Remote-first protocols are stabilizing."
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
