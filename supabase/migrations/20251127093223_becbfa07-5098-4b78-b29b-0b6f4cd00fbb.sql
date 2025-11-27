-- Ensure public users can submit leads anonymously
-- Drop and recreate INSERT policy to ensure it works correctly

DROP POLICY IF EXISTS "Public can submit" ON public.submissions;

CREATE POLICY "Public can submit"
ON public.submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Also ensure public users can create analytics sessions
DROP POLICY IF EXISTS "Public can create sessions" ON public.analytics_sessions;

CREATE POLICY "Public can create sessions"
ON public.analytics_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update own session" ON public.analytics_sessions;

CREATE POLICY "Public can update own session"
ON public.analytics_sessions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);