-- Training progress table
CREATE TABLE IF NOT EXISTS nursly_training_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id text NOT NULL,
  module_name text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 0,
  mandatory boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE nursly_training_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own training" ON nursly_training_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training" ON nursly_training_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training" ON nursly_training_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Saved searches table
CREATE TABLE IF NOT EXISTS nursly_saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialty text,
  location text,
  min_rate numeric(10,2),
  filters jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nursly_saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own searches" ON nursly_saved_searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own searches" ON nursly_saved_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own searches" ON nursly_saved_searches
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update own searches" ON nursly_saved_searches
  FOR UPDATE USING (auth.uid() = user_id);

-- Notification preferences table
CREATE TABLE IF NOT EXISTS nursly_notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  shift_alerts boolean NOT NULL DEFAULT true,
  booking_updates boolean NOT NULL DEFAULT true,
  payment_notifications boolean NOT NULL DEFAULT true,
  compliance_reminders boolean NOT NULL DEFAULT true,
  marketing boolean NOT NULL DEFAULT false,
  quiet_hours_enabled boolean NOT NULL DEFAULT false,
  quiet_hours_start time DEFAULT '22:00',
  quiet_hours_end time DEFAULT '08:00',
  channel_in_app boolean NOT NULL DEFAULT true,
  channel_email boolean NOT NULL DEFAULT true,
  channel_sms boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nursly_notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prefs" ON nursly_notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prefs" ON nursly_notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prefs" ON nursly_notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Moderation flags table
CREATE TABLE IF NOT EXISTS nursly_moderation_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_type text NOT NULL,
  flagged_user text,
  issue text NOT NULL,
  reason text,
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  action_taken text,
  reviewed_by uuid REFERENCES auth.users(id),
  flagged_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nursly_moderation_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all flags" ON nursly_moderation_flags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM nursly_profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );

CREATE POLICY "Admins can update flags" ON nursly_moderation_flags
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM nursly_profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );

CREATE POLICY "Admins can insert flags" ON nursly_moderation_flags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM nursly_profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );
