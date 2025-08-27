import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(process.env.NEXT_PUBLIC_EBEC_URL as string, process.env.NEXT_PUBLIC_EBEC_KEY as string);

export default supabase;
