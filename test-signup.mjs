import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Attempting signup...');
  const { data, error } = await supabase.auth.signUp({
    email: `test${Date.now()}@test.com`,
    password: 'password123',
    options: {
      data: {
        role: 'admin',
        status: 'approved',
        full_name: 'Test Admin',
        store_name: 'Test Store'
      }
    }
  });

  if (error) {
    console.log('Signup Error:', error);
  } else {
    console.log('Signup Data:', data);
  }
}

test();
