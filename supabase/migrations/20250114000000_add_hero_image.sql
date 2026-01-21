-- Add hero_image_url column to properties table
ALTER TABLE public.properties ADD COLUMN hero_image_url TEXT;

-- Comment for documentation
COMMENT ON COLUMN public.properties.hero_image_url IS 'URL to property hero image in Supabase Storage';
