import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "Your Supabase Url Here";
const supabaseAnonKey = "Your supabase anon key here";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
