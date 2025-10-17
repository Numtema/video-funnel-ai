import { supabase } from '@/integrations/supabase/client';

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

async function sendWebhook(url: string, payload: any): Promise<void> {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Webhook error:', error);
  }
}

export const submissionService = {
  async submit(data: {
    funnelId: string;
    sessionId: string;
    answers: Record<string, any>;
    contact: {
      name?: string;
      email?: string;
      phone?: string;
      subscribed: boolean;
    };
    score?: number;
    completionTime: number;
  }) {
    // 1. Save submission
    const ip = await getClientIP();
    
    const { data: submission, error } = await supabase
      .from('submissions')
      .insert({
        funnel_id: data.funnelId,
        session_id: data.sessionId,
        contact_name: data.contact.name,
        contact_email: data.contact.email,
        contact_phone: data.contact.phone,
        subscribed: data.contact.subscribed,
        answers: data.answers,
        score: data.score,
        completion_time_seconds: data.completionTime,
        device: getDeviceType(),
        source: getSource(),
        ip_address: ip,
        user_agent: navigator.userAgent
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Increment funnel submissions counter
    await supabase.rpc('increment_funnel_submissions', {
      funnel_id: data.funnelId
    });

    // 3. Update analytics session
    await supabase
      .from('analytics_sessions')
      .update({
        completed: true,
        submitted: true,
        score: data.score,
        completed_at: new Date().toISOString()
      })
      .eq('id', data.sessionId);

    // 4. Send webhook if configured
    const { data: funnel } = await supabase
      .from('funnels')
      .select('config')
      .eq('id', data.funnelId)
      .single();

    if (funnel?.config) {
      const config = funnel.config as any;
      if (config.tracking?.webhookUrl) {
        await sendWebhook(config.tracking.webhookUrl, {
          event: 'funnel.submission',
          funnel_id: data.funnelId,
          submission_id: submission.id,
          contact: data.contact,
          score: data.score,
          answers: data.answers,
          timestamp: new Date().toISOString()
        });
      }
    }

    return submission;
  }
};
