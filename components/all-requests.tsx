"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { AlertCircle, Calendar, Clock, Download, Search, User } from "lucide-react"
import { getAllLeaveRequests } from "@/lib/leave-service"
import type { LeaveRequest } from "@/lib/types"

export function AllRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getAllLeaveRequests()
        setRequests(data)
        setFilteredRequests(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  useEffect(() => {
    let filtered = [...requests]

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // Filtre par type
    if (typeFilter !== "all") {
      filtered = filtered.filter((request) => request.type === typeFilter)
    }

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (request) =>
          request.userName?.toLowerCase().includes(term) ||
          false ||
          request.reason?.toLowerCase().includes(term) ||
          false,
      )
    }

    setFilteredRequests(filtered)
  }, [requests, searchTerm, statusFilter, typeFilter])

  const handleExport = () => {
    // Logique d'exportation des données
    const csvContent = [
      ["ID", "Employé", "Type", "Date de début", "Date de fin", "Statut", "Motif", "Date de soumission"],
      ...filteredRequests.map((req) => [
        req.id,
        req.userName || "Inconnu",
        getLeaveTypeName(req.type),
        format(new Date(req.startDate), "dd/MM/yyyy"),
        format(new Date(req.endDate), "dd/MM/yyyy"),
        getStatusName(req.status),
        req.reason || "",
        format(new Date(req.createdAt), "dd/MM/yyyy"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `demandes_conges_${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return <div className="flex justify-center p-4">Chargement...</div>
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Aucune demande de congé</h3>
        <p className="text-muted-foreground mt-2">Aucune demande de congé n'a été soumise.</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approuvé</Badge>
      case "rejected":
        return <Badge variant="destructive">Refusé</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            En attente
          </Badge>
        )
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  const getLeaveTypeName = (type: string) => {
    switch (type) {
      case "annual":
        return "Congé annuel"
      case "sick":
        return "Congé maladie"
      case "exceptional":
        return "Congé exceptionnel"
      default:
        return "Autre"
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé"
      case "rejected":
        return "Refusé"
      case "pending":
        return "En attente"
      default:
        return "Inconnu"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvé</SelectItem>
            <SelectItem value="rejected">Refusé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="annual">Congé annuel</SelectItem>
            <SelectItem value="sick">Congé maladie</SelectItem>
            <SelectItem value="exceptional">Congé exceptionnel</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          <span>Exporter</span>
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">{filteredRequests.length} demande(s) trouvée(s)</div>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className={`border-l-4 p-4 ${
                  request.status === "approved"
                    ? "border-green-500"
                    : request.status === "rejected"
                      ? "border-red-500"
                      : "border-yellow-500"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <h3 className="font-medium">{getLeaveTypeName(request.type)}</h3>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    <span>{request.userName || "Employé"}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Soumis le {format(new Date(request.createdAt), "dd MMM yyyy", { locale: fr })}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Du {format(new Date(request.startDate), "dd MMM yyyy", { locale: fr })} au{" "}
                    {format(new Date(request.endDate), "dd MMM yyyy", { locale: fr })}
                  </span>
                </div>

                {request.reason && (
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Motif:</p>
                    <p>{request.reason}</p>
                  </div>
                )}

                {request.rejectionReason && (
                  <div className="mt-2 flex items-start gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                    <div>
                      <p className="font-medium">Motif du refus:</p>
                      <p>{request.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
