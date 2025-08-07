import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bedgheuciqvzrbkozhjl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZGdoZXVjaXF2enJia296aGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE5NTIsImV4cCI6MjA3MDA0Nzk1Mn0.ZqWIW9bq7yt5_drf5BoRKzRIPQJ-KtPfJW9lMmGjzj0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
