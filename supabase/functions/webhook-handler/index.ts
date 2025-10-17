import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendWebhook(url: string, payload: any, eventId: string, supabase: any) {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await supabase
        .from("webhook_events")
        .update({
          status: response.ok ? "sent" : "failed",
          response_code: response.status,
          response_body: await response.text(),
          sent_at: new Date().toISOString(),
          retry_count: retryCount,
        })
        .eq("id", eventId);

      if (response.ok) return true;
      
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
    } catch (error) {
      retryCount++;
      
      if (retryCount >= maxRetries) {
        await supabase
          .from("webhook_events")
          .update({
            status: "failed",
            response_body: error instanceof Error ? error.message : 'Unknown error',
            retry_count: retryCount,
          })
          .eq("id", eventId);
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
    }
  }

  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { funnelId, eventType, payload, webhookUrl } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Save event
    const { data: event } = await supabase
      .from("webhook_events")
      .insert({
        funnel_id: funnelId,
        event_type: eventType,
        payload,
        status: "pending",
      })
      .select()
      .single();

    if (!event) throw new Error("Failed to create webhook event");

    // Send webhook
    await sendWebhook(webhookUrl, payload, event.id, supabase);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
