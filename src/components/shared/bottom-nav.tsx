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

  // Listen for global DND state
  useEffect(() => {
    const handleStorageChange = () => {
      setDndActive(localStorage.getItem('aura_dnd_active') === 'true')
    }
    handleStorageChange()
    window.addEventListener('storage', handleStorageChange)
    
    // Check locally every second for seamless updates
    const interval = setInterval(handleStorageChange, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-[100] bottom-nav-blur safe-area-bottom transition-all duration-1000",
      dndActive ? "bg-black/80 grayscale-[0.8] opacity-60 hover:opacity-100" : "opacity-100"
    )}>
      <div className="flex items-center justify-around h-20 px-2 max-w-6xl mx-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative px-3 py-2 rounded-2xl min-w-[64px]",
                isActive ? "text-primary scale-105 bg-primary/10" : "text-muted-foreground hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-6 h-6 transition-all duration-300", 
                isActive && "neon-glow drop-shadow-[0_0_8px_rgba(140,106,255,0.6)]",
                dndActive && isActive && "text-primary/50"
              )} />
              <span className={cn(
                "text-[9px] font-bold tracking-tight uppercase transition-all duration-300", 
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(140,106,255,0.8)]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
