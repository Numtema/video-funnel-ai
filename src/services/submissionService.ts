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
    console.log('Starting submission process for funnel:', data.funnelId);
    
    // 1. Save submission
    const ip = await getClientIP();
    const device = getDeviceType();
    const source = getSource();
    
    console.log('Inserting submission with data:', {
      funnel_id: data.funnelId,
      session_id: data.sessionId,
      contact_email: data.contact.email,
      device,
      source
    });

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
        device,
        source,
        ip_address: ip,
        user_agent: navigator.userAgent,
        status: 'nouveau'
      })
      .select()
      .single();

    if (error) {
      console.error('Submission insert error:', error);
      throw error;
    }

    console.log('Submission created successfully:', submission.id);

    // 2. Increment funnel submissions counter
    await supabase.rpc('increment_funnel_submissions', {
      funnel_id: data.funnelId
    });

    // 3. Update analytics session (with error handling)
    try {
      await supabase
        .from('analytics_sessions')
        .update({
          completed: true,
          submitted: true,
          score: data.score,
          completed_at: new Date().toISOString()
        })
        .eq('id', data.sessionId);
    } catch (error) {
      console.error('Error updating analytics session:', error);
      // Continue even if analytics update fails
    }

    // 4. Get funnel name and config
    const { data: funnelData, error: funnelError } = await supabase
      .from('funnels')
      .select('name, config')
      .eq('id', data.funnelId)
      .single();

    if (funnelError) {
      console.error('Error fetching funnel:', funnelError);
    }

    // 5. Send email notification
    if (funnelData) {
      try {
        // Get owner email using RPC function
        const { data: ownerEmail, error: emailError } = await supabase
          .rpc('get_user_email_by_funnel', { 
            funnel_uuid: data.funnelId 
          });
          
        if (!emailError && ownerEmail) {
          console.log('Sending email notification to:', ownerEmail);
          
          await supabase.functions.invoke('send-lead-notification', {
            body: {
              funnelId: data.funnelId,
              funnelName: funnelData.name,
              ownerEmail: ownerEmail,
              contact: data.contact,
              score: data.score,
              answers: data.answers,
              completionTime: data.completionTime,
              device,
              source
            }
          });
          
          console.log('Email notification sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Continue even if email fails
      }

      // 6. Send webhook if configured
      const config = funnelData.config as any;
      if (config.tracking?.webhookUrl) {
        try {
          await supabase.functions.invoke('webhook-handler', {
            body: {
              funnelId: data.funnelId,
              eventType: 'funnel.submission',
              webhookUrl: config.tracking.webhookUrl,
              payload: {
                event: 'funnel.submission',
                funnel_id: data.funnelId,
                submission_id: submission.id,
                contact: data.contact,
                score: data.score,
                answers: data.answers,
                timestamp: new Date().toISOString()
              }
            }
          });
        } catch (webhookError) {
          console.error('Error sending webhook:', webhookError);
          // Continue even if webhook fails
        }
      }
    }

    return submission;
  }
};
