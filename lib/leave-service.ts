import { getSupabaseBrowserClient } from "./supabase"
import type { LeaveBalance, LeaveBalanceUpdate, LeaveRequest, Employee } from "./types"

// Fonction utilitaire pour calculer le nombre de jours ouvrables
export function calculateWorkingDays(startDate: Date, endDate: Date): number {
  let days = 0
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    // 0 = Dimanche, 6 = Samedi
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}

// Récupérer les demandes de congés d'un employé
export async function getLeaveRequests(userId: string): Promise<LeaveRequest[]> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des demandes:", error)
    throw error
  }

  return data || []
}

// Récupérer toutes les demandes de congés
export async function getAllLeaveRequests(): Promise<LeaveRequest[]> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("leave_requests")
    .select(`
      *,
      profiles (name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des demandes:", error)
    throw error
  }

  // Transformer les données pour correspondre à notre interface
  return (data || []).map((item) => ({
    ...item,
    user_name: item.profiles?.name,
  }))
}

// Récupérer les demandes de congés en attente
export async function getPendingLeaveRequests(): Promise<LeaveRequest[]> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("leave_requests")
    .select(`
      *,
      profiles (name)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des demandes:", error)
    throw error
  }

  // Transformer les données pour correspondre à notre interface
  return (data || []).map((item) => ({
    ...item,
    user_name: item.profiles?.name,
  }))
}

// Créer une nouvelle demande de congé
export async function createLeaveRequest(request: Partial<LeaveRequest>): Promise<LeaveRequest> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("leave_requests")
    .insert({
      user_id: request.user_id,
      type: request.type,
      start_date: request.start_date,
      end_date: request.end_date,
      reason: request.reason,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la création de la demande:", error)
    throw error
  }

  return data
}

// Mettre à jour le statut d'une demande de congé
export async function updateLeaveRequestStatus(
  requestId: string,
  status: string,
  rejectionReason?: string,
): Promise<LeaveRequest> {
  const supabase = getSupabaseBrowserClient()

  // Récupérer la demande actuelle
  const { data: currentRequest, error: fetchError } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("id", requestId)
    .single()

  if (fetchError) {
    console.error("Erreur lors de la récupération de la demande:", fetchError)
    throw fetchError
  }

  // Mettre à jour la demande
  const { data, error } = await supabase
    .from("leave_requests")
    .update({
      status,
      rejection_reason: status === "rejected" ? rejectionReason : null,
    })
    .eq("id", requestId)
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la mise à jour de la demande:", error)
    throw error
  }

  // Si la demande est approuvée, mettre à jour les soldes de congés
  if (status === "approved") {
    const days = calculateWorkingDays(new Date(currentRequest.start_date), new Date(currentRequest.end_date))

    const { data: balance, error: balanceError } = await supabase
      .from("leave_balances")
      .select("*")
      .eq("user_id", currentRequest.user_id)
      .single()

    if (balanceError) {
      console.error("Erreur lors de la récupération du solde:", balanceError)
      throw balanceError
    }

    if (currentRequest.type === "annual") {
      await supabase
        .from("leave_balances")
        .update({ annual_used: balance.annual_used + days })
        .eq("user_id", currentRequest.user_id)
    } else if (currentRequest.type === "sick") {
      await supabase
        .from("leave_balances")
        .update({ sick_used: balance.sick_used + days })
        .eq("user_id", currentRequest.user_id)
    }
  }

  return data
}

// Récupérer le solde de congés d'un employé
export async function getLeaveBalance(userId: string): Promise<LeaveBalance> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("leave_balances").select("*").eq("user_id", userId).single()

  if (error) {
    if (error.code === "PGRST116") {
      // Code pour "No rows found"
      // Créer un solde par défaut si aucun n'existe
      const { data: newBalance, error: insertError } = await supabase
        .from("leave_balances")
        .insert({
          user_id: userId,
          annual_total: 25,
          annual_used: 0,
          sick_total: 15,
          sick_used: 0,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Erreur lors de la création du solde:", insertError)
        throw insertError
      }

      return newBalance
    }

    console.error("Erreur lors de la récupération du solde:", error)
    throw error
  }

  return data
}

// Récupérer la liste des employés
export async function getEmployees(): Promise<Employee[]> {
  const supabase = getSupabaseBrowserClient()

  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").eq("role", "employee")

  if (profilesError) {
    console.error("Erreur lors de la récupération des profils:", profilesError)
    throw profilesError
  }

  const employees: Employee[] = []

  for (const profile of profiles) {
    const { data: balance, error: balanceError } = await supabase
      .from("leave_balances")
      .select("*")
      .eq("user_id", profile.id)
      .single()

    if (balanceError && balanceError.code !== "PGRST116") {
      console.error("Erreur lors de la récupération du solde:", balanceError)
      continue
    }

    employees.push({
      ...profile,
      leave_balance: balance || {
        annual_total: 25,
        annual_used: 0,
        sick_total: 15,
        sick_used: 0,
      },
    })
  }

  return employees
}

// Mettre à jour le solde de congés d'un employé
export async function updateEmployeeLeaveBalance(employeeId: string, update: LeaveBalanceUpdate): Promise<Employee> {
  const supabase = getSupabaseBrowserClient()

  // Vérifier si l'employé existe
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", employeeId)
    .single()

  if (profileError) {
    console.error("Erreur lors de la récupération du profil:", profileError)
    throw profileError
  }

  // Vérifier si un solde existe déjà
  const { data: existingBalance, error: balanceError } = await supabase
    .from("leave_balances")
    .select("*")
    .eq("user_id", employeeId)
    .single()

  let balance

  if (balanceError && balanceError.code === "PGRST116") {
    // Créer un nouveau solde
    const { data: newBalance, error: insertError } = await supabase
      .from("leave_balances")
      .insert({
        user_id: employeeId,
        annual_total: update.annual_total,
        annual_used: 0,
        sick_total: update.sick_total,
        sick_used: 0,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Erreur lors de la création du solde:", insertError)
      throw insertError
    }

    balance = newBalance
  } else if (balanceError) {
    console.error("Erreur lors de la récupération du solde:", balanceError)
    throw balanceError
  } else {
    // Mettre à jour le solde existant
    const { data: updatedBalance, error: updateError } = await supabase
      .from("leave_balances")
      .update({
        annual_total: update.annual_total,
        sick_total: update.sick_total,
      })
      .eq("user_id", employeeId)
      .select()
      .single()

    if (updateError) {
      console.error("Erreur lors de la mise à jour du solde:", updateError)
      throw updateError
    }

    balance = updatedBalance
  }

  return {
    ...profile,
    leave_balance: balance,
  }
}
