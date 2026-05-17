"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect, useState } from "react"

export function Toaster() {
  const { toasts } = useToast()
  const [dndActive, setDndActive] = useState(false)

  useEffect(() => {
    const checkDnd = () => {
      const active = localStorage.getItem('aura_dnd_active') === 'true'
      setDndActive(active)
    }
    checkDnd()
    window.addEventListener('storage', checkDnd)
    const interval = setInterval(checkDnd, 1000)
    return () => {
      window.removeEventListener('storage', checkDnd)
      clearInterval(interval)
    }
  }, [])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const isCritical = props.variant === "destructive"
        if (dndActive && !isCritical) return null

        return (
          <Toast key={id} {...props} className="glass-panel border-white/10 shadow-2xl rounded-2xl">
            <div className="grid gap-1">
              {title && <ToastTitle className="font-bold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-xs opacity-80">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}