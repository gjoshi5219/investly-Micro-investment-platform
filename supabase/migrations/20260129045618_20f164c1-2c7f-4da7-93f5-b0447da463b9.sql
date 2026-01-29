-- Fix: Require authentication for profiles table access
-- Drop the existing SELECT policy and create a new one that requires authentication
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Authenticated users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Fix: Require authentication for investments table access  
-- Drop existing SELECT policies and recreate with authentication requirement
DROP POLICY IF EXISTS "Users can view their own investments" ON public.investments;
DROP POLICY IF EXISTS "Business owners can view investments in their businesses" ON public.investments;

CREATE POLICY "Authenticated users can view their own investments" 
ON public.investments 
FOR SELECT 
TO authenticated
USING (auth.uid() = investor_id);

CREATE POLICY "Authenticated business owners can view investments in their businesses" 
ON public.investments 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.businesses 
  WHERE businesses.id = investments.business_id 
  AND businesses.owner_id = auth.uid()
));