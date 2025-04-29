"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getEmployees, updateEmployeeLeaveBalance } from "@/lib/leave-service"
import type { Employee } from "@/lib/types"

export function EmployeesList() {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [annualTotal, setAnnualTotal] = useState(0)
  const [sickTotal, setSickTotal] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees()
        setEmployees(data)
        setFilteredEmployees(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des employés:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const filtered = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(term) ||
          employee.email.toLowerCase().includes(term) ||
          employee.department.toLowerCase().includes(term),
      )
      setFilteredEmployees(filtered)
    } else {
      setFilteredEmployees(employees)
    }
  }, [employees, searchTerm])

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setAnnualTotal(employee.leaveBalance.annualTotal)
    setSickTotal(employee.leaveBalance.sickTotal)
    setIsDialogOpen(true)
  }

  const handleUpdateBalance = async () => {
    if (!selectedEmployee) return

    try {
      setIsSubmitting(true)
      await updateEmployeeLeaveBalance(selectedEmployee.id, {
        annualTotal,
        sickTotal,
      })

      // Mettre à jour l'état local
      const updatedEmployees = employees.map((emp) => {
        if (emp.id === selectedEmployee.id) {
          return {
            ...emp,
            leaveBalance: {
              ...emp.leaveBalance,
              annualTotal,
              sickTotal,
            },
          }
        }
        return emp
      })

      setEmployees(updatedEmployees)
      setFilteredEmployees(updatedEmployees)

      toast({
        title: "Soldes mis à jour",
        description: "Les soldes de congés ont été mis à jour avec succès",
      })

      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des soldes",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Chargement...</div>
  }

  if (employees.length === 0) {
    return <div className="text-center p-4">Aucun employé trouvé.</div>
  }

  const calculatePercentage = (used: number, total: number) => {
    return (used / total) * 100
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un employé..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="text-sm text-muted-foreground">{filteredEmployees.length} employé(s) trouvé(s)</div>

      <div className="space-y-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                    <p className="text-sm text-muted-foreground">{employee.department}</p>
                  </div>
                </div>

                <div className="flex-1 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Congés annuels</span>
                      <span>
                        {employee.leaveBalance.annualUsed} / {employee.leaveBalance.annualTotal} jours
                      </span>
                    </div>
                    <Progress
                      value={calculatePercentage(employee.leaveBalance.annualUsed, employee.leaveBalance.annualTotal)}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Congés maladie</span>
                      <span>
                        {employee.leaveBalance.sickUsed} / {employee.leaveBalance.sickTotal} jours
                      </span>
                    </div>
                    <Progress
                      value={calculatePercentage(employee.leaveBalance.sickUsed, employee.leaveBalance.sickTotal)}
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(employee)}>
                    Modifier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les soldes de congés</DialogTitle>
            <DialogDescription>{selectedEmployee?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="annualTotal">Total congés annuels</Label>
              <Input
                id="annualTotal"
                type="number"
                min="0"
                value={annualTotal}
                onChange={(e) => setAnnualTotal(Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sickTotal">Total congés maladie</Label>
              <Input
                id="sickTotal"
                type="number"
                min="0"
                value={sickTotal}
                onChange={(e) => setSickTotal(Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button onClick={handleUpdateBalance} disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
