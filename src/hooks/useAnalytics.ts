import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StepVisit {
  stepId: string;
  stepType: string;
  enteredAt: number;
  leftAt?: number;
  timeSpent?: number;
  answered?: boolean;
  answer?: any;
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function getSource(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('utm_source') || params.get('source') || 'direct';
}

async function getClientIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return null;
  }
}

export function useAnalytics(funnelId: string) {
  const [sessionId] = useState(() => generateSessionId());
  const [steps, setSteps] = useState<StepVisit[]>([]);
  const [sessionCreated, setSessionCreated] = useState(false);

  const createSession = async () => {
    if (sessionCreated || !funnelId) return;
    
    try {
      const ip = await getClientIP();
      
      await supabase.from('analytics_sessions').insert({
        id: sessionId,
        funnel_id: funnelId,
        started_at: new Date().toISOString(),
        steps: [] as any,
        completed: false,
        device: getDeviceType(),
        source: getSource(),
        user_agent: navigator.userAgent,
        ip_address: ip
      });
      
      setSessionCreated(true);
    } catch (error) {
      console.error('Error creating analytics session:', error);
    }
  };

  const trackStepEnter = (stepId: string, stepType: string) => {
    // ALWAYS create session on first step
    if (!sessionCreated) {
      console.log('📊 Creating analytics session for funnel:', funnelId);
      createSession();
    }
    
    const visit: StepVisit = {
      stepId,
      stepType,
      enteredAt: Date.now()
    };
    setSteps(prev => [...prev, visit]);
    console.log('📍 Step entered:', { stepId, stepType });
  };

  const trackStepLeave = (stepId: string, answered: boolean, answer?: any) => {
    setSteps(prev => {
      const updated = [...prev];
      const lastVisit = updated.find(v => v.stepId === stepId && !v.leftAt);
      if (lastVisit) {
        lastVisit.leftAt = Date.now();
        lastVisit.timeSpent = lastVisit.leftAt - lastVisit.enteredAt;
        lastVisit.answered = answered;
        lastVisit.answer = answer;
      }
      return updated;
    });
  };

  const saveSession = async (completed: boolean, score?: number) => {
    try {
      await supabase.from('analytics_sessions').update({
        completed_at: completed ? new Date().toISOString() : null,
        steps: steps as any,
        completed,
        submitted: completed,
        score
      }).eq('id', sessionId);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  return { sessionId, trackStepEnter, trackStepLeave, saveSession };
}
