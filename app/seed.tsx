"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseServerClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import * as bcrypt from "bcrypt"

export default function SeedPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSeed = async () => {
    try {
      setLoading(true)

      // Créer un utilisateur employé
      const employeePassword = await bcrypt.hash("password", 10)
      const supabase = getSupabaseServerClient()

      // Créer un utilisateur employé via l'API Supabase Auth
      const { data: employeeData, error: employeeError } = await supabase.auth.admin.createUser({
        email: "employee@example.com",
        password: "password",
        email_confirm: true,
      })

      if (employeeError) throw employeeError

      // Créer le profil de l'employé
      await supabase.from("profiles").insert({
        id: employeeData.user.id,
        name: "Jean Dupont",
        role: "employee",
        department: "Informatique",
      })

      // Créer le solde de congés de l'employé
      await supabase.from("leave_balances").insert({
        user_id: employeeData.user.id,
        annual_total: 25,
        annual_used: 10,
        sick_total: 15,
        sick_used: 3,
      })

      // Créer un utilisateur DRH
      const { data: drhData, error: drhError } = await supabase.auth.admin.createUser({
        email: "drh@example.com",
        password: "password",
        email_confirm: true,
      })

      if (drhError) throw drhError

      // Créer le profil du DRH
      await supabase.from("profiles").insert({
        id: drhData.user.id,
        name: "Marie Martin",
        role: "hr",
        department: "Ressources Humaines",
      })

      // Créer quelques demandes de congés
      const today = new Date()

      await supabase.from("leave_requests").insert([
        {
          user_id: employeeData.user.id,
          type: "annual",
          start_date: new Date(today.getFullYear(), 4, 10).toISOString(), // 10 mai
          end_date: new Date(today.getFullYear(), 4, 15).toISOString(), // 15 mai
          status: "approved",
          created_at: new Date(today.getFullYear(), 4, 1).toISOString(), // 1 mai
        },
        {
          user_id: employeeData.user.id,
          type: "sick",
          start_date: new Date(today.getFullYear(), 5, 22).toISOString(), // 22 juin
          end_date: new Date(today.getFullYear(), 5, 24).toISOString(), // 24 juin
          status: "approved",
          created_at: new Date(today.getFullYear(), 5, 21).toISOString(), // 21 juin
        },
        {
          user_id: employeeData.user.id,
          type: "exceptional",
          start_date: new Date(today.getFullYear(), 6, 5).toISOString(), // 5 juillet
          end_date: new Date(today.getFullYear(), 6, 5).toISOString(), // 5 juillet
          reason: "Rendez-vous administratif important",
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])

      toast({
        title: "Données initialisées",
        description: "Les données de test ont été créées avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de l'initialisation des données:", error)
      toast({
        title: "Err eur",
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
            <li>Des demandes de congés de test</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Note : Cette action est idempotente et peut être exécutée plusieurs fois sans créer de doublons.
          </p>
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
