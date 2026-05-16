"use client"

import { GraduationCap, FileText, Briefcase, TrendingUp } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { HeaderNav } from "@/components/shared/header-nav"

export default function CareerHub() {
  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <HeaderNav title="Future Path" subtitle="Strategize your career leap" showBack={false} />

      <div className="grid gap-6">
        {/* Main Career Tools */}
        <section className="grid grid-cols-2 gap-4">
          <Link href="/tools/roadmap" className="block">
            <div className="glass-panel rounded-3xl border-0 h-full hover:bg-white/5 transition-all cursor-pointer overflow-hidden group">
              <div className="p-4 bg-primary/20 group-hover:bg-primary/30 transition-all">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm">Career Roadmap</h3>
                <p className="text-[10px] text-muted-foreground mt-1">AI-guided path to goals</p>
              </div>
            </div>
          </Link>
          <Link href="/career/resume" className="block">
            <div className="glass-panel rounded-3xl border-0 h-full hover:bg-white/5 transition-all cursor-pointer overflow-hidden group">
              <div className="p-4 bg-secondary/20 group-hover:bg-secondary/30 transition-all">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm">Pro Resume</h3>
                <p className="text-[10px] text-muted-foreground mt-1">ATS-friendly builder</p>
              </div>
            </div>
          </Link>
        </section>

        {/* Scholarship Hub Snippet */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-headline font-semibold">ScholarHub Alerts</h3>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">3 New</Badge>
          </div>
          <div className="grid gap-3">
            {[
              { title: "STEM Excellence Award", amount: "$5,000", deadline: "Mar 20" },
              { title: "Global Innovation Grant", amount: "$10,000", deadline: "Apr 15" },
            ].map((item, i) => (
              <div key={i} className="glass-panel p-4 rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">Deadline: {item.deadline}</p>
                  </div>
                </div>
                <p className="font-bold text-green-500">{item.amount}</p>
              </div>
            ))}
          </div>
        </section>

        {/* College & Job Tracker */}
        <section className="glass-panel p-6 rounded-[2rem]">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="font-headline font-bold">Applications Tracker</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Applied</span>
              <span className="font-bold">8 Applications</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
              <div className="h-full bg-primary w-[40%]" />
              <div className="h-full bg-secondary w-[20%]" />
              <div className="h-full bg-muted w-[40%]" />
            </div>
            <div className="flex gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-muted-foreground">Interviews</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
