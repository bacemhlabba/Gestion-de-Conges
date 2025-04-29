"use client"

import { createContext, useContext, type ReactNode } from "react"

type ToastContextType = {
  toast: (props: ToastDetails) => void
}

type ToastDetails = {
  title: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = (props: ToastDetails) => {
    alert(`${props.title}\n${props.description || ""}`)
  }

  return <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
