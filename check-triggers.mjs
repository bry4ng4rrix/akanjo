import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for metadata

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTriggers() {
  const { data, error } = await supabase.rpc('get_triggers', { table_name: 'users', schema_name: 'auth' });
  // Wait, I don't have a get_triggers RPC.
  // I'll try to run a raw query via a temporary function if possible, 
  // or just check the users table directly.
  
  // Actually, I can just try to insert a log manually to see if it works.
  const { data: logData, error: logError } = await supabase
    .from('debug_logs')
    .insert({ message: 'Manual test log' })
    .select();
    
  console.log('Log test:', { data: logData, error: logError });
}

checkTriggers();
