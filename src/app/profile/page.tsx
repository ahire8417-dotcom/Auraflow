
"use client"

import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderNav } from "@/components/shared/header-nav"
import { cn } from "@/lib/utils"

export default function Profile() {
  const { user, loading } = useUser()
  const auth = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push("/auth/login")
    return null
  }

  return (
    <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <HeaderNav title="My Profile" subtitle="Student Journey" showBack={true} />

      <div className="flex flex-col items-center mb-10">
        <div className="relative mb-6">
          <Avatar className="w-28 h-28 border-4 border-primary/20 shadow-2xl">
            <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200`} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
              {user.displayName?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-lg shadow-primary/20">
            SCHOLAR
          </div>
        </div>
        <h2 className="text-2xl font-headline font-bold mb-1">{user.displayName || "Aura Scholar"}</h2>
        <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
        <div className="flex gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1">Elite Scholar</Badge>
          <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-4 py-1">Verified User</Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Achievements Card */}
        <section className="glass-panel p-6 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <Trophy className="w-40 h-40" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-headline font-bold">Achievements</h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-all cursor-pointer group/item">
                <div className={cn(
                  "w-8 h-8 rounded-full bg-white/10 transition-transform group-hover/item:scale-110",
                  i === 1 && "bg-primary animate-pulse shadow-lg shadow-primary/40"
                )} />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 text-center font-medium uppercase tracking-widest">4 / 24 badges unlocked</p>
        </section>

        {/* Settings List */}
        <section className="glass-panel rounded-[2rem] overflow-hidden border border-white/5">
          {[
            { label: "Account Privacy", icon: Shield },
            { label: "Notifications", icon: Bell },
            { label: "Cloud Sync", icon: HelpCircle },
            { label: "Settings", icon: Settings },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </section>

        <Button 
          variant="ghost" 
          className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive rounded-2xl h-14 flex items-center gap-2 transition-all"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="font-bold">Log Out</span>
        </Button>
      </div>
    </div>
  )
}

import { Loader2 } from "lucide-react"
