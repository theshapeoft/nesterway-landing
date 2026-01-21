-- Create hosts table (extends auth.users)
CREATE TABLE public.hosts (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    photo_url TEXT,
    subscription_tier VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on hosts
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;

-- Hosts can view and update their own record
CREATE POLICY "Users can view own host profile"
    ON public.hosts FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own host profile"
    ON public.hosts FOR UPDATE
    USING (auth.uid() = id);

-- Create properties table
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES public.hosts(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    area_slug VARCHAR(100),
    country_slug VARCHAR(100),
    welcome_message TEXT,
    host_display_name VARCHAR(100),
    host_photo_url TEXT,
    checkout_time TIME DEFAULT '11:00',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for properties
CREATE INDEX idx_properties_host ON public.properties(host_id);
CREATE INDEX idx_properties_slug ON public.properties(slug);
CREATE INDEX idx_properties_status ON public.properties(status) WHERE is_deleted = false;

-- Enable RLS on properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Hosts can CRUD their own properties
CREATE POLICY "Hosts can view own properties"
    ON public.properties FOR SELECT
    USING (auth.uid() = host_id);

CREATE POLICY "Hosts can insert own properties"
    ON public.properties FOR INSERT
    WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update own properties"
    ON public.properties FOR UPDATE
    USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete own properties"
    ON public.properties FOR DELETE
    USING (auth.uid() = host_id);

-- Public can view published, non-deleted properties
CREATE POLICY "Public can view published properties"
    ON public.properties FOR SELECT
    USING (status = 'published' AND is_deleted = false);

-- Create wifi_networks table
CREATE TABLE public.wifi_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    security_type VARCHAR(20) DEFAULT 'WPA' CHECK (security_type IN ('WPA', 'WEP', 'nopass')),
    description VARCHAR(200),
    is_primary BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wifi_property ON public.wifi_networks(property_id);

-- Enable RLS on wifi_networks
ALTER TABLE public.wifi_networks ENABLE ROW LEVEL SECURITY;

-- WiFi networks follow property access
CREATE POLICY "Hosts can manage own wifi networks"
    ON public.wifi_networks FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_id AND p.host_id = auth.uid()
        )
    );

CREATE POLICY "Public can view wifi for published properties"
    ON public.wifi_networks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_id
            AND p.status = 'published'
            AND p.is_deleted = false
        )
    );

-- Create emergency_contacts table
CREATE TABLE public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emergency_property ON public.emergency_contacts(property_id);

-- Enable RLS on emergency_contacts
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts can manage own emergency contacts"
    ON public.emergency_contacts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_id AND p.host_id = auth.uid()
        )
    );

CREATE POLICY "Public can view emergency contacts for published properties"
    ON public.emergency_contacts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_id
            AND p.status = 'published'
            AND p.is_deleted = false
        )
    );

-- Create property_sections table
CREATE TABLE public.property_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    content JSONB NOT NULL DEFAULT '[]',
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sections_property ON public.property_sections(property_id);

-- Enable RLS on property_sections
ALTER TABLE public.property_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts can manage own property sections"
    ON public.property_sections FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_id AND p.host_id = auth.uid()
        )
    );

CREATE POLICY "Public can view sections for published properties"
    ON public.property_sections FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_id
            AND p.status = 'published'
            AND p.is_deleted = false
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_hosts_updated
    BEFORE UPDATE ON public.hosts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trigger_properties_updated
    BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trigger_sections_updated
    BEFORE UPDATE ON public.property_sections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to auto-create host profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.hosts (id, name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create host profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate slug from property name
CREATE OR REPLACE FUNCTION public.generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                TRIM(name),
                '[^a-zA-Z0-9\s-]', '', 'g'
            ),
            '\s+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;
