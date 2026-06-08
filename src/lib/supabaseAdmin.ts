import { createClient } from '@supabase/supabase-js'

// Separate client with no persistent session — used only for creating student
// auth accounts. Does NOT interfere with the logged-in admin session.
export const supabaseAuth = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  {
    auth: {
      storageKey: 'sc-student-create',
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
