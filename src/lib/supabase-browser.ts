import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let client: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (typeof window === 'undefined') return null
  if (!client && supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey)
  }
  return client
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
