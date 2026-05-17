"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Bot, GraduationCap, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Planner", icon: Calendar, href: "/planner" },
  { label: "Arsenal", icon: Bot, href: "/tools" },
  { label: "Career", icon: GraduationCap, href: "/career" },
  { label: "Profile", icon: User, href: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()
  const [dndActive, setDndActive] = useState(false)

  useEffect(() => {
    const checkDnd = () => {
      setDndActive(localStorage.getItem('aura_dnd_active') === 'true')
    }
    checkDnd()
    window.addEventListener('storage', checkDnd)
    const interval = setInterval(checkDnd, 1000)
    return () => {
      window.removeEventListener('storage', checkDnd)
      clearInterval(interval)
    }
  }, [])

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-[100] bottom-nav-blur safe-area-bottom transition-all duration-700 gpu-layer",
      dndActive ? "translate-y-[100%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
    )}>
      <div className="flex items-center justify-around h-16 md:h-20 px-2 max-w-5xl mx-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative px-3 py-1.5 rounded-2xl min-w-[56px] md:min-w-[72px]",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 md:w-6 md:h-6 transition-transform duration-300", 
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[8px] md:text-[9px] font-bold tracking-tight uppercase transition-all duration-300", 
                isActive ? "opacity-100" : "opacity-50"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
