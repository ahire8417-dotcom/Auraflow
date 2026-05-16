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
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bottom-nav-blur">
      <div className="flex items-center justify-around h-20 px-4 max-w-6xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative px-4 py-2 rounded-2xl",
                isActive ? "text-primary scale-110 bg-primary/10" : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "neon-glow")} />
              <span className="text-[10px] font-bold tracking-tight uppercase">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(140,106,255,0.8)]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
