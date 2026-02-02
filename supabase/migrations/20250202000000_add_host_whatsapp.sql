-- Add host WhatsApp number field for guest contact
ALTER TABLE properties ADD COLUMN IF NOT EXISTS host_whatsapp text;

-- Add comment for documentation
COMMENT ON COLUMN properties.host_whatsapp IS 'Host WhatsApp number for guest messaging (international format)';
