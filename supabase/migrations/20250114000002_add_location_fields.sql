-- Add location fields to properties table for Google Places integration
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7),
ADD COLUMN IF NOT EXISTS place_id VARCHAR(255);

-- Create index for place_id lookups
CREATE INDEX IF NOT EXISTS idx_properties_place_id ON public.properties(place_id);

-- Create index for city/country queries
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties(country, city);
