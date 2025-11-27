-- Fix RLS policy for public submissions
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Public can submit" ON public.submissions;

-- Create a new PERMISSIVE policy that allows anyone to insert
CREATE POLICY "Public can submit" 
ON public.submissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Ensure anon role has INSERT permission
GRANT INSERT ON public.submissions TO anon;