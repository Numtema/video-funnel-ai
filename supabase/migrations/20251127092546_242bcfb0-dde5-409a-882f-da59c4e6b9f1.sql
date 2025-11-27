-- Fix RLS policies for submissions table to allow users to view their funnel leads

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users view own funnel submissions" ON public.submissions;

-- Create new SELECT policy that properly checks funnel ownership
CREATE POLICY "Users can view submissions from their funnels"
ON public.submissions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.funnels
    WHERE funnels.id = submissions.funnel_id
    AND funnels.user_id = auth.uid()
  )
);

-- Ensure UPDATE policy exists for status changes
DROP POLICY IF EXISTS "Users can update submissions from their funnels" ON public.submissions;

CREATE POLICY "Users can update submissions from their funnels"
ON public.submissions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.funnels
    WHERE funnels.id = submissions.funnel_id
    AND funnels.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.funnels
    WHERE funnels.id = submissions.funnel_id
    AND funnels.user_id = auth.uid()
  )
);