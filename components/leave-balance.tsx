"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getLeaveBalance } from "@/lib/leave-service"
import type { LeaveBalance as LeaveBalanceType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface LeaveBalanceProps {
  userId: string
}

export function LeaveBalance({ userId }: LeaveBalanceProps) {
  const { toast } = useToast()
  const [balance, setBalance] = useState<LeaveBalanceType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await getLeaveBalance(userId)
        setBalance(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des soldes:", error)
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les soldes de congés",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchBalance()
    }
  }, [userId, toast])

  if (loading) {
    return <div className="flex justify-center p-4">Chargement...</div>
  }

  if (!balance) {
    return <div className="text-center p-4">Impossible de récupérer les soldes de congés.</div>
  }

  const calculatePercentage = (used: number, total: number) => {
    return (used / total) * 100
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Congés annuels</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Utilisés: {balance.annual_used} jours</span>
              <span>Disponibles: {balance.annual_total - balance.annual_used} jours</span>
            </div>
            <Progress value={calculatePercentage(balance.annual_used, balance.annual_total)} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {balance.annual_used} / {balance.annual_total} jours
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Congés maladie</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Utilisés: {balance.sick_used} jours</span>
              <span>Disponibles: {balance.sick_total - balance.sick_used} jours</span>
            </div>
            <Progress value={calculatePercentage(balance.sick_used, balance.sick_total)} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {balance.sick_used} / {balance.sick_total} jours
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Informations</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Les congés annuels sont renouvelés chaque année au 1er janvier</li>
          <li>• Les congés maladie sont renouvelés chaque année à la date d'anniversaire de votre contrat</li>
          <li>• Les congés exceptionnels sont accordés au cas par cas</li>
        </ul>
      </div>
    </div>
  )
}
