"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Briefcase, GraduationCap, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Planner", icon: Calendar, href: "/planner" },
  { label: "Arsenal", icon: Briefcase, href: "/tools" },
  { label: "Career", icon: GraduationCap, href: "/career" },
  { label: "Profile", icon: User, href: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()
  const [dndActive, setDndActive] = useState(false)
  const [mounted, setMounted] = useState(false)

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
      "fixed bottom-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out transform-gpu",
      dndActive ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
    )}>
      {/* Premium Glass Container */}
      <div className="mx-4 mb-6 md:mx-auto md:max-w-xl">
        <div className="glass-panel border-white/5 bg-black/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] border-t border-white/10 px-6 h-20 flex items-center justify-around relative overflow-hidden group">
          
          {/* Neon Top Edge Glow */}
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
                  "flex flex-col items-center justify-center gap-1.5 transition-all duration-500 relative py-2 px-3 rounded-2xl group/item",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                {/* Active Neon Aura */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl animate-pulse-glow" />
                )}

                <div className={cn(
                  "relative z-10 transition-transform duration-500 ease-out",
                  isActive ? "scale-125 -translate-y-1" : "group-hover/item:scale-110"
                )}>
                  <item.icon className={cn(
                    "w-6 h-6",
                    isActive ? "stroke-[2.5px] drop-shadow-[0_0_8px_hsl(var(--primary))]" : "stroke-[1.5px]"
                  )} />
                </div>

                <span className={cn(
                  "text-[9px] font-black tracking-[0.1em] uppercase transition-all duration-500 relative z-10", 
                  isActive ? "opacity-100 translate-y-0" : "opacity-40 group-hover/item:opacity-70"
                )}>
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_15px_hsl(var(--primary))]" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
