export interface LeaveRequest {
  id: string
  userId: string
  userName?: string
  type: string
  startDate: string | Date
  endDate: string | Date
  reason?: string
  status: string
  rejectionReason?: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface LeaveBalance {
  annualTotal: number
  annualUsed: number
  sickTotal: number
  sickUsed: number
}

export interface Employee {
  id: string
  name: string
  email: string
  department: string
  leaveBalance: LeaveBalance
}

export interface LeaveBalanceUpdate {
  annualTotal: number
  sickTotal: number
}
