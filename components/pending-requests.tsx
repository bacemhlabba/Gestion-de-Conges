"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Clock, User } from "lucide-react"
import { getPendingLeaveRequests, updateLeaveRequestStatus } from "@/lib/leave-service"
import type { LeaveRequest } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export function PendingRequests() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const data = await getPendingLeaveRequests()
      setRequests(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les demandes en attente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (request: LeaveRequest) => {
    try {
      setIsSubmitting(true)
      await updateLeaveRequestStatus(request.id, "approved")
      toast({
        title: "Demande approuvée",
        description: "La demande de congé a été approuvée avec succès",
      })
      fetchRequests()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation de la demande",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return

    if (!rejectionReason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir un motif de refus",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await updateLeaveRequestStatus(selectedRequest.id, "rejected", rejectionReason)
      toast({
        title: "Demande refusée",
        description: "La demande de congé a été refusée",
      })
      setIsDialogOpen(false)
      setRejectionReason("")
      fetchRequests()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du refus de la demande",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openRejectDialog = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setRejectionReason("")
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="flex justify-center p-4">Chargement...</div>
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Aucune demande en attente</h3>
        <p className="text-muted-foreground mt-2">Toutes les demandes de congé ont été traitées.</p>
      </div>
    )
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
            <div className="border-l-4 border-yellow-500 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <h3 className="font-medium">{getLeaveTypeName(request.type)}</h3>
                <Badge variant="outline" className="border-yellow-500 text-yellow-500 sm:ml-2">
                  En attente
                </Badge>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  <span>{request.user_name || "Employé"}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Soumis le {format(new Date(request.created_at), "dd MMM yyyy", { locale: fr })}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  Du {format(new Date(request.start_date), "dd MMM yyyy", { locale: fr })} au{" "}
                  {format(new Date(request.end_date), "dd MMM yyyy", { locale: fr })}
                </span>
              </div>

              {request.reason && (
                <div className="mt-2 text-sm">
                  <p className="font-medium">Motif:</p>
                  <p>{request.reason}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => openRejectDialog(request)} disabled={isSubmitting}>
                  Refuser
                </Button>
                <Button size="sm" onClick={() => handleApprove(request)} disabled={isSubmitting}>
                  Approuver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser la demande de congé</DialogTitle>
            <DialogDescription>Veuillez fournir un motif pour le refus de cette demande.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Motif du refus"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button onClick={handleReject} disabled={isSubmitting}>
              {isSubmitting ? "Traitement..." : "Confirmer le refus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
