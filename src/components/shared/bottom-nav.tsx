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
  const [shouldHide, setShouldHide] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check DND status with high reliability
    const checkVisibility = () => {
      const isTimerRunning = localStorage.getItem('aura_timer_running') === 'true'
      const isDndActive = localStorage.getItem('aura_dnd_active') === 'true'
      // Only hide if BOTH are true - creating a strict focus mode
      setShouldHide(isTimerRunning && isDndActive)
    }
    
    checkVisibility()
    // Event listener for cross-tab or cross-component storage changes
    window.addEventListener('storage', checkVisibility)
    // Frequent poll for local state changes within the same tab
    const interval = setInterval(checkVisibility, 500)
    
    return () => {
      window.removeEventListener('storage', checkVisibility)
      clearInterval(interval)
    }
  }, [])

  if (!mounted) return null

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out transform-gpu",
      shouldHide ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
    )}>
      <div className="mx-4 mb-6 md:mx-auto md:max-w-2xl">
        <div className="glass-panel border-white/10 bg-black/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.8)] px-2 h-20 flex items-center justify-around relative overflow-hidden group">
          
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
