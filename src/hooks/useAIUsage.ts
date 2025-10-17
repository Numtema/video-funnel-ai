import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useAIUsage() {
  const { user, profile } = useAuth();
  const [usage, setUsage] = useState({ current: 0, max: 0 });
  const [loading, setLoading] = useState(true);

  const loadUsage = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('current_month_ai_count, max_ai_generations_monthly')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setUsage({
        current: data.current_month_ai_count || 0,
        max: data.max_ai_generations_monthly || 50
      });
    } catch (error) {
      console.error('Error loading AI usage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsage();
  }, [user]);

  // Update from profile when it changes
  useEffect(() => {
    if (profile) {
      setUsage({
        current: profile.current_month_ai_count,
        max: profile.max_ai_generations_monthly
      });
    }
  }, [profile]);

  const canUseAI = usage.current < usage.max;
  const remaining = usage.max - usage.current;
  const percentage = usage.max > 0 ? (usage.current / usage.max) * 100 : 0;

  return { 
    usage, 
    canUseAI, 
    remaining, 
    percentage,
    loading,
    refresh: loadUsage 
  };
}
