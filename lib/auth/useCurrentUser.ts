'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface CurrentUser {
  id: string;
  email: string;
  role: string;
  full_name: string;
  status: string;
  store_id: string | null;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('users')
          .select('role, full_name, status, store_id')
          .eq('id', authUser.id)
          .single();

        setUser({
          id: authUser.id,
          email: authUser.email || '',
          role: profile?.role || 'employer',
          full_name: profile?.full_name || authUser.user_metadata?.full_name || '',
          status: profile?.status || 'pending',
          store_id: profile?.store_id || null,
        });
      } catch (err) {
        console.error('Error fetching current user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [supabase]);

  return { user, loading, isAdmin: user?.role === 'admin' };
}
