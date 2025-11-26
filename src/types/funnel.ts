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

export interface QuizStep {
  id: string;
  type: StepType;
  title: string;
  description?: string;
  media: MediaConfig;
  
  // Pour Question
  options?: QuestionOption[];
  
  // Pour LeadCapture
  fields?: string[];
  webhookUrl?: string;
  
  // Pour CalendarEmbed
  embedCode?: string;
  
  nextStepId?: string;
}

export interface ScoringConfig {
  enabled: boolean;
  threshold: number;
  highScoreStepId?: string;
  lowScoreStepId?: string;
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

export interface QuizConfig {
  steps: QuizStep[];
  theme: ThemeConfig;
  tracking?: {
    webhookUrl?: string;
  };
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
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  max_funnels: number;
  max_ai_generations_monthly: number;
  current_month_ai_count: number;
  ai_count_reset_at: string;
  created_at: string;
  updated_at: string;
}
