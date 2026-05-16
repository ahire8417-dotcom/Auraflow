"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderNavProps {
  title: string
  subtitle?: string
  showBack?: boolean
  className?: string
}

export function HeaderNav({ title, subtitle, showBack = true, className }: HeaderNavProps) {
  const router = useRouter()

  return (
    <header className={cn("flex items-center gap-4 mb-8", className)}>
      {showBack && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-xl glass-panel h-10 w-10 shrink-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-headline font-bold gradient-text truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate uppercase tracking-widest">{subtitle}</p>}
      </div>
    </header>
  )
}
