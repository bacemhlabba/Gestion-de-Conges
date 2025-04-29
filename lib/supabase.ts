import { createClient } from "@supabase/supabase-js"

// Création d'un singleton pour le client Supabase côté client
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Client Supabase pour le côté client
let browserClient: ReturnType<typeof createBrowserClient> | undefined

export const getSupabaseBrowserClient = () => {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowserClient should only be called in the browser")
  }
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

// Client Supabase pour le côté serveur
export const getSupabaseServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}
