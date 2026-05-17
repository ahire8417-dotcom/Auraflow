"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Briefcase, GraduationCap, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const navItems = [
  { label: "HOME", icon: Home, href: "/" },
  { label: "PLANNER", icon: Calendar, href: "/planner" },
  { label: "ARSENAL", icon: Briefcase, href: "/tools" },
  { label: "CAREER", icon: GraduationCap, href: "/career" },
  { label: "PROFILE", icon: User, href: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [dndActive, setDndActive] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkDnd = () => {
      const active = localStorage.getItem('aura_dnd_active') === 'true'
      setDndActive(active)
    }
    checkDnd()
    window.addEventListener('storage', checkDnd)
    const interval = setInterval(checkDnd, 1000)
    return () => {
      window.removeEventListener('storage', checkDnd)
      clearInterval(interval)
    }
  }, [])

  if (!mounted) return null

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-[999] transition-all duration-700 ease-in-out transform-gpu",
      dndActive ? "opacity-40 grayscale pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
    )}>
      <div className="mx-4 mb-6 md:mx-auto md:max-w-2xl">
        <div className="glass-panel border-white/10 bg-black/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.8)] px-2 h-20 flex items-center justify-around relative overflow-hidden group">
          
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {navItems.map((item) => {
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative py-2 px-1 rounded-2xl group/item min-w-[64px]",
                  isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-white"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl animate-pulse" />
                )}

                <div className={cn(
                  "relative z-10 transition-all duration-500 ease-out",
                  isActive ? "scale-110 -translate-y-1" : "group-hover/item:scale-110"
                )}>
                  <item.icon className={cn(
                    "w-6 h-6",
                    isActive ? "stroke-[2.5px] drop-shadow-[0_0_8px_hsl(var(--primary))]" : "stroke-[1.5px]"
                  )} />
                </div>

                <span className={cn(
                  "text-[8px] font-black tracking-[0.2em] uppercase transition-all duration-300 relative z-10", 
                  isActive ? "opacity-100" : "opacity-40 group-hover/item:opacity-80"
                )}>
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
