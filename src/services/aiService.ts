import { supabase } from '@/integrations/supabase/client';
import { QuizConfig } from '@/types/funnel';

export const aiService = {
  async generateFunnel(prompt: string, model: string = 'google/gemini-2.5-flash'): Promise<QuizConfig> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Increment AI usage counter
    const { error: usageError } = await supabase.rpc('increment_ai_usage', { 
      _user_id: user.id 
    });
    if (usageError) throw usageError;

    const { data, error } = await supabase.functions.invoke('ai-gateway', {
      body: { action: 'generate-funnel', prompt, model }
    });

    if (error) throw error;
    
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  },

  async suggestText(field: string, currentValue: string): Promise<string> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Increment AI usage counter
    const { error: usageError } = await supabase.rpc('increment_ai_usage', { 
      _user_id: user.id 
    });
    if (usageError) throw usageError;

    const { data, error } = await supabase.functions.invoke('ai-gateway', {
      body: { action: 'suggest-text', field, currentValue }
    });

    if (error) throw error;
    return data.choices[0].message.content;
  },

  async generateImage(prompt: string, model: string = 'google/gemini-2.5-flash-image-preview'): Promise<string> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Increment AI usage counter
    const { error: usageError } = await supabase.rpc('increment_ai_usage', { 
      _user_id: user.id 
    });
    if (usageError) throw usageError;

    const { data, error } = await supabase.functions.invoke('ai-gateway', {
      body: { action: 'generate-image', prompt, model }
    });

    if (error) throw error;
    
    // Handle different model response formats
    if (data.choices?.[0]?.message?.images?.[0]?.image_url?.url) {
      return data.choices[0].message.images[0].image_url.url;
    }
    
    throw new Error('Format de réponse invalide');
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