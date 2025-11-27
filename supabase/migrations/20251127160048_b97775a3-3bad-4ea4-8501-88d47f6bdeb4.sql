-- Enable realtime for submissions table to track new leads
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;

-- Enable realtime for funnels table to track funnel updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.funnels;