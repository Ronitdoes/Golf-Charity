'use client';

// Client-side hook to fetch and expose the authenticated user's subscription status
import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export interface SubscriptionData {
  status: 'active' | 'inactive' | 'lapsed' | 'cancelled' | null;
  plan: 'monthly' | 'yearly' | null;
  renewalDate: string | null;
  isActive: boolean;
}

export function useSubscription() {
  const [data, setData] = useState<SubscriptionData>({
    status: null,
    plan: null,
    renewalDate: null,
    isActive: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_plan, subscription_renewal_date')
        .eq('id', user.id)
        .single();

      if (profile) {
        setData({
          status: profile.subscription_status,
          plan: profile.subscription_plan,
          renewalDate: profile.subscription_renewal_date,
          isActive: profile.subscription_status === 'active',
        });
      }
      setLoading(false);
    }

    fetchSubscription();
  }, []);

  return { ...data, loading };
}
