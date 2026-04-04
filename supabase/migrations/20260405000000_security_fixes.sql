-- =============================================================================
-- Security fixes migration
-- Applied: 2026-04-05
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Support tickets: add user_id column and fix RLS
-- ---------------------------------------------------------------------------

-- Add user_id to link tickets created by authenticated users
ALTER TABLE nursly_support_tickets
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Make name/email nullable so authenticated users don't have to re-supply them
-- (public contact form submissions still require name + email at the app layer)
ALTER TABLE nursly_support_tickets
  ALTER COLUMN name DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL;

-- Drop the old "WITH CHECK (true)" policy that allowed unauthenticated inserts
DROP POLICY IF EXISTS "Anyone can create support tickets" ON nursly_support_tickets;

-- Authenticated users can only create tickets linked to their own account
CREATE POLICY "Authenticated users can create support tickets"
  ON nursly_support_tickets
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

-- Authenticated users can view their own tickets
CREATE POLICY "Users can view own support tickets"
  ON nursly_support_tickets
  FOR SELECT
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 2. Role sanitization trigger on nursly_profiles
--
-- Prevents privilege escalation: even if a client submits role='platform_admin'
-- the trigger silently downgrades it to 'nurse' on INSERT.
-- Only 'nurse' and 'agency_admin' are valid self-registration roles.
-- platform_admin must be granted manually in the database by an existing admin.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION enforce_profile_role()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
BEGIN
  IF NEW.role NOT IN ('nurse', 'agency_admin') THEN
    NEW.role := 'nurse';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_role ON nursly_profiles;

CREATE TRIGGER trg_enforce_profile_role
  BEFORE INSERT ON nursly_profiles
  FOR EACH ROW
  EXECUTE FUNCTION enforce_profile_role();
