import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://radvbathoqurqtkehnwq.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZHZiYXRob3F1cnF0a2VobndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDU5NTksImV4cCI6MjA4OTU4MTk1OX0.8HINdacjxNrRoNUMQ3Qox-E4wvd6ONAEeSTBoqZvbgs"

export const supabase = createClient(supabaseUrl, supabaseKey)