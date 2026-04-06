import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rpnkfmlfzxppyhljslgu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwbmtmbWxmenhwcHlobGpzbGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDE3NTIsImV4cCI6MjA5MDcxNzc1Mn0.t29Sg_BKcbtCLMPSJ3pImVGbJB2JRYqM5uSDIQrvD2c'

export const supabase = createClient(supabaseUrl, supabaseKey)