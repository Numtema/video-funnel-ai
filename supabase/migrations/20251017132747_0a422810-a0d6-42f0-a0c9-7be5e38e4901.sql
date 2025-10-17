-- Create template_categories table
CREATE TABLE IF NOT EXISTS public.template_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create funnel_templates table
CREATE TABLE IF NOT EXISTS public.funnel_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.template_categories(id),
  thumbnail_url TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create webhook_events table
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  last_retry_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Stripe fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;

-- Enable RLS on new tables
ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for template_categories (public read)
CREATE POLICY "Anyone can view template categories"
ON public.template_categories FOR SELECT
USING (true);

-- RLS policies for funnel_templates (public read active templates)
CREATE POLICY "Anyone can view active templates"
ON public.funnel_templates FOR SELECT
USING (is_active = true);

-- RLS policies for webhook_events (users can view their own funnel webhooks)
CREATE POLICY "Users can view their own funnel webhooks"
ON public.webhook_events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.funnels
    WHERE funnels.id = webhook_events.funnel_id
    AND funnels.user_id = auth.uid()
  )
);

-- Insert sample template categories
INSERT INTO public.template_categories (name, icon, display_order) VALUES
('Lead Generation', '📧', 1),
('E-commerce', '🛍️', 2),
('Event', '📅', 3),
('Quiz', '🎯', 4),
('Survey', '📊', 5)
ON CONFLICT DO NOTHING;

-- Insert sample templates (will need to reference category IDs)
INSERT INTO public.funnel_templates (name, description, category_id, config, is_active)
SELECT 
  'Lead Magnet Quiz',
  'Générez des leads qualifiés avec un quiz interactif',
  id,
  '{"steps": [{"id": "step-1", "type": 0, "title": "Découvrez votre profil", "buttonText": "Commencer", "media": {"type": "image", "url": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"}}, {"id": "step-2", "type": 1, "question": "Quel est votre objectif principal ?", "answerInput": {"type": "buttons"}, "options": [{"id": "opt-1", "text": "Augmenter mes ventes"}, {"id": "opt-2", "text": "Générer des leads"}], "media": {"type": "image", "url": "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg"}}, {"id": "step-3", "type": 3, "title": "Recevez votre guide gratuit", "subtitle": "Entrez vos informations", "namePlaceholder": "Nom complet", "emailPlaceholder": "Email", "phonePlaceholder": "Téléphone", "subscriptionText": "Je souhaite recevoir des conseils", "privacyPolicyUrl": "#", "buttonText": "Recevoir mon guide", "socialLinks": [], "media": {"type": "image", "url": "https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg"}}], "theme": {"font": "Poppins", "colors": {"background": "#F3F4F6", "primary": "#3B82F6", "accent": "#10B981", "text": "#1F2937", "buttonText": "#FFFFFF"}}}',
  true
FROM public.template_categories WHERE name = 'Lead Generation'
ON CONFLICT DO NOTHING;