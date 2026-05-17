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
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <header className={cn("flex items-center gap-4 mb-8 sticky top-0 z-40 bg-background/50 backdrop-blur-xl py-4 -mx-4 px-4 md:-mx-8 md:px-8", className)}>
      {showBack && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="rounded-xl glass-panel h-11 w-11 shrink-0 hover:bg-white/10 active:scale-90 transition-all border-white/5"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl md:text-2xl font-headline font-bold gradient-text truncate">{title}</h1>
        {subtitle && <p className="text-[10px] text-muted-foreground truncate uppercase tracking-[0.25em] font-black opacity-60">{subtitle}</p>}
      </div>
      
      {info && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl glass-panel h-11 w-11 shrink-0 hover:text-primary hover:bg-white/10 border-white/5">
              <Info className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="glass-panel border-primary/20 bg-[#0A0714] rounded-2xl w-80 p-6 shadow-2xl z-[100] outline-none">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Info className="w-4 h-4" /> Strategic Intelligence
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
