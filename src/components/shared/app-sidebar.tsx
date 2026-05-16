
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Bot, GraduationCap, User, Sparkles, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/firebase"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Dynamic Planner", icon: Calendar, href: "/planner" },
  { label: "AI Arsenal", icon: Bot, href: "/tools" },
  { label: "Future Path", icon: GraduationCap, href: "/career" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <Sidebar className="border-r border-white/5 bg-[#0A0714]">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-110 transition-all duration-500">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-headline font-bold gradient-text tracking-tighter">AuraFlow</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarMenu className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300",
                      isActive 
                        ? "bg-primary/10 text-primary font-bold shadow-[0_10px_30px_-10px_rgba(140,106,255,0.3)] border border-primary/20" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110 text-primary")} />
                    <span className="text-sm font-medium tracking-tight">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <SidebarSeparator className="my-8 bg-white/5" />

        <div className="px-2 space-y-2">
          <p className="text-[10px] uppercase font-bold text-muted-foreground/40 mb-4 tracking-[0.2em] px-4">Management</p>
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/profile"}>
                <Link href="/profile" className={cn(
                  "flex items-center gap-4 px-5 py-3 rounded-xl transition-all",
                  pathname === "/profile" ? "text-white bg-white/5" : "text-muted-foreground hover:text-white"
                )}>
                  <User className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Scholar Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                <Link href="/settings" className={cn(
                  "flex items-center gap-4 px-5 py-3 rounded-xl transition-all",
                  pathname === "/settings" ? "text-white bg-white/5" : "text-muted-foreground hover:text-white"
                )}>
                  <Settings className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Hub Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <div className="glass-panel p-5 rounded-[2.5rem] border-white/5 bg-white/5 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all">
          <Avatar className="w-12 h-12 border-2 border-primary/20 shadow-xl group-hover:scale-105 transition-transform">
            <AvatarImage src={user?.photoURL || undefined} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-black">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black truncate text-foreground">{user?.displayName || "Elite Scholar"}</p>
            <div className="flex items-center gap-2 mt-0.5">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Neural Online</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
