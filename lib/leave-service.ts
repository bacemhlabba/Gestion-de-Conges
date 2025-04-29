import type { Employee, LeaveBalance, LeaveBalanceUpdate, LeaveRequest } from "./types"

// Données fictives pour simuler une base de données
const mockEmployees: Employee[] = [
  {
    id: "emp123",
    name: "Jean Dupont",
    email: "employee@example.com",
    department: "Informatique",
    leaveBalance: {
      annualTotal: 25,
      annualUsed: 10,
      sickTotal: 15,
      sickUsed: 3,
    },
  },
  {
    id: "emp456",
    name: "Marie Martin",
    email: "marie@example.com",
    department: "Marketing",
    leaveBalance: {
      annualTotal: 25,
      annualUsed: 15,
      sickTotal: 15,
      sickUsed: 0,
    },
  },
  {
    id: "emp789",
    name: "Pierre Dubois",
    email: "pierre@example.com",
    department: "Finance",
    leaveBalance: {
      annualTotal: 25,
      annualUsed: 5,
      sickTotal: 15,
      sickUsed: 7,
    },
  },
  {
    id: "emp101",
    name: "Sophie Leroy",
    email: "sophie@example.com",
    department: "Ressources Humaines",
    leaveBalance: {
      annualTotal: 25,
      annualUsed: 20,
      sickTotal: 15,
      sickUsed: 2,
    },
  },
]

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "req123",
    userId: "emp123",
    userName: "Jean Dupont",
    type: "annual",
    startDate: "2023-05-10",
    endDate: "2023-05-15",
    status: "approved",
    createdAt: "2023-05-01",
    updatedAt: "2023-05-02",
  },
  {
    id: "req456",
    userId: "emp456",
    userName: "Marie Martin",
    type: "sick",
    startDate: "2023-06-22",
    endDate: "2023-06-24",
    status: "approved",
    createdAt: "2023-06-21",
    updatedAt: "2023-06-21",
  },
  {
    id: "req789",
    userId: "emp789",
    userName: "Pierre Dubois",
    type: "exceptional",
    startDate: "2023-07-05",
    endDate: "2023-07-05",
    reason: "Rendez-vous administratif important",
    status: "rejected",
    rejectionReason: "Présence requise pour une réunion critique",
    createdAt: "2023-07-01",
    updatedAt: "2023-07-02",
  },
  {
    id: "req101",
    userId: "emp101",
    userName: "Sophie Leroy",
    type: "annual",
    startDate: "2023-08-15",
    endDate: "2023-08-30",
    status: "pending",
    createdAt: "2023-07-15",
    updatedAt: "2023-07-15",
  },
]

// Fonctions pour simuler les opérations de base de données

// Récupérer les demandes de congés d'un employé
export const getLeaveRequests = async (userId: string): Promise<LeaveRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const requests = mockLeaveRequests.filter((req) => req.userId === userId)
      resolve(requests)
    }, 500)
  })
}

// Récupérer toutes les demandes de congés
export const getAllLeaveRequests = async (): Promise<LeaveRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockLeaveRequests])
    }, 500)
  })
}

// Récupérer les demandes de congés en attente
export const getPendingLeaveRequests = async (): Promise<LeaveRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pendingRequests = mockLeaveRequests.filter((req) => req.status === "pending")
      resolve(pendingRequests)
    }, 500)
  })
}

// Créer une nouvelle demande de congé
export const createLeaveRequest = async (request: Partial<LeaveRequest>): Promise<LeaveRequest> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const employee = mockEmployees.find((emp) => emp.id === request.userId)
      const newRequest: LeaveRequest = {
        id: `req${Date.now()}`,
        userId: request.userId || "",
        userName: employee?.name,
        type: request.type || "annual",
        startDate: request.startDate || new Date(),
        endDate: request.endDate || new Date(),
        reason: request.reason,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockLeaveRequests.push(newRequest)
      resolve(newRequest)
    }, 500)
  })
}

// Mettre à jour le statut d'une demande de congé
export const updateLeaveRequestStatus = async (
  requestId: string,
  status: string,
  rejectionReason?: string,
): Promise<LeaveRequest> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockLeaveRequests.findIndex((req) => req.id === requestId)

      if (index === -1) {
        reject(new Error("Demande non trouvée"))
        return
      }

      const updatedRequest = {
        ...mockLeaveRequests[index],
        status,
        rejectionReason: status === "rejected" ? rejectionReason : undefined,
        updatedAt: new Date().toISOString(),
      }

      // Mettre à jour les soldes de congés si la demande est approuvée
      if (status === "approved") {
        const request = mockLeaveRequests[index]
        const employeeIndex = mockEmployees.findIndex((emp) => emp.id === request.userId)

        if (employeeIndex !== -1) {
          const startDate = new Date(request.startDate)
          const endDate = new Date(request.endDate)
          const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

          if (request.type === "annual") {
            mockEmployees[employeeIndex].leaveBalance.annualUsed += days
          } else if (request.type === "sick") {
            mockEmployees[employeeIndex].leaveBalance.sickUsed += days
          }
        }
      }

      mockLeaveRequests[index] = updatedRequest
      resolve(updatedRequest)
    }, 500)
  })
}

// Récupérer le solde de congés d'un employé
export const getLeaveBalance = async (userId: string): Promise<LeaveBalance | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const employee = mockEmployees.find((emp) => emp.id === userId)
      resolve(employee ? employee.leaveBalance : null)
    }, 500)
  })
}

// Récupérer la liste des employés
export const getEmployees = async (): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockEmployees])
    }, 500)
  })
}

// Mettre à jour le solde de congés d'un employé
export const updateEmployeeLeaveBalance = async (employeeId: string, update: LeaveBalanceUpdate): Promise<Employee> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex((emp) => emp.id === employeeId)

      if (index === -1) {
        reject(new Error("Employé non trouvé"))
        return
      }

      const updatedEmployee = {
        ...mockEmployees[index],
        leaveBalance: {
          ...mockEmployees[index].leaveBalance,
          annualTotal: update.annualTotal,
          sickTotal: update.sickTotal,
        },
      }

      mockEmployees[index] = updatedEmployee
      resolve(updatedEmployee)
    }, 500)
  })
}
