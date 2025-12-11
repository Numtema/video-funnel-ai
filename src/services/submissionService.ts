import { supabase } from '@/integrations/supabase/client';
import { sanitizeData } from '@/lib/sanitize';

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
    console.log('🔵🔵🔵 SUBMISSION SERVICE STARTED 🔵🔵🔵');
    console.log('📋 Funnel ID:', data.funnelId);
    console.log('📋 Session ID:', data.sessionId);
    console.log('📋 Contact Email:', data.contact.email);
    console.log('📋 Answers count:', Object.keys(data.answers).length);
    
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

    console.log('📤 About to insert submission into database...');
    
    // Sanitize answers to remove circular references
    const sanitizedAnswers = sanitizeData(data.answers);
    console.log('🧹 Answers sanitized for database insertion');
    
    // Use insert without .select() to avoid RLS SELECT policy issues for anonymous users
    // The INSERT policy allows anonymous submissions, but SELECT requires authentication
    const { error } = await supabase
      .from('submissions')
      .insert({
        funnel_id: data.funnelId,
        session_id: data.sessionId,
        contact_name: data.contact.name,
        contact_email: data.contact.email,
        contact_phone: data.contact.phone,
        subscribed: data.contact.subscribed,
        answers: sanitizedAnswers,
        score: data.score,
        completion_time_seconds: data.completionTime,
        device,
        source,
        ip_address: ip,
        user_agent: navigator.userAgent,
        status: 'nouveau'
      });
    
    // Create a mock submission object for the rest of the flow
    const submission = {
      id: data.sessionId, // Use session ID as a reference
      funnel_id: data.funnelId,
      session_id: data.sessionId,
      contact_email: data.contact.email
    };

    if (error) {
      console.error('❌❌❌ SUBMISSION INSERT ERROR ❌❌❌');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      throw error;
    }

    console.log('✅✅✅ SUBMISSION CREATED SUCCESSFULLY ✅✅✅');
    console.log('Submission ID:', submission.id);
    console.log('Full submission:', submission);

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
        console.log('📧 Getting funnel owner email for notification...');
        
        // Get owner email using RPC function
        const { data: ownerEmail, error: emailError } = await supabase
          .rpc('get_user_email_by_funnel', { 
            funnel_uuid: data.funnelId 
          });
          
        if (emailError) {
          console.error('❌ Error getting owner email:', emailError);
        } else if (!ownerEmail) {
          console.warn('⚠️ No owner email found for funnel:', data.funnelId);
        } else {
          console.log('📧 Owner email found:', ownerEmail, '- Sending notification...');
          
          const emailPayload = {
            funnelId: data.funnelId,
            funnelName: funnelData.name,
            ownerEmail: ownerEmail,
            contact: data.contact,
            score: data.score,
            answers: data.answers,
            completionTime: data.completionTime,
            device,
            source
          };
          
          console.log('📧 Email payload prepared:', {
            funnelName: emailPayload.funnelName,
            ownerEmail: emailPayload.ownerEmail,
            contactEmail: emailPayload.contact.email
          });
          
          const { data: emailResult, error: invokeError } = await supabase.functions.invoke(
            'send-lead-notification',
            { body: emailPayload }
          );
          
          if (invokeError) {
            console.error('❌ Error invoking email function:', invokeError);
          } else {
            console.log('✅ Email notification sent successfully:', emailResult);
          }
        }
      } catch (emailError: any) {
        console.error('❌ Error in email notification process:', {
          message: emailError.message,
          details: emailError
        });
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
