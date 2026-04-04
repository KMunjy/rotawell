-- Instant Pay requests table
CREATE TABLE IF NOT EXISTS nursly_instant_pay_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shift_id uuid NOT NULL REFERENCES nursly_shifts(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  fee numeric(10,2) NOT NULL DEFAULT 0 CHECK (fee >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nursly_instant_pay_requests ENABLE ROW LEVEL SECURITY;

-- Workers can view their own requests
CREATE POLICY "Users can view own instant pay requests" ON nursly_instant_pay_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Workers can create their own requests
CREATE POLICY "Users can insert own instant pay requests" ON nursly_instant_pay_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all requests
CREATE POLICY "Admins can view all instant pay requests" ON nursly_instant_pay_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM nursly_profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Admins can update any request (approve/reject/process)
CREATE POLICY "Admins can update instant pay requests" ON nursly_instant_pay_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM nursly_profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Providers can view instant pay requests for shifts belonging to their org
CREATE POLICY "Providers can view org instant pay requests" ON nursly_instant_pay_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM nursly_shifts s
      JOIN nursly_org_members om ON om.org_id = s.org_id
      WHERE s.id = nursly_instant_pay_requests.shift_id
        AND om.user_id = auth.uid()
    )
  );

-- Instant Pay user settings table
CREATE TABLE IF NOT EXISTS nursly_instant_pay_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  enabled boolean NOT NULL DEFAULT false,
  preferred_method text NOT NULL DEFAULT 'bank_transfer' CHECK (preferred_method IN ('bank_transfer', 'mobile_money')),
  account_details jsonb DEFAULT '{}'::jsonb,
  max_percentage integer NOT NULL DEFAULT 70 CHECK (max_percentage > 0 AND max_percentage <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nursly_instant_pay_settings ENABLE ROW LEVEL SECURITY;

-- Users can view their own settings
CREATE POLICY "Users can view own instant pay settings" ON nursly_instant_pay_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own settings
CREATE POLICY "Users can insert own instant pay settings" ON nursly_instant_pay_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own instant pay settings" ON nursly_instant_pay_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all settings
CREATE POLICY "Admins can view all instant pay settings" ON nursly_instant_pay_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM nursly_profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );
