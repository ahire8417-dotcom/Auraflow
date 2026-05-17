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
    
    // Use a custom event for faster response than polling
    window.addEventListener('storage', checkDnd)
    window.addEventListener('aura_dnd_update', checkDnd)
    
    return () => {
      window.removeEventListener('storage', checkDnd)
      window.removeEventListener('aura_dnd_update', checkDnd)
    }
  }, [])

  if (!mounted) return null

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-[9999] transition-all duration-700 ease-in-out transform-gpu safe-area-bottom",
      dndActive ? "opacity-60 brightness-[0.7]" : "opacity-100"
    )}>
      <div className="mx-4 mb-8 md:mx-auto md:max-w-2xl">
        <div className="glass-panel border-white/10 bg-black/90 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_-20px_80px_-15px_rgba(140,106,255,0.15)] px-2 h-20 flex items-center justify-around relative overflow-hidden ring-1 ring-white/5 transform-gpu">
          
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-30" />

          {navItems.map((item) => {
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 transition-all duration-500 relative py-2 px-1 rounded-2xl group/item min-w-[60px] active:scale-90 transform-gpu",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-white/80"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/15 rounded-2xl blur-xl animate-pulse" />
                )}

                <div className={cn(
                  "relative z-10 transition-all duration-500 transform-gpu",
                  isActive ? "scale-125 -translate-y-1.5 drop-shadow-[0_0_15px_hsl(var(--primary))]" : "group-hover/item:scale-110"
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
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
