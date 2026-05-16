
"use client"

import { ChevronLeft, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface HeaderNavProps {
  title: string
  subtitle?: string
  showBack?: boolean
  backHref?: string
  info?: string
  className?: string
}

export function HeaderNav({ title, subtitle, showBack = true, backHref, info, className }: HeaderNavProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  return (
    <header className={cn("flex items-center gap-4 mb-8", className)}>
      {showBack && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="rounded-xl glass-panel h-10 w-10 shrink-0 hover:bg-white/10 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-headline font-bold gradient-text truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate uppercase tracking-widest font-bold opacity-70">{subtitle}</p>}
      </div>
      
      {info && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl glass-panel h-10 w-10 shrink-0 hover:text-primary hover:bg-white/10">
              <Info className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="glass-panel border-primary/20 bg-[#0A0714] rounded-2xl w-64 p-4 shadow-2xl z-[100]">
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Info className="w-3 h-3" /> System Intelligence
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                {info}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </header>
  )
}
