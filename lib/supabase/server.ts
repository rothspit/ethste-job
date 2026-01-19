import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return supabaseCreateClient(supabaseUrl, supabaseKey);
}
