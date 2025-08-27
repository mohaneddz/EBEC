import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.NEXT_PUBLIC_EBEC_URL ?? '',
    process.env.NEXT_PUBLIC_EBEC_KEY ?? ''
  )
}