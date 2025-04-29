"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "employee"
  const { toast } = useToast()
  const { login, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: role === "hr" ? "drh@example.com" : "employee@example.com",
    password: "password",
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Réinitialiser l'erreur lorsque l'utilisateur modifie les champs
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await login(formData.email, formData.password)
    } catch (error: any) {
      console.error("Erreur de connexion:", error)

      // Afficher un message d'erreur plus spécifique
      if (error.message?.includes("Invalid login credentials")) {
        setError("Identifiants invalides. Assurez-vous d'avoir initialisé les données en visitant /seed.")
      } else {
        setError(error.message || "Une erreur est survenue lors de la connexion")
      }

      toast({
        title: "Erreur d'authentification",
        description: "Impossible de se connecter avec ces identifiants",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion {role === "hr" ? "DRH" : "Employé"}</CardTitle>
          <CardDescription>Entrez vos identifiants pour accéder à votre espace</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Pour initialiser les utilisateurs, visitez{" "}
                <a href="/seed" className="text-primary underline">
                  la page de seed
                </a>
                .
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
