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
      if (typeof window !== 'undefined') {
        const active = localStorage.getItem('aura_dnd_active') === 'true'
        setDndActive(active)
      }
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
      "fixed bottom-0 left-0 right-0 z-[1000] transition-all duration-700 ease-in-out transform-gpu",
      // Only slightly dim the nav in DND to prevent "invisible" bug while reducing distraction
      dndActive ? "opacity-60 scale-[0.98] translate-y-1" : "opacity-100 translate-y-0"
    )}>
      <div className="mx-4 mb-8 md:mx-auto md:max-w-2xl">
        <div className="glass-panel border-white/10 bg-black/90 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.9)] px-2 h-20 flex items-center justify-around relative overflow-hidden group">
          
          {/* Neon Active Track */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

          {navItems.map((item) => {
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 transition-all duration-500 relative py-2 px-1 rounded-2xl group/item min-w-[64px] active:scale-90",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-white/80"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl animate-pulse" />
                )}

                <div className={cn(
                  "relative z-10 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)",
                  isActive ? "scale-125 -translate-y-1.5 drop-shadow-[0_0_12px_hsl(var(--primary))]" : "group-hover/item:scale-110"
                )}>
                  <item.icon className={cn(
                    "w-6 h-6",
                    isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                  )} />
                </div>

                <span className={cn(
                  "text-[8px] font-black tracking-[0.25em] uppercase transition-all duration-500 relative z-10", 
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover/item:opacity-40"
                )}>
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_hsl(var(--primary))] animate-in zoom-in duration-500" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
