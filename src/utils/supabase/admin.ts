import { createClient } from "@supabase/supabase-js";

export async function getSupabaseAdmin() {
  
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
  return supabaseAdmin;
}
