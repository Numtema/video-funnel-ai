export enum StepType {
  Welcome = 'welcome',
  Question = 'question',
  Message = 'message',
  LeadCapture = 'lead_capture',
  CalendarEmbed = 'calendar_embed'
}

export type MediaType = 'video' | 'image' | 'audio' | 'none';

export interface MediaConfig {
  type: MediaType;
  url: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  score?: number;
  nextStepId?: string;
}

// A/B Testing - Variante d'un step
export interface StepVariant {
  id: string;
  name: string;
  title?: string;
  description?: string;
  buttonText?: string;
  media?: MediaConfig;
  options?: QuestionOption[]; // Pour les questions
  weight: number; // Pourcentage de trafic (0-100)
  views: number;
  conversions: number;
}

export interface QuizStep {
  id: string;
  type: StepType;
  title: string;
  description?: string;
  media: MediaConfig;
  buttonText?: string;

  // Pour Question
  options?: QuestionOption[];

  // Pour LeadCapture
  fields?: string[];
  webhookUrl?: string;

  // Pour CalendarEmbed
  embedCode?: string;

  nextStepId?: string;

  // A/B Testing
  variants?: StepVariant[];
  abTestEnabled?: boolean;
}

// Routing avancé - Segment basé sur le score
export interface ScoreSegment {
  id: string;
  name: string;
  label: string; // Ex: "Débutant", "Intermédiaire", "Expert"
  minScore: number;
  maxScore: number;
  color: string;
  nextStepId?: string;
  redirectUrl?: string;
  redirectType?: 'website' | 'whatsapp' | 'messenger' | 'none';
  customMessage?: string;
}

export interface ScoringConfig {
  enabled: boolean;
  threshold: number;
  highScoreStepId?: string;
  lowScoreStepId?: string;
  // Routing avancé avec segments
  segments?: ScoreSegment[];
  showSegmentResult?: boolean; // Afficher le segment à l'utilisateur
}

export interface ThemeConfig {
  font: string;
  logo?: string;
  colors: {
    background: string;
    primary: string;
    accent: string;
    text: string;
    buttonText: string;
  };
}

// Integrations config
export interface CalendarIntegration {
  enabled: boolean;
  provider: 'calendly' | 'cal' | 'custom';
  url?: string;
}

export interface IntegrationsConfig {
  calendar?: CalendarIntegration;
  zapier?: { webhookUrl?: string };
  make?: { webhookUrl?: string };
  n8n?: { webhookUrl?: string };
}

// Tracking Pixels Configuration
export interface FacebookPixelConfig {
  enabled: boolean;
  pixelId?: string;
  trackPageView?: boolean;
  trackLead?: boolean;
  trackCompleteRegistration?: boolean;
  customEvents?: { name: string; params?: Record<string, string> }[];
}

export interface GoogleAnalyticsConfig {
  enabled: boolean;
  measurementId?: string; // GA4 format: G-XXXXXXXXXX
  trackPageView?: boolean;
  trackFormSubmit?: boolean;
  trackStepChange?: boolean;
}

export interface TikTokPixelConfig {
  enabled: boolean;
  pixelId?: string;
}

export interface TrackingConfig {
  facebookPixel?: FacebookPixelConfig;
  googleAnalytics?: GoogleAnalyticsConfig;
  tiktokPixel?: TikTokPixelConfig;
}

// i18n Configuration
export type SupportedLanguage = 'fr' | 'en' | 'es' | 'de' | 'pt' | 'it' | 'ar';

export interface TranslatedContent {
  title?: Record<SupportedLanguage, string>;
  description?: Record<SupportedLanguage, string>;
  buttonText?: Record<SupportedLanguage, string>;
  options?: Record<SupportedLanguage, string[]>;
}

export interface I18nConfig {
  enabled: boolean;
  defaultLanguage: SupportedLanguage;
  availableLanguages: SupportedLanguage[];
  autoDetect?: boolean;
}

export interface QuizConfig {
  steps: QuizStep[];
  theme: ThemeConfig;
  tracking?: {
    webhookUrl?: string;
  };
  trackingPixels?: TrackingConfig;
  i18n?: I18nConfig;
  scoring?: ScoringConfig;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  whatsapp?: {
    enabled: boolean;
    phoneNumber?: string;
    message?: string;
  };
  integrations?: IntegrationsConfig;
  redirectUrl?: string;
  redirectType?: 'website' | 'whatsapp' | 'messenger' | 'none';
}

export interface Funnel {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  config: QuizConfig;
  share_token: string;
  is_active: boolean;
  is_published: boolean;
  total_views: number;
  total_submissions: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  deleted_at?: string;
}

export interface AIAnalysisResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  keywords: string[];
  summary: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  company_name?: string;
  avatar_url?: string;
  phone?: string;
  website?: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  max_funnels: number;
  max_ai_generations_monthly: number;
  current_month_ai_count: number;
  ai_count_reset_at: string;
  created_at: string;
  updated_at: string;
}
