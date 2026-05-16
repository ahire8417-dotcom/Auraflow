
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Calendar, Bot, GraduationCap, User, Sparkles, Settings, LogOut, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"
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
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Dynamic Planner", icon: Calendar, href: "/planner" },
  { label: "AI Arsenal", icon: Bot, href: "/tools" },
  { label: "Future Path", icon: GraduationCap, href: "/career" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const auth = useAuth()

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/auth/login")
  }

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
          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-4 tracking-widest opacity-50 px-4">Workspace</p>
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
              <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-2 rounded-xl text-muted-foreground hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Hub Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-6">
        {user ? (
          <div className="glass-panel p-4 rounded-2xl space-y-4 border-white/5 bg-white/5">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-primary/20">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{user.displayName || "Scholar"}</p>
                <p className="text-[10px] text-muted-foreground truncate opacity-60 font-medium">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full py-2 bg-white/5 hover:bg-destructive/10 hover:text-destructive rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-2 uppercase tracking-widest border border-white/5"
            >
              <LogOut className="w-3 h-3" /> Log Out
            </button>
          </div>
        ) : (
          <Link href="/auth/login">
            <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 gap-2 font-bold shadow-lg shadow-primary/20">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
