import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_EBEC_URL as string,
  process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY as string
);

import type { NextApiRequest, NextApiResponse } from 'next';

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return res.status(500).json({ error });
  res.status(200).json(data);
}

export default supabase;