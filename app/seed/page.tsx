"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@supabase/supabase-js"

export default function SeedPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSeed = async () => {
    try {
      setLoading(true)
      setResult(null)

      // Créer un client Supabase avec la clé de service pour les opérations admin
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Utiliser la clé anon pour le client
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // 1. Créer un utilisateur employé
      const { data: employeeData, error: employeeError } = await supabase.auth.signUp({
        email: "employee@example.com",
        password: "password",
      })

      if (employeeError) {
        if (employeeError.message.includes("already registered")) {
          setResult((prev) => (prev || "") + "\nL'utilisateur employee@example.com existe déjà.")
        } else {
          throw employeeError
        }
      } else {
        setResult((prev) => (prev || "") + "\nUtilisateur employee@example.com créé avec succès.")

        // Créer le profil de l'employé
        const { error: profileError } = await supabase.from("profiles").insert({
          id: employeeData.user?.id,
          name: "Jean Dupont",
          role: "employee",
          department: "Informatique",
        })

        if (profileError) {
          if (profileError.code === "23505") {
            // Code pour violation de contrainte unique
            setResult((prev) => (prev || "") + "\nLe profil pour employee@example.com existe déjà.")
          } else {
            throw profileError
          }
        } else {
          setResult((prev) => (prev || "") + "\nProfil pour employee@example.com créé avec succès.")
        }

        // Créer le solde de congés de l'employé
        const { error: balanceError } = await supabase.from("leave_balances").insert({
          user_id: employeeData.user?.id,
          annual_total: 25,
          annual_used: 10,
          sick_total: 15,
          sick_used: 3,
        })

        if (balanceError) {
          if (balanceError.code === "23505") {
            setResult((prev) => (prev || "") + "\nLe solde pour employee@example.com existe déjà.")
          } else {
            throw balanceError
          }
        } else {
          setResult((prev) => (prev || "") + "\nSolde pour employee@example.com créé avec succès.")
        }
      }

      // 2. Créer un utilisateur DRH
      const { data: drhData, error: drhError } = await supabase.auth.signUp({
        email: "drh@example.com",
        password: "password",
      })

      if (drhError) {
        if (drhError.message.includes("already registered")) {
          setResult((prev) => (prev || "") + "\nL'utilisateur drh@example.com existe déjà.")
        } else {
          throw drhError
        }
      } else {
        setResult((prev) => (prev || "") + "\nUtilisateur drh@example.com créé avec succès.")

        // Créer le profil du DRH
        const { error: profileError } = await supabase.from("profiles").insert({
          id: drhData.user?.id,
          name: "Marie Martin",
          role: "hr",
          department: "Ressources Humaines",
        })

        if (profileError) {
          if (profileError.code === "23505") {
            setResult((prev) => (prev || "") + "\nLe profil pour drh@example.com existe déjà.")
          } else {
            throw profileError
          }
        } else {
          setResult((prev) => (prev || "") + "\nProfil pour drh@example.com créé avec succès.")
        }
      }

      toast({
        title: "Opération terminée",
        description: "Vérifiez les résultats ci-dessous pour plus de détails",
      })
    } catch (error: any) {
      console.error("Erreur lors de l'initialisation des données:", error)
      setResult(`Erreur: ${error.message || "Une erreur inconnue est survenue"}`)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initialisation des données",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Initialisation des données</CardTitle>
          <CardDescription>Créer des utilisateurs et des données de test pour l'application</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Cette action va créer :</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Un utilisateur employé (employee@example.com / password)</li>
            <li>Un utilisateur DRH (drh@example.com / password)</li>
          </ul>
          <p className="text-sm text-muted-foreground mb-4">
            Note : Cette action est idempotente et peut être exécutée plusieurs fois sans créer de doublons.
          </p>

          {result && (
            <div className="mt-4 p-3 bg-muted rounded-md whitespace-pre-line text-sm">
              <p className="font-medium mb-2">Résultat :</p>
              {result}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeed} disabled={loading} className="w-full">
            {loading ? "Initialisation en cours..." : "Initialiser les données"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
