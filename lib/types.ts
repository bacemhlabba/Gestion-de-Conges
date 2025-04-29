export interface Profile {
  id: string
  name: string
  email?: string
  role: string
  department: string
  created_at?: string
  updated_at?: string
}

export interface LeaveBalance {
  id?: string
  user_id?: string
  annual_total: number
  annual_used: number
  sick_total: number
  sick_used: number
  updated_at?: string
}

export interface LeaveRequest {
  id: string
  user_id: string
  user_name?: string
  type: string
  start_date: string
  end_date: string
  reason?: string
  status: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface LeaveBalanceUpdate {
  annual_total: number
  sick_total: number
}

export interface Employee extends Profile {
  leave_balance: LeaveBalance
}

export interface AuthUser {
  id: string
  email: string
}

export interface Session {
  user: AuthUser | null
  profile: Profile | null
}
