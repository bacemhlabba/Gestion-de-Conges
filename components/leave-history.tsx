"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { AlertCircle, Calendar, Clock } from "lucide-react"
import { getLeaveRequests } from "@/lib/leave-service"
import type { LeaveRequest } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface LeaveHistoryProps {
  userId: string
}

export function LeaveHistory({ userId }: LeaveHistoryProps) {
  const { toast } = useToast()
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getLeaveRequests(userId)
        setRequests(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes:", error)
        toast({
          title: "Erreur",
          description: "Impossible de récupérer l'historique des demandes",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchRequests()
    }
  }, [userId, toast])

  if (loading) {
    return <div className="flex justify-center p-4">Chargement...</div>
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Aucune demande de congé</h3>
        <p className="text-muted-foreground mt-2">Vous n'avez pas encore soumis de demande de congé.</p>
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

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="border-l-4 border-primary p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <h3 className="font-medium">{getLeaveTypeName(request.type)}</h3>
                {getStatusBadge(request.status)}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Du {format(new Date(request.start_date), "dd MMM yyyy", { locale: fr })} au{" "}
                    {format(new Date(request.end_date), "dd MMM yyyy", { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Soumis le {format(new Date(request.created_at), "dd MMM yyyy", { locale: fr })}</span>
                </div>
              </div>

              {request.reason && (
                <div className="mt-2 text-sm">
                  <p className="font-medium">Motif:</p>
                  <p>{request.reason}</p>
                </div>
              )}

              {request.rejection_reason && (
                <div className="mt-2 flex items-start gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Motif du refus:</p>
                    <p>{request.rejection_reason}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
