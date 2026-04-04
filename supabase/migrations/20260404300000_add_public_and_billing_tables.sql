-- Blog posts table
CREATE TABLE IF NOT EXISTS nursly_blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text,
  content text,
  author_name text,
  category text,
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nursly_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts" ON nursly_blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage blog posts" ON nursly_blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM nursly_profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Support tickets / contact form submissions
CREATE TABLE IF NOT EXISTS nursly_support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_ref text NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  subject text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'p3' CHECK (priority IN ('p1', 'p2', 'p3', 'p4')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nursly_support_tickets ENABLE ROW LEVEL SECURITY;

-- Anyone can create a ticket (public contact form, no auth required)
CREATE POLICY "Anyone can create support tickets" ON nursly_support_tickets
  FOR INSERT WITH CHECK (true);

-- Admins can view and manage all tickets
CREATE POLICY "Admins can view all tickets" ON nursly_support_tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM nursly_profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );

CREATE POLICY "Admins can update tickets" ON nursly_support_tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM nursly_profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Referrals table (one row per user — stores their referral code)
CREATE TABLE IF NOT EXISTS nursly_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  referral_code text NOT NULL UNIQUE,
  total_uses integer NOT NULL DEFAULT 0,
  total_earnings numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nursly_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral" ON nursly_referrals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own referral" ON nursly_referrals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own referral" ON nursly_referrals
  FOR UPDATE USING (auth.uid() = user_id);

-- Referral uses — each time someone signs up using a referral code
CREATE TABLE IF NOT EXISTS nursly_referral_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id uuid NOT NULL REFERENCES nursly_referrals(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'qualified', 'paid')),
  reward_amount numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(referral_id, referred_user_id)
);

ALTER TABLE nursly_referral_uses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral uses" ON nursly_referral_uses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM nursly_referrals r
      WHERE r.id = nursly_referral_uses.referral_id
        AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all referral uses" ON nursly_referral_uses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM nursly_profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Invoices table (generated per billing period per organisation)
CREATE TABLE IF NOT EXISTS nursly_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_ref text NOT NULL UNIQUE,
  org_id uuid NOT NULL REFERENCES nursly_organisations(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_amount numeric(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  shift_count integer NOT NULL DEFAULT 0 CHECK (shift_count >= 0),
  worker_count integer NOT NULL DEFAULT 0 CHECK (worker_count >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  paid_at timestamptz,
  due_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nursly_invoices ENABLE ROW LEVEL SECURITY;

-- Providers can view their own org's invoices
CREATE POLICY "Providers can view own org invoices" ON nursly_invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM nursly_org_members
      WHERE org_id = nursly_invoices.org_id
        AND user_id = auth.uid()
    )
  );

-- Admins can manage all invoices
CREATE POLICY "Admins can manage all invoices" ON nursly_invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM nursly_profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );
