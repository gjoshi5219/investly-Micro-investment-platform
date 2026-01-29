-- Add location fields to businesses
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'remote',
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS is_remote BOOLEAN DEFAULT true;

-- Add verification fields to businesses
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'document_uploaded', 'under_review', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS verification_documents TEXT[],
ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Add business size tier (for listing fee calculation)
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS business_tier TEXT DEFAULT 'small' CHECK (business_tier IN ('small', 'medium', 'high'));

-- Add payment tracking fields
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS listing_fee_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_payment_id TEXT,
ADD COLUMN IF NOT EXISTS promo_code_used TEXT;

-- Create promo_codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER DEFAULT 100, -- 100 means free
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on promo_codes
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for reading active promo codes (for validation)
CREATE POLICY "Anyone can validate promo codes"
ON public.promo_codes
FOR SELECT
USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

-- Create policy for admins to manage promo codes (using a simple check for now)
-- Note: In production, you'd want a proper admin roles table

-- Create business_verifications table for document tracking
CREATE TABLE IF NOT EXISTS public.business_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('business_registration', 'pan_card', 'gst_certificate', 'bank_statement', 'other')),
  document_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on business_verifications
ALTER TABLE public.business_verifications ENABLE ROW LEVEL SECURITY;

-- Owners can view their own verification documents
CREATE POLICY "Business owners can view their verifications"
ON public.business_verifications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = business_verifications.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Owners can upload verification documents
CREATE POLICY "Business owners can upload verifications"
ON public.business_verifications
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = business_verifications.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Add location column to profiles for currency localization
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'IN',
ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verification-documents', 'verification-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for verification documents
CREATE POLICY "Users can upload their verification documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'verification-documents' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view their own verification documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'verification-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add index for location filtering
CREATE INDEX IF NOT EXISTS idx_businesses_location ON public.businesses(location);
CREATE INDEX IF NOT EXISTS idx_businesses_is_remote ON public.businesses(is_remote);
CREATE INDEX IF NOT EXISTS idx_businesses_verification_status ON public.businesses(verification_status);
CREATE INDEX IF NOT EXISTS idx_businesses_business_tier ON public.businesses(business_tier);