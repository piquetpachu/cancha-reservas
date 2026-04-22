import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rpnkfmlfzxppyhljslgu.supabase.co'
const supabaseAnonKey = 'sb_publishable_coscbgccCoLsPJF2xyxcTg_DazvstLr'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)