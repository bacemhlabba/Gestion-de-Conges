"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentSession, signIn, signOut } from "@/lib/auth-service"
import type { Session } from "@/lib/types"

interface AuthContextType {
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadSession() {
      try {
        const currentSession = await getCurrentSession()
        setSession(currentSession)
      } catch (error) {
        console.error("Erreur lors du chargement de la session:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const newSession = await signIn(email, password)
      setSession(newSession)

      // Rediriger vers le tableau de bord approprié
      if (newSession.profile?.role === "hr") {
        router.push("/hr/dashboard")
      } else {
        router.push("/employee/dashboard")
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await signOut()
      setSession(null)
      router.push("/")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ session, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
