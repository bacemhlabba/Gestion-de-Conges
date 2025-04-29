"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaveRequestForm } from "@/components/leave-request-form"
import { LeaveHistory } from "@/components/leave-history"
import { LeaveBalance } from "@/components/leave-balance"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function EmployeeDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { session, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && (!session || !session.profile)) {
      router.push("/login")
      return
    }

    if (!loading && session?.profile?.role !== "employee") {
      router.push("/login")
    }
  }, [session, loading, router])

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      })
    }
  }

  if (loading || !session || !session.profile) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary px-4 py-3 text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Gestion de Congés</h1>
          <div className="flex items-center gap-4">
            <span>Bonjour, {session.profile.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord Employé</h1>

        <Tabs defaultValue="request">
          <TabsList className="mb-4">
            <TabsTrigger value="request">Demande de congé</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="balance">Soldes</TabsTrigger>
          </TabsList>

          <TabsContent value="request">
            <Card>
              <CardHeader>
                <CardTitle>Nouvelle demande de congé</CardTitle>
                <CardDescription>Remplissez le formulaire pour soumettre une demande de congé</CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveRequestForm userId={session.user?.id || ""} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historique des demandes</CardTitle>
                <CardDescription>Consultez l'état de vos demandes de congés</CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveHistory userId={session.user?.id || ""} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance">
            <Card>
              <CardHeader>
                <CardTitle>Soldes de congés</CardTitle>
                <CardDescription>Consultez vos soldes de congés disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveBalance userId={session.user?.id || ""} />
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
