"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { createLeaveRequest } from "@/lib/leave-service"

interface LeaveRequestFormProps {
  userId: string
}

export function LeaveRequestForm({ userId }: LeaveRequestFormProps) {
  const { toast } = useToast()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [leaveType, setLeaveType] = useState("annual")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate || !endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner les dates de début et de fin",
        variant: "destructive",
      })
      return
    }

    if (startDate > endDate) {
      toast({
        title: "Erreur",
        description: "La date de début doit être antérieure à la date de fin",
        variant: "destructive",
      })
      return
    }

    if (leaveType === "exceptional" && !reason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir un motif pour le congé exceptionnel",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createLeaveRequest({
        userId,
        startDate,
        endDate,
        type: leaveType,
        reason: leaveType === "exceptional" ? reason : "",
        status: "pending",
      })

      toast({
        title: "Demande soumise",
        description: "Votre demande de congé a été soumise avec succès",
      })

      // Réinitialiser le formulaire
      setStartDate(undefined)
      setEndDate(undefined)
      setLeaveType("annual")
      setReason("")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre demande",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Type de congé</Label>
          <RadioGroup
            value={leaveType}
            onValueChange={setLeaveType}
            className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="annual" id="annual" />
              <Label htmlFor="annual">Congé annuel</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sick" id="sick" />
              <Label htmlFor="sick">Congé maladie</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="exceptional" id="exceptional" />
              <Label htmlFor="exceptional">Congé exceptionnel</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Date de début</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
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
            <Label>Date de fin</Label>
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

        {leaveType === "exceptional" && (
          <div className="space-y-2">
            <Label htmlFor="reason">Motif du congé exceptionnel</Label>
            <Textarea
              id="reason"
              placeholder="Veuillez préciser le motif de votre demande de congé exceptionnel"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Soumission en cours..." : "Soumettre la demande"}
      </Button>
    </form>
  )
}
