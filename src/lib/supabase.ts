import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lcvbehrzdsixsqmmvyta.supabase.co";
const supabaseKey = "sb_publishable_1cYeevCV7bvdPyhXTznkKg_G25crXD4"

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: false
    }
  }
);
