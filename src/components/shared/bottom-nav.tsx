
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Bot, GraduationCap, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Planner", icon: Calendar, href: "/planner" },
  { label: "Arsenal", icon: Bot, href: "/tools" },
  { label: "Career", icon: GraduationCap, href: "/career" },
  { label: "Profile", icon: User, href: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bottom-nav-blur safe-area-bottom">
      <div className="flex items-center justify-around h-20 px-2 max-w-6xl mx-auto">
        {navItems.map((item) => {
          // Robust active state tracking for nested tool routes
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative px-3 py-2 rounded-2xl min-w-[64px]",
                isActive ? "text-primary scale-105 bg-primary/10 shadow-[0_4px_12px_rgba(140,106,255,0.1)]" : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-6 h-6 transition-all duration-300", isActive && "neon-glow drop-shadow-[0_0_8px_rgba(140,106,255,0.6)]")} />
              <span className={cn("text-[9px] font-bold tracking-tight uppercase transition-all duration-300", isActive ? "opacity-100" : "opacity-60")}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(140,106,255,0.8)] animate-in fade-in zoom-in-50 duration-500" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
