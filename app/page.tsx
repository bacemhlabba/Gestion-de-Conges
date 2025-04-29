import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary px-4 py-3 text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Gestion de Congés</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Espace Employé</CardTitle>
              <CardDescription>Gérez vos demandes de congés et consultez vos soldes</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="list-disc pl-5 space-y-2">
                <li>Demander un congé (annuel, maladie, exceptionnel)</li>
                <li>Consulter l'historique de vos demandes</li>
                <li>Vérifier vos soldes de congés disponibles</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/login?role=employee" className="w-full">
                <Button className="w-full">Connexion Employé</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Espace DRH</CardTitle>
              <CardDescription>Gérez les demandes de congés des employés</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="list-disc pl-5 space-y-2">
                <li>Consulter les demandes en attente</li>
                <li>Valider ou refuser les demandes</li>
                <li>Modifier les demandes si nécessaire</li>
                <li>Générer des rapports</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/login?role=hr" className="w-full">
                <Button className="w-full">Connexion DRH</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="border-t py-4 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Application de Gestion de Congés
        </div>
      </footer>
    </div>
  )
}
