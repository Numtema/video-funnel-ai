-- Table profiles (infos utilisateur étendues)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  max_funnels INTEGER DEFAULT 3,
  max_ai_generations_monthly INTEGER DEFAULT 50,
  current_month_ai_count INTEGER DEFAULT 0,
  ai_count_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table user_roles (séparée pour sécurité)
CREATE TYPE app_role AS ENUM ('admin', 'user');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

-- Fonction sécurisée pour vérifier rôles
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies pour profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
  
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies pour user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Trigger auto-création profil
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Table funnels
CREATE TABLE funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{"steps":[],"theme":{"font":"Poppins","colors":{"background":"#D9CFC4","primary":"#A97C7C","accent":"#A11D1F","text":"#374151","buttonText":"#FFFFFF"}}}',
  share_token TEXT UNIQUE NOT NULL,
  
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  
  total_views INTEGER DEFAULT 0,
  total_submissions INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT config_valid CHECK (jsonb_typeof(config) = 'object')
);

CREATE INDEX idx_funnels_user ON funnels(user_id);
CREATE INDEX idx_funnels_share_token ON funnels(share_token);
CREATE INDEX idx_funnels_deleted ON funnels(deleted_at) WHERE deleted_at IS NULL;

-- Table submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  subscribed BOOLEAN DEFAULT false,
  
  answers JSONB NOT NULL DEFAULT '{}',
  ai_analysis JSONB,
  score INTEGER,
  
  completion_time_seconds INTEGER,
  device TEXT,
  source TEXT,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_submissions_funnel ON submissions(funnel_id);
CREATE INDEX idx_submissions_email ON submissions(contact_email);
CREATE INDEX idx_submissions_created ON submissions(created_at DESC);

-- Table analytics_sessions
CREATE TABLE analytics_sessions (
  id TEXT PRIMARY KEY,
  funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE NOT NULL,
  
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  steps JSONB NOT NULL DEFAULT '[]',
  
  completed BOOLEAN DEFAULT false,
  submitted BOOLEAN DEFAULT false,
  score INTEGER,
  
  device TEXT,
  source TEXT,
  user_agent TEXT,
  ip_address INET
);

CREATE INDEX idx_sessions_funnel ON analytics_sessions(funnel_id);
CREATE INDEX idx_sessions_started ON analytics_sessions(started_at DESC);

-- Table media_assets
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  funnel_id UUID REFERENCES funnels(id) ON DELETE SET NULL,
  
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  ai_generated BOOLEAN DEFAULT false,
  ai_provider TEXT,
  ai_model TEXT,
  ai_prompt TEXT,
  
  size_bytes BIGINT,
  duration_seconds INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_media_user ON media_assets(user_id);
CREATE INDEX idx_media_funnel ON media_assets(funnel_id);
CREATE INDEX idx_media_ai_generated ON media_assets(ai_generated);

-- RLS Policies pour funnels
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own funnels" ON funnels
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read published funnels" ON funnels
  FOR SELECT USING (is_published = true AND is_active = true AND deleted_at IS NULL);

-- RLS Policies pour submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own funnel submissions" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM funnels
      WHERE funnels.id = submissions.funnel_id
      AND funnels.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can submit" ON submissions
  FOR INSERT WITH CHECK (true);

-- RLS Policies pour analytics_sessions
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can create sessions" ON analytics_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users view own funnel sessions" ON analytics_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM funnels
      WHERE funnels.id = analytics_sessions.funnel_id
      AND funnels.user_id = auth.uid()
    )
  );

-- RLS Policies pour media_assets
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own media" ON media_assets
  FOR ALL USING (auth.uid() = user_id);

-- Fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_funnel_views(funnel_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE funnels
  SET total_views = total_views + 1
  WHERE id = funnel_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fonction pour incrémenter les submissions
CREATE OR REPLACE FUNCTION increment_funnel_submissions(funnel_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE funnels
  SET total_submissions = total_submissions + 1
  WHERE id = funnel_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fonction pour incrémenter usage AI
CREATE OR REPLACE FUNCTION increment_ai_usage(user_id UUID)
RETURNS VOID AS $$
DECLARE
  current_reset_at TIMESTAMP WITH TIME ZONE;
  max_generations INTEGER;
  current_count INTEGER;
BEGIN
  SELECT ai_count_reset_at, max_ai_generations_monthly, current_month_ai_count
  INTO current_reset_at, max_generations, current_count
  FROM profiles
  WHERE id = user_id;

  IF current_reset_at < NOW() - INTERVAL '1 month' THEN
    UPDATE profiles
    SET current_month_ai_count = 1,
        ai_count_reset_at = NOW()
    WHERE id = user_id;
  ELSE
    IF current_count >= max_generations THEN
      RAISE EXCEPTION 'Limite mensuelle de générations IA atteinte';
    END IF;

    UPDATE profiles
    SET current_month_ai_count = current_month_ai_count + 1
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;