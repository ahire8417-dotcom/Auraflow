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
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bottom-nav-blur md:hidden">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative px-2",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "neon-glow")} />
              <span className="text-[10px] font-bold tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
