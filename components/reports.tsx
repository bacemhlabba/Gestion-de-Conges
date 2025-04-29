"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { BarChart, CalendarIcon, Download, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

export function Reports() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [department, setDepartment] = useState("all")
  const [reportType, setReportType] = useState("summary")

  const handleGenerateReport = () => {
    // Logique pour générer le rapport
    console.log("Générer rapport:", {
      startDate,
      endDate,
      department,
      reportType,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du rapport</CardTitle>
          <CardDescription>Configurez les paramètres pour générer votre rapport</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de début</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date de fin</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Département</label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    <SelectItem value="it">Informatique</SelectItem>
                    <SelectItem value="hr">Ressources Humaines</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type de rapport</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Résumé global</SelectItem>
                    <SelectItem value="detailed">Rapport détaillé</SelectItem>
                    <SelectItem value="by-type">Par type de congé</SelectItem>
                    <SelectItem value="by-employee">Par employé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full" onClick={handleGenerateReport}>
              Générer le rapport
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="chart">
        <TabsList className="mb-4">
          <TabsTrigger value="chart">Graphiques</TabsTrigger>
          <TabsTrigger value="table">Tableau</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Visualisation des congés</CardTitle>
                <CardDescription>Répartition des congés par type et par statut</CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                <PieChart className="h-40 w-40 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Répartition par type</h3>
                <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-sm">Congés annuels (65%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Congés maladie (25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Congés exceptionnels (10%)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                <BarChart className="h-40 w-40 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Statut des demandes</h3>
                <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Approuvées (75%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm">Refusées (15%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">En attente (10%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Données des congés</CardTitle>
                <CardDescription>Tableau récapitulatif des congés</CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Employé</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Dates</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Durée</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-3 text-sm">Jean Dupont</td>
                      <td className="px-4 py-3 text-sm">Congé annuel</td>
                      <td className="px-4 py-3 text-sm">10/05/2023 - 15/05/2023</td>
                      <td className="px-4 py-3 text-sm">5 jours</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className="bg-green-500">Approuvé</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">Marie Martin</td>
                      <td className="px-4 py-3 text-sm">Congé maladie</td>
                      <td className="px-4 py-3 text-sm">22/06/2023 - 24/06/2023</td>
                      <td className="px-4 py-3 text-sm">3 jours</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className="bg-green-500">Approuvé</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">Pierre Dubois</td>
                      <td className="px-4 py-3 text-sm">Congé exceptionnel</td>
                      <td className="px-4 py-3 text-sm">05/07/2023 - 05/07/2023</td>
                      <td className="px-4 py-3 text-sm">1 jour</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="destructive">Refusé</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">Sophie Leroy</td>
                      <td className="px-4 py-3 text-sm">Congé annuel</td>
                      <td className="px-4 py-3 text-sm">15/08/2023 - 30/08/2023</td>
                      <td className="px-4 py-3 text-sm">15 jours</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          En attente
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
