-- Add restrictive policies for INSERT, UPDATE, DELETE on user_roles table
-- Only service role (backend) should be able to manage user roles

-- Policy to deny INSERT for all authenticated users (service role bypasses RLS)
CREATE POLICY "Deny insert for authenticated users" 
ON public.user_roles 
FOR INSERT 
TO authenticated 
WITH CHECK (false);

-- Policy to deny UPDATE for all authenticated users
CREATE POLICY "Deny update for authenticated users" 
ON public.user_roles 
FOR UPDATE 
TO authenticated 
USING (false);

-- Policy to deny DELETE for all authenticated users
CREATE POLICY "Deny delete for authenticated users" 
ON public.user_roles 
FOR DELETE 
TO authenticated 
USING (false);