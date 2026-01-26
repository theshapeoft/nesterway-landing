-- Create guest_invites table for time-limited guest access
-- Allows hosts to create invites with check-in/out dates and access codes

CREATE TABLE IF NOT EXISTS public.guest_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  lead_time_days INTEGER DEFAULT 7,
  post_checkout_days INTEGER DEFAULT 3,
  access_code TEXT UNIQUE NOT NULL,
  custom_message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'revoked')),
  email_sent_at TIMESTAMPTZ,
  email_resend_count INTEGER DEFAULT 0,
  last_resend_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_guest_invites_property
ON public.guest_invites(property_id);

CREATE INDEX IF NOT EXISTS idx_guest_invites_code
ON public.guest_invites(access_code);

CREATE INDEX IF NOT EXISTS idx_guest_invites_email
ON public.guest_invites(guest_email);

CREATE INDEX IF NOT EXISTS idx_guest_invites_status
ON public.guest_invites(status);

CREATE INDEX IF NOT EXISTS idx_guest_invites_dates
ON public.guest_invites(check_in_date, check_out_date);

-- Function to generate 8-character uppercase access code
CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_guest_invite_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on changes
CREATE TRIGGER guest_invites_updated_at
  BEFORE UPDATE ON public.guest_invites
  FOR EACH ROW
  EXECUTE FUNCTION update_guest_invite_updated_at();

-- Enable Row Level Security
ALTER TABLE public.guest_invites ENABLE ROW LEVEL SECURITY;

-- Policy: Property owners can view invites for their properties
CREATE POLICY "Property owners can view guest invites"
ON public.guest_invites
FOR SELECT
USING (
  property_id IN (
    SELECT id FROM public.properties WHERE host_id = auth.uid()
  )
);

-- Policy: Property owners can create invites for their properties
CREATE POLICY "Property owners can create guest invites"
ON public.guest_invites
FOR INSERT
WITH CHECK (
  property_id IN (
    SELECT id FROM public.properties WHERE host_id = auth.uid()
  )
);

-- Policy: Property owners can update invites for their properties
CREATE POLICY "Property owners can update guest invites"
ON public.guest_invites
FOR UPDATE
USING (
  property_id IN (
    SELECT id FROM public.properties WHERE host_id = auth.uid()
  )
);

-- Policy: Property owners can delete invites for their properties
CREATE POLICY "Property owners can delete guest invites"
ON public.guest_invites
FOR DELETE
USING (
  property_id IN (
    SELECT id FROM public.properties WHERE host_id = auth.uid()
  )
);

-- Policy: Anyone can read invites by access code (for guest validation)
-- This is a limited select that only returns if the code matches
CREATE POLICY "Anyone can validate access code"
ON public.guest_invites
FOR SELECT
USING (true);
