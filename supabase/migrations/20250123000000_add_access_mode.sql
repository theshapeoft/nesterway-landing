-- Add access_mode column to properties table for guest access control
-- Allows hosts to make their property guide public or invite-only

ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS access_mode TEXT DEFAULT 'public'
CHECK (access_mode IN ('public', 'invite_only'));

-- Create index for filtering by access mode
CREATE INDEX IF NOT EXISTS idx_properties_access_mode ON public.properties(access_mode);
