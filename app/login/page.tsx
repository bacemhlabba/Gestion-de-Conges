"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "employee"
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulation d'authentification
    if (role === "employee") {
      if (formData.email === "employee@example.com" && formData.password === "password") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "emp123",
            name: "Jean Dupont",
            role: "employee",
            email: formData.email,
          }),
        )
        router.push("/employee/dashboard")
      } else {
        toast({
          title: "Erreur d'authentification",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        })
      }
    } else {
      if (formData.email === "drh@example.com" && formData.password === "password") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "hr123",
            name: "Marie Martin",
            role: "hr",
            email: formData.email,
          }),
        )
        router.push("/hr/dashboard")
      } else {
        toast({
          title: "Erreur d'authentification",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        })
      }
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
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={role === "hr" ? "drh@example.com" : "employee@example.com"}
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
