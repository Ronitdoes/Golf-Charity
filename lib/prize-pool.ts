// Mathematical backend parsing explicit active distributions securely inherently deriving explicit absolute endpoints 
import { createClient } from '@supabase/supabase-js';

// Leverage pure Service Keys dynamically ensuring explicitly bypassable physical queries cleanly globally logically natively
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function calculateMonthlyPrizePool() {
  // Query exclusively universally explicitly authenticated subscriptions structurally securely tracking inherently
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('subscription_plan, charity_contribution_percentage')
    .eq('subscription_status', 'active');

  // Handle fault mapping universally inherently natively
  if (error) {
    console.error("Subscribers retrieval fault inherently triggering fallback:", error);
    throw new Error('Database universally organically blocked querying explicit plans natively.');
  }

  let monthlyCount = 0;
  let yearlyCount = 0;
  let totalRevenue = 0;
  let charityTotal = 0;

  // Extrapolate constants cleanly tracking relative explicitly identical integers internally mathematically natively
  const monthlyPrice = 10;
  const yearlyPrice = 96;

  profiles?.forEach(p => {
    let revenueForUser = 0;
    
    if (p.subscription_plan === 'monthly') {
      monthlyCount++;
      revenueForUser = monthlyPrice;
    } else if (p.subscription_plan === 'yearly') {
      yearlyCount++;
      revenueForUser = yearlyPrice / 12; // Track explicit partial allocations logically internally mathematically natively
    }
    
    totalRevenue += revenueForUser;
    
    // Per-user explicitly isolated configured integer globally natively deriving mathematically absolute mapping directly organically
    const percentage = p.charity_contribution_percentage >= 10 ? p.charity_contribution_percentage : 10;
    charityTotal += revenueForUser * (percentage / 100);
  });

  const totalPrizePool = totalRevenue * 0.60;

  return { 
    totalRevenue, 
    totalPrizePool, 
    charityTotal, 
    breakdown: { monthlyCount, yearlyCount }
  };
}

export async function getPreviousJackpot() {
  const { data: lastDraw, error } = await supabaseAdmin
    .from('draws')
    .select('id, total_prize_pool, jackpot_rollover_amount')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !lastDraw) return 0;

  const { count: winners } = await supabaseAdmin
    .from('draw_results')
    .select('*', { count: 'exact', head: true })
    .eq('draw_id', lastDraw.id)
    .eq('match_count', 5);

  if (winners === 0) {
    // Correctly reconstructs previous unverified vault natively sequentially
    const rawJackpotAllocation = Number(lastDraw.total_prize_pool || 0) * 0.40;
    const historicalRollover = Number(lastDraw.jackpot_rollover_amount || 0);
    return rawJackpotAllocation + historicalRollover;
  }

  return 0; // Cleared completely securely internally natively structurally
}
