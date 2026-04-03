-- ============================================================================
-- SQL Schema for Golf Charity Subscription Platform
-- Run this complete file in the Supabase SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Custom Enum Types
-- ----------------------------------------------------------------------------
CREATE TYPE subscription_status_enum AS ENUM ('active', 'inactive', 'lapsed', 'cancelled');
CREATE TYPE subscription_plan_enum AS ENUM ('monthly', 'yearly');
CREATE TYPE draw_status_enum AS ENUM ('draft', 'simulation', 'published');
CREATE TYPE draw_logic_type_enum AS ENUM ('random', 'algorithmic');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid');
CREATE TYPE subscription_event_type_enum AS ENUM ('created', 'renewed', 'cancelled', 'lapsed');

-- ----------------------------------------------------------------------------
-- 2. Tables
-- ----------------------------------------------------------------------------

-- Charities (needs to be created before profiles as it's referenced by profiles)
CREATE TABLE public.charities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  subscription_status subscription_status_enum DEFAULT 'inactive',
  subscription_plan subscription_plan_enum,
  subscription_renewal_date TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  selected_charity_id UUID REFERENCES public.charities(id) ON DELETE SET NULL,
  charity_contribution_percentage INTEGER DEFAULT 10 CHECK (charity_contribution_percentage >= 10),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Scores
CREATE TABLE public.scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  played_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Charity Events
CREATE TABLE public.charity_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Draws
CREATE TABLE public.draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month DATE NOT NULL,
  status draw_status_enum DEFAULT 'draft',
  logic_type draw_logic_type_enum DEFAULT 'random',
  drawn_numbers INTEGER[] CHECK (array_length(drawn_numbers, 1) = 5),
  jackpot_rollover_amount NUMERIC DEFAULT 0,
  total_prize_pool NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Draw Results
CREATE TABLE public.draw_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_count INTEGER NOT NULL CHECK (match_count IN (3, 4, 5)),
  prize_amount NUMERIC NOT NULL,
  payment_status payment_status_enum DEFAULT 'pending',
  proof_url TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions Log
CREATE TABLE public.subscriptions_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type subscription_event_type_enum NOT NULL,
  amount NUMERIC NOT NULL,
  stripe_event_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. Trigger Functions
-- ----------------------------------------------------------------------------

-- A. Update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_charities_updated_at
BEFORE UPDATE ON public.charities
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- B. Enforce 5-score rolling window
CREATE OR REPLACE FUNCTION enforce_max_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- If count exceeds 5 for the user, delete the oldest
  IF (SELECT count(*) FROM public.scores WHERE user_id = NEW.user_id) > 5 THEN
    DELETE FROM public.scores
    WHERE id IN (
      SELECT id FROM public.scores
      WHERE user_id = NEW.user_id
        -- Order by played_at ASC (oldest first), then by arbitrary created_at if tied
      ORDER BY played_at ASC, created_at ASC
      LIMIT (SELECT count(*) - 5 FROM public.scores WHERE user_id = NEW.user_id)
    );
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER maintain_five_scores
AFTER INSERT ON public.scores
FOR EACH ROW EXECUTE FUNCTION enforce_max_scores();

-- ----------------------------------------------------------------------------
-- 4. Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX idx_scores_user_id_played_at ON public.scores(user_id, played_at DESC);
CREATE INDEX idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX idx_charity_events_charity_id ON public.charity_events(charity_id);
CREATE INDEX idx_draw_results_draw_id ON public.draw_results(draw_id);
CREATE INDEX idx_draw_results_user_id ON public.draw_results(user_id);
CREATE INDEX idx_subscriptions_log_user_id ON public.subscriptions_log(user_id);

-- ----------------------------------------------------------------------------
-- 5. Row Level Security & Policies
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions_log ENABLE ROW LEVEL SECURITY;

-- Helper Function to Check Admin Role
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Users can read/write their own profile; admins can read/write all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR is_admin());
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL USING (is_admin());

-- Scores: Users can read/write own scores; admins can read/write all
CREATE POLICY "Users can view own scores" ON public.scores FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can insert own scores" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can update own scores" ON public.scores FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can delete own scores" ON public.scores FOR DELETE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admins can manage scores" ON public.scores FOR ALL USING (is_admin());

-- Charities: Anyone can read; admins can write everything
CREATE POLICY "Charities are viewable by everyone" ON public.charities FOR SELECT USING (true);
CREATE POLICY "Charities are editable by admins" ON public.charities FOR ALL USING (is_admin());

-- Charity Events: Anyone can read; admins can write everything
CREATE POLICY "Charity events are viewable by everyone" ON public.charity_events FOR SELECT USING (true);
CREATE POLICY "Charity events are editable by admins" ON public.charity_events FOR ALL USING (is_admin());

-- Draws: Anyone can read 'published' draws; admins can read/write all
CREATE POLICY "Draws viewable by everyone if published" ON public.draws FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Draws editable by admins" ON public.draws FOR ALL USING (is_admin());

-- Draw Results: Users can read/update own; admins can manage all
CREATE POLICY "Users can view own draw results" ON public.draw_results FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can update own draw results" ON public.draw_results FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admins can manage draw results" ON public.draw_results FOR ALL USING (is_admin());

-- Subscriptions Log: Users can read own; admins can manage all
CREATE POLICY "Users can view own logs" ON public.subscriptions_log FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admins can manage logs" ON public.subscriptions_log FOR ALL USING (is_admin());
