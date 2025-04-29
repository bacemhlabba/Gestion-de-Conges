import { getSupabaseBrowserClient, getSupabaseServerClient } from "./supabase"

// Modifier la fonction signIn pour mieux gérer les erreurs
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Erreur d'authentification:", error)
      throw error
    }

    // Récupérer le profil de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      console.error("Erreur lors de la récupération du profil:", profileError)
      throw profileError
    }

    return {
      user: data.user,
      profile,
    }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    throw error
  }
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient()
  return supabase.auth.signOut()
}

export async function getCurrentSession() {
  const supabase = getSupabaseBrowserClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { user: null, profile: null }
  }

  // Récupérer le profil de l'utilisateur
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (profileError) {
    console.error("Erreur lors de la récupération du profil:", profileError)
    return { user: session.user, profile: null }
  }

  return {
    user: session.user,
    profile,
  }
}

export async function createUserWithProfile(
  email: string,
  password: string,
  name: string,
  role: string,
  department: string,
) {
  const supabase = getSupabaseServerClient()

  // Créer un nouvel utilisateur
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (userError) {
    throw userError
  }

  // Créer le profil de l'utilisateur
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: userData.user.id,
      name,
      role,
      department,
    })
    .select()
    .single()

  if (profileError) {
    throw profileError
  }

  // Créer le solde de congés initial
  const { error: balanceError } = await supabase.from("leave_balances").insert({
    user_id: userData.user.id,
    annual_total: 25,
    annual_used: 0,
    sick_total: 15,
    sick_used: 0,
  })

  if (balanceError) {
    throw balanceError
  }

  return {
    user: userData.user,
    profile: profileData,
  }
}
