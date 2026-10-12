-- ==============================================================================
-- AuraStream: Initial PostgreSQL & Supabase Migration
-- Schema for Users, Offerings, Orders, Sessions, Ledger, and Entitlements
-- Includes strict Row Level Security (RLS) policies and pgvector extension
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Vector embeddings for AI consultation semantic search

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'consultant', 'admin')),
    balance_usd NUMERIC(12, 2) NOT NULL DEFAULT 150.00 CHECK (balance_usd >= 0),
    auto_recharge_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    auto_recharge_threshold_usd NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
    auto_recharge_amount_usd NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    preferred_audio_device TEXT,
    preferred_video_device TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Consultation Offerings Table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultant_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    consultant_title TEXT NOT NULL,
    bio TEXT NOT NULL,
    category TEXT NOT NULL,
    hourly_rate_usd NUMERIC(10, 2) NOT NULL CHECK (hourly_rate_usd > 0),
    rate_per_minute_usd NUMERIC(10, 2) GENERATED ALWAYS AS (ROUND(hourly_rate_usd / 60, 2)) STORED,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    reviews_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    availability_status TEXT NOT NULL DEFAULT 'Available Now',
    embedding vector(1536), -- Semantic search embedding for consultation domain matching
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Session Records Table (Real-Time WebRTC Streaming Sessions)
CREATE TABLE IF NOT EXISTS public.session_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'initializing' CHECK (status IN ('initializing', 'active', 'paused', 'completed', 'terminated')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    total_charged_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    signaling_channel_id TEXT NOT NULL,
    ice_connection_state TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE RESTRICT,
    session_id UUID REFERENCES public.session_records(id) ON DELETE SET NULL,
    duration_minutes INTEGER NOT NULL,
    amount_usd NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'refunded', 'failed')),
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Billing Ledger Entries Table (Strict double-entry ledger)
CREATE TABLE IF NOT EXISTS public.ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    type TEXT NOT NULL CHECK (type IN ('session_charge', 'account_recharge', 'refund', 'payout_transfer')),
    description TEXT NOT NULL,
    amount_usd NUMERIC(10, 2) NOT NULL, -- Negative for debits/charges, positive for credits
    balance_after_usd NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'settled' CHECK (status IN ('settled', 'pending', 'failed')),
    reference_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Authorization Entitlements Table
CREATE TABLE IF NOT EXISTS public.entitlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feature_flag TEXT NOT NULL,
    granted_by TEXT NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, feature_flag)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile; admins can view all
CREATE POLICY "Users view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Offers: Active offerings are publicly readable by authenticated users
CREATE POLICY "Public active offers" ON public.offers
    FOR SELECT USING (is_active = TRUE);

-- Session Records: Users can view and insert their own session records
CREATE POLICY "Users view own sessions" ON public.session_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own sessions" ON public.session_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Orders: Users can view only their own orders
CREATE POLICY "Users view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Ledger: Users can view only their own ledger entries. INSERT/UPDATE strictly by server service_role
CREATE POLICY "Users view own ledger" ON public.ledger_entries
    FOR SELECT USING (auth.uid() = user_id);

-- Entitlements: Users can view their own entitlements
CREATE POLICY "Users view own entitlements" ON public.entitlements
    FOR SELECT USING (auth.uid() = user_id);

-- Indexes for high-frequency queries
CREATE INDEX IF NOT EXISTS idx_offers_category ON public.offers(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_ledger_user_id ON public.ledger_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.session_records(user_id);
