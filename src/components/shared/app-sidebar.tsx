"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Bot, GraduationCap, User, Sparkles, Settings, HelpCircle, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Dynamic Planner", icon: Calendar, href: "/planner" },
  { label: "AI Arsenal", icon: Bot, href: "/tools" },
  { label: "Future Path", icon: GraduationCap, href: "/career" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-white/5 bg-[#0A0714]">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-headline font-bold gradient-text">AuraFlow</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-primary/10 text-primary font-bold shadow-sm" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <SidebarSeparator className="my-6 bg-white/5" />

        <div className="px-4">
          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-4 tracking-widest">Personal</p>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/profile"}>
                <Link href="/profile" className="flex items-center gap-3 px-4 py-2 rounded-xl text-muted-foreground hover:text-white transition-colors">
                  <User className="w-4 h-4" />
                  <span className="text-sm">My Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-xl text-muted-foreground hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-primary" />
             </div>
             <p className="text-xs font-bold">Need Help?</p>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">Check our guide or contact support for help.</p>
          <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 text-destructive">
            <LogOut className="w-3 h-3" /> Log Out
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
