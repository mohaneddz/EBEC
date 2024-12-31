import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(process.env.NEXT_PUBLIC_EBEC_URL, process.env.NEXT_PUBLIC_EBEC_KEY);

export default supabase;
