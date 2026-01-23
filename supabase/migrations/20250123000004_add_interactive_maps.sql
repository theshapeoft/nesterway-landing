-- Create maps table for storing map configurations
-- Maps are owned by users and can be assigned to multiple properties

CREATE TABLE IF NOT EXISTS public.maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  show_property_address BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create map_categories table for organizing pins
CREATE TABLE IF NOT EXISTS public.map_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID REFERENCES public.maps(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('blue', 'red', 'yellow', 'green', 'purple', 'orange')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create map_pins table for individual location pins
CREATE TABLE IF NOT EXISTS public.map_pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.map_categories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  place_id TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add active_map_id to properties table
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS active_map_id UUID REFERENCES public.maps(id) ON DELETE SET NULL;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_maps_user ON public.maps(user_id);
CREATE INDEX IF NOT EXISTS idx_map_categories_map ON public.map_categories(map_id);
CREATE INDEX IF NOT EXISTS idx_map_categories_order ON public.map_categories(map_id, order_index);
CREATE INDEX IF NOT EXISTS idx_map_pins_category ON public.map_pins(category_id);
CREATE INDEX IF NOT EXISTS idx_properties_active_map ON public.properties(active_map_id);

-- Function to update the updated_at timestamp for maps
CREATE OR REPLACE FUNCTION update_maps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on changes
CREATE TRIGGER maps_updated_at
  BEFORE UPDATE ON public.maps
  FOR EACH ROW
  EXECUTE FUNCTION update_maps_updated_at();

-- Enable Row Level Security
ALTER TABLE public.maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_pins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for maps table

-- Users can view their own maps
CREATE POLICY "Users can view own maps"
ON public.maps
FOR SELECT
USING (user_id = auth.uid());

-- Users can create maps
CREATE POLICY "Users can create maps"
ON public.maps
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own maps
CREATE POLICY "Users can update own maps"
ON public.maps
FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own maps
CREATE POLICY "Users can delete own maps"
ON public.maps
FOR DELETE
USING (user_id = auth.uid());

-- Public can view maps that are assigned to published properties
CREATE POLICY "Public can view maps for published properties"
ON public.maps
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.active_map_id = id
    AND p.status = 'published'
    AND p.is_deleted = false
  )
);

-- RLS Policies for map_categories table

-- Users can view categories for their own maps
CREATE POLICY "Users can view own map categories"
ON public.map_categories
FOR SELECT
USING (
  map_id IN (
    SELECT id FROM public.maps WHERE user_id = auth.uid()
  )
);

-- Users can create categories for their own maps
CREATE POLICY "Users can create map categories"
ON public.map_categories
FOR INSERT
WITH CHECK (
  map_id IN (
    SELECT id FROM public.maps WHERE user_id = auth.uid()
  )
);

-- Users can update categories for their own maps
CREATE POLICY "Users can update own map categories"
ON public.map_categories
FOR UPDATE
USING (
  map_id IN (
    SELECT id FROM public.maps WHERE user_id = auth.uid()
  )
);

-- Users can delete categories for their own maps
CREATE POLICY "Users can delete own map categories"
ON public.map_categories
FOR DELETE
USING (
  map_id IN (
    SELECT id FROM public.maps WHERE user_id = auth.uid()
  )
);

-- Public can view categories for maps assigned to published properties
CREATE POLICY "Public can view categories for published properties"
ON public.map_categories
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.maps m
    JOIN public.properties p ON p.active_map_id = m.id
    WHERE m.id = map_id
    AND p.status = 'published'
    AND p.is_deleted = false
  )
);

-- RLS Policies for map_pins table

-- Users can view pins for their own maps
CREATE POLICY "Users can view own map pins"
ON public.map_pins
FOR SELECT
USING (
  category_id IN (
    SELECT mc.id FROM public.map_categories mc
    JOIN public.maps m ON mc.map_id = m.id
    WHERE m.user_id = auth.uid()
  )
);

-- Users can create pins for their own maps
CREATE POLICY "Users can create map pins"
ON public.map_pins
FOR INSERT
WITH CHECK (
  category_id IN (
    SELECT mc.id FROM public.map_categories mc
    JOIN public.maps m ON mc.map_id = m.id
    WHERE m.user_id = auth.uid()
  )
);

-- Users can update pins for their own maps
CREATE POLICY "Users can update own map pins"
ON public.map_pins
FOR UPDATE
USING (
  category_id IN (
    SELECT mc.id FROM public.map_categories mc
    JOIN public.maps m ON mc.map_id = m.id
    WHERE m.user_id = auth.uid()
  )
);

-- Users can delete pins for their own maps
CREATE POLICY "Users can delete own map pins"
ON public.map_pins
FOR DELETE
USING (
  category_id IN (
    SELECT mc.id FROM public.map_categories mc
    JOIN public.maps m ON mc.map_id = m.id
    WHERE m.user_id = auth.uid()
  )
);

-- Public can view pins for maps assigned to published properties
CREATE POLICY "Public can view pins for published properties"
ON public.map_pins
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.map_categories mc
    JOIN public.maps m ON mc.map_id = m.id
    JOIN public.properties p ON p.active_map_id = m.id
    WHERE mc.id = category_id
    AND p.status = 'published'
    AND p.is_deleted = false
  )
);
