-- Run this in Supabase SQL Editor to set up the database

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  cash_balance NUMERIC(12, 2) NOT NULL DEFAULT 1000000.00,
  initial_balance NUMERIC(12, 2) NOT NULL DEFAULT 1000000.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Holdings table
CREATE TABLE IF NOT EXISTS public.holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  shares NUMERIC(12, 6) NOT NULL CHECK (shares > 0),
  avg_cost_basis NUMERIC(12, 4) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, ticker)
);
CREATE INDEX IF NOT EXISTS idx_holdings_user ON public.holdings(user_id);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('BUY', 'SELL')),
  shares NUMERIC(12, 6) NOT NULL,
  price_per_share NUMERIC(12, 4) NOT NULL,
  total_amount NUMERIC(14, 2) NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(executed_at DESC);

-- Watchlist table
CREATE TABLE IF NOT EXISTS public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, ticker)
);
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON public.watchlist(user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic trade execution function
CREATE OR REPLACE FUNCTION execute_trade(
  p_user_id UUID,
  p_ticker TEXT,
  p_company_name TEXT,
  p_type TEXT,
  p_shares NUMERIC,
  p_price NUMERIC
) RETURNS VOID AS $$
DECLARE
  v_total NUMERIC;
  v_existing_shares NUMERIC;
  v_existing_cost NUMERIC;
  v_new_avg_cost NUMERIC;
BEGIN
  v_total := p_shares * p_price;

  IF p_type = 'BUY' THEN
    IF (SELECT cash_balance FROM profiles WHERE id = p_user_id) < v_total THEN
      RAISE EXCEPTION 'Insufficient funds';
    END IF;

    UPDATE profiles SET cash_balance = cash_balance - v_total, updated_at = NOW()
    WHERE id = p_user_id;

    SELECT shares, avg_cost_basis INTO v_existing_shares, v_existing_cost
    FROM holdings WHERE user_id = p_user_id AND ticker = p_ticker;

    IF v_existing_shares IS NOT NULL THEN
      v_new_avg_cost := ((v_existing_shares * v_existing_cost) + v_total) / (v_existing_shares + p_shares);
      UPDATE holdings SET shares = shares + p_shares, avg_cost_basis = v_new_avg_cost, updated_at = NOW()
      WHERE user_id = p_user_id AND ticker = p_ticker;
    ELSE
      INSERT INTO holdings (user_id, ticker, company_name, shares, avg_cost_basis)
      VALUES (p_user_id, p_ticker, p_company_name, p_shares, p_price);
    END IF;

  ELSIF p_type = 'SELL' THEN
    SELECT shares INTO v_existing_shares FROM holdings WHERE user_id = p_user_id AND ticker = p_ticker;
    IF v_existing_shares IS NULL OR v_existing_shares < p_shares THEN
      RAISE EXCEPTION 'Insufficient shares';
    END IF;

    UPDATE profiles SET cash_balance = cash_balance + v_total, updated_at = NOW()
    WHERE id = p_user_id;

    IF v_existing_shares = p_shares THEN
      DELETE FROM holdings WHERE user_id = p_user_id AND ticker = p_ticker;
    ELSE
      UPDATE holdings SET shares = shares - p_shares, updated_at = NOW()
      WHERE user_id = p_user_id AND ticker = p_ticker;
    END IF;
  END IF;

  INSERT INTO transactions (user_id, ticker, company_name, type, shares, price_per_share, total_amount)
  VALUES (p_user_id, p_ticker, p_company_name, p_type, p_shares, p_price, v_total);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can manage own holdings" ON public.holdings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own watchlist" ON public.watchlist FOR ALL USING (auth.uid() = user_id);
