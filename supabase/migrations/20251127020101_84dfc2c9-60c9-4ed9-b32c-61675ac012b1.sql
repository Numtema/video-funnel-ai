-- Allow public users to update their own analytics sessions
CREATE POLICY "Public can update own session" 
ON analytics_sessions
FOR UPDATE 
TO public
USING (true)
WITH CHECK (true);