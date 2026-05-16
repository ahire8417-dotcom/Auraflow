"use client"

import { BottomNav } from "@/components/shared/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Profile() {
  return (
    <div className="min-h-screen p-4 pb-24">
      <header className="flex justify-between items-start mb-10 mt-4">
        <h1 className="text-3xl font-headline font-bold gradient-text">Profile</h1>
        <Button variant="ghost" size="icon" className="glass-panel rounded-full">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-2xl">
            <AvatarImage src="https://picsum.photos/seed/auraflow-user/200" />
            <AvatarFallback>AX</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            LVL 14
          </div>
        </div>
        <h2 className="text-xl font-headline font-bold">Alex Xavier</h2>
        <p className="text-sm text-muted-foreground mb-4">Computer Science Major</p>
        <div className="flex gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20">Elite Scholar</Badge>
          <Badge className="bg-secondary/10 text-secondary border-secondary/20">Early Adopter</Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Achievements Card */}
        <section className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 rotate-12 group-hover:rotate-0 transition-transform">
            <Trophy className="w-32 h-32" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-headline font-bold">Achievements</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">4 / 24 badges unlocked</p>
        </section>

        {/* Settings List */}
        <section className="glass-panel rounded-2xl overflow-hidden">
          {[
            { label: "Account Privacy", icon: Shield },
            { label: "Notifications", icon: Bell },
            { label: "Cloud Sync", icon: HelpCircle },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </section>

        <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
