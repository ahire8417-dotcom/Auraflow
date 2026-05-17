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

  // Listen for global DND state to suppress non-critical notifications
  useEffect(() => {
    const checkDnd = () => {
      const active = localStorage.getItem('aura_dnd_active') === 'true'
      setDndActive(active)
    }
    
    checkDnd()
    const interval = setInterval(checkDnd, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // In DND mode, we suppress standard achievement/status toasts
        // We only allow critical system health or error toasts (destructive)
        const isCritical = props.variant === "destructive"
        if (dndActive && !isCritical) return null

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
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
