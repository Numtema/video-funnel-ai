-- Create function to get user email (requires service role or proper permissions)
CREATE OR REPLACE FUNCTION public.get_user_email_by_funnel(funnel_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  funnel_owner UUID;
BEGIN
  -- Get the funnel owner
  SELECT user_id INTO funnel_owner
  FROM funnels
  WHERE id = funnel_uuid;
  
  IF funnel_owner IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get the email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = funnel_owner;
  
  RETURN user_email;
END;
$$;