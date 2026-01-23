-- Add require_guest_registration column to properties table
-- Allows hosts to require guests to register before viewing the guide

ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS require_guest_registration BOOLEAN DEFAULT false;

-- Create index for filtering by registration requirement
CREATE INDEX IF NOT EXISTS idx_properties_require_guest_registration
ON public.properties(require_guest_registration);

-- Create guest_registrations table for storing guest contact info
CREATE TABLE IF NOT EXISTS public.guest_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  additional_guests INTEGER DEFAULT 0,
  registered_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_guest_registrations_property
ON public.guest_registrations(property_id);

CREATE INDEX IF NOT EXISTS idx_guest_registrations_email
ON public.guest_registrations(email);

CREATE INDEX IF NOT EXISTS idx_guest_registrations_registered_at
ON public.guest_registrations(registered_at DESC);

-- Enable Row Level Security
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Property owners can view registrations for their properties
CREATE POLICY "Property owners can view guest registrations"
ON public.guest_registrations
FOR SELECT
USING (
  property_id IN (
    SELECT id FROM public.properties WHERE user_id = auth.uid()
  )
);

-- Policy: Anyone can insert (guests registering)
CREATE POLICY "Anyone can register as a guest"
ON public.guest_registrations
FOR INSERT
WITH CHECK (true);

-- Policy: Property owners can delete registrations (for GDPR compliance)
CREATE POLICY "Property owners can delete guest registrations"
ON public.guest_registrations
FOR DELETE
USING (
  property_id IN (
    SELECT id FROM public.properties WHERE user_id = auth.uid()
  )
);
