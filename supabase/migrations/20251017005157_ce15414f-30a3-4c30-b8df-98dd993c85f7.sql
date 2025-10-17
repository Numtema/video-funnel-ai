-- Drop existing function first
DROP FUNCTION IF EXISTS increment_ai_usage(uuid);

-- Recreate with correct parameter name
CREATE OR REPLACE FUNCTION increment_ai_usage(_user_id UUID)
RETURNS VOID AS $$
DECLARE
  current_reset_at TIMESTAMP WITH TIME ZONE;
  max_generations INTEGER;
  current_count INTEGER;
BEGIN
  SELECT ai_count_reset_at, max_ai_generations_monthly, current_month_ai_count
  INTO current_reset_at, max_generations, current_count
  FROM profiles
  WHERE id = _user_id;

  IF current_reset_at < NOW() - INTERVAL '1 month' THEN
    UPDATE profiles
    SET current_month_ai_count = 1,
        ai_count_reset_at = NOW()
    WHERE id = _user_id;
  ELSE
    IF current_count >= max_generations THEN
      RAISE EXCEPTION 'Limite mensuelle de générations IA atteinte';
    END IF;

    UPDATE profiles
    SET current_month_ai_count = current_month_ai_count + 1
    WHERE id = _user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;