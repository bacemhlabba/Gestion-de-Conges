"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PendingRequests } from "@/components/pending-requests"
import { AllRequests } from "@/components/all-requests"
import { EmployeesList } from "@/components/employees-list"
import { Reports } from "@/components/reports"
import { useToast } from "@/hooks/use-toast"

export default function HRDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "hr") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    })
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary px-4 py-3 text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Gestion de Congés</h1>
          <div className="flex items-center gap-4">
            <span>Bonjour, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord DRH</h1>

        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Demandes en attente</TabsTrigger>
            <TabsTrigger value="all">Toutes les demandes</TabsTrigger>
            <TabsTrigger value="employees">Employés</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Demandes en attente</CardTitle>
                <CardDescription>Gérez les demandes de congés en attente de validation</CardDescription>
              </CardHeader>
              <CardContent>
                <PendingRequests />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Toutes les demandes</CardTitle>
                <CardDescription>Historique complet des demandes de congés</CardDescription>
              </CardHeader>
              <CardContent>
                <AllRequests />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Liste des employés</CardTitle>
                <CardDescription>Gérez les employés et leurs soldes de congés</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeesList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Rapports</CardTitle>
                <CardDescription>Générez des rapports sur les congés</CardDescription>
              </CardHeader>
              <CardContent>
                <Reports />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t py-4 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Application de Gestion de Congés
        </div>
      </footer>
    </div>
  )
}
