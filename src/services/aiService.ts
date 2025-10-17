import { supabase } from '@/integrations/supabase/client';
import { QuizConfig } from '@/types/funnel';

export const aiService = {
  async generateFunnel(prompt: string, model: string = 'google/gemini-2.5-flash'): Promise<QuizConfig> {
    const { data, error } = await supabase.functions.invoke('ai-gateway', {
      body: { action: 'generate-funnel', prompt, model }
    });

    if (error) throw error;
    
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  },

  async suggestText(field: string, currentValue: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('ai-gateway', {
      body: { action: 'suggest-text', field, currentValue }
    });

    if (error) throw error;
    return data.choices[0].message.content;
  },

  async generateImage(prompt: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('ai-gateway', {
      body: { action: 'generate-image', prompt }
    });

    if (error) throw error;
    
    const imageUrl = data.choices[0].message.images[0].image_url.url;
    return imageUrl;
  },

  async analyzeSubmissions(answers: Record<string, any>): Promise<{
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    keywords: string[];
    summary: string;
  }> {
    const { data, error } = await supabase.functions.invoke('ai-gateway', {
      body: { action: 'analyze-submissions', answers }
    });

    if (error) throw error;
    const content = JSON.parse(data.choices[0].message.content);
    return content;
  }
};