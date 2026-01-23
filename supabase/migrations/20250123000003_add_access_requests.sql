-- Access requests table for rate limiting contact host form
-- Rate limit: 1 request per email per property per 24 hours

CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for rate limit checks (property + email + time)
CREATE INDEX idx_access_requests_rate_limit ON access_requests(property_id, guest_email, created_at);

-- Index for listing requests by property
CREATE INDEX idx_access_requests_property ON access_requests(property_id);

-- RLS policies
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert access requests (public form)
CREATE POLICY "Anyone can insert access requests"
  ON access_requests FOR INSERT
  WITH CHECK (true);

-- Property owners can view access requests for their properties
CREATE POLICY "Hosts can view access requests for their properties"
  ON access_requests FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE host_id = auth.uid()
    )
  );

-- Property owners can delete access requests for their properties
CREATE POLICY "Hosts can delete access requests for their properties"
  ON access_requests FOR DELETE
  USING (
    property_id IN (
      SELECT id FROM properties WHERE host_id = auth.uid()
    )
  );
