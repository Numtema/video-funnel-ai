import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  funnelId: string;
  funnelName: string;
  ownerEmail: string;
  contact: {
    name?: string;
    email: string;
    phone?: string;
  };
  score?: number;
  answers: Record<string, any>;
  completionTime: number;
  device?: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      funnelName,
      ownerEmail,
      contact,
      score,
      answers,
      completionTime,
      device,
      source,
    }: LeadNotificationRequest = await req.json();

    console.log('Sending lead notification to:', ownerEmail);

    // Format answers for email
    const answersHTML = Object.entries(answers)
      .map(([key, value]) => {
        const answerValue = typeof value === 'object' ? value.text || JSON.stringify(value) : value;
        return `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>${key}</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${answerValue}</td></tr>`;
      })
      .join('');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #A97C7C 0%, #A11D1F 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🎯 Nouveau Lead Capturé</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <div style="background-color: #D9CFC4; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 22px;">Funnel: ${funnelName}</h2>
                
                <!-- Contact Info -->
                <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                  <h3 style="color: #A11D1F; margin: 0 0 15px 0; font-size: 18px;">📧 Coordonnées</h3>
                  ${contact.name ? `<p style="margin: 8px 0; color: #374151;"><strong>Nom:</strong> ${contact.name}</p>` : ''}
                  <p style="margin: 8px 0; color: #374151;"><strong>Email:</strong> <a href="mailto:${contact.email}" style="color: #A11D1F; text-decoration: none;">${contact.email}</a></p>
                  ${contact.phone ? `<p style="margin: 8px 0; color: #374151;"><strong>Téléphone:</strong> <a href="tel:${contact.phone}" style="color: #A11D1F; text-decoration: none;">${contact.phone}</a></p>` : ''}
                </div>

                <!-- Analytics -->
                <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                  <h3 style="color: #A11D1F; margin: 0 0 15px 0; font-size: 18px;">📊 Analytique</h3>
                  ${score !== undefined ? `<p style="margin: 8px 0; color: #374151;"><strong>Score:</strong> ${score} points</p>` : ''}
                  <p style="margin: 8px 0; color: #374151;"><strong>Temps de complétion:</strong> ${Math.floor(completionTime / 60)}m ${completionTime % 60}s</p>
                  ${device ? `<p style="margin: 8px 0; color: #374151;"><strong>Appareil:</strong> ${device}</p>` : ''}
                  ${source ? `<p style="margin: 8px 0; color: #374151;"><strong>Source:</strong> ${source}</p>` : ''}
                </div>

                <!-- Answers -->
                ${Object.keys(answers).length > 0 ? `
                <div style="background-color: #ffffff; border-radius: 8px; padding: 20px;">
                  <h3 style="color: #A11D1F; margin: 0 0 15px 0; font-size: 18px;">💬 Réponses</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${answersHTML}
                  </table>
                </div>
                ` : ''}
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://lovable.app" style="display: inline-block; background-color: #A11D1F; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Voir dans le Dashboard</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Cette notification a été envoyée par <strong>Nümtema Face</strong>
              </p>
              <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                Powered by Nümtema AI Foundry
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using Resend API directly
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Nümtema Face <onboarding@resend.dev>",
        to: [ownerEmail],
        subject: `🎯 Nouveau lead: ${contact.name || contact.email} - ${funnelName}`,
        html: emailHTML,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error(`Resend API error: ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, emailResponse: emailResult }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-lead-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
