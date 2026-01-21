-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for host photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('host-photos', 'host-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Hosts can upload to their own property-images folder
CREATE POLICY "Hosts can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Hosts can update their own property images
CREATE POLICY "Hosts can update property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Hosts can delete their own property images
CREATE POLICY "Hosts can delete property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Anyone can view property images (public bucket)
CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Same policies for host-photos bucket
CREATE POLICY "Hosts can upload host photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'host-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Hosts can update host photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'host-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Hosts can delete host photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'host-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view host photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'host-photos');
