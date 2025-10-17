import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateCSV(data: any[]) {
  if (data.length === 0) return "";
  
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate, endDate, funnelIds, format } = await req.json();

    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Fetch user's funnels
    let funnelsQuery = supabase
      .from("funnels")
      .select("id, name")
      .eq("user_id", user.id);

    if (funnelIds && funnelIds.length > 0) {
      funnelsQuery = funnelsQuery.in("id", funnelIds);
    }

    const { data: funnels } = await funnelsQuery;
    if (!funnels || funnels.length === 0) throw new Error("No funnels found");

    const funnelIdsList = funnels.map(f => f.id);

    // Fetch submissions
    let submissionsQuery = supabase
      .from("submissions")
      .select("*")
      .in("funnel_id", funnelIdsList);

    if (startDate) {
      submissionsQuery = submissionsQuery.gte("created_at", startDate);
    }
    if (endDate) {
      submissionsQuery = submissionsQuery.lte("created_at", endDate);
    }

    const { data: submissions } = await submissionsQuery;

    // Fetch sessions
    let sessionsQuery = supabase
      .from("analytics_sessions")
      .select("*")
      .in("funnel_id", funnelIdsList);

    if (startDate) {
      sessionsQuery = sessionsQuery.gte("started_at", startDate);
    }
    if (endDate) {
      sessionsQuery = sessionsQuery.lte("started_at", endDate);
    }

    const { data: sessions } = await sessionsQuery;

    // Format data for export
    const exportData = submissions?.map(sub => {
      const funnel = funnels.find(f => f.id === sub.funnel_id);
      return {
        date: new Date(sub.created_at).toLocaleDateString('fr-FR'),
        funnel: funnel?.name || 'N/A',
        email: sub.contact_email || 'N/A',
        nom: sub.contact_name || 'N/A',
        telephone: sub.contact_phone || 'N/A',
        score: sub.score || 0,
        source: sub.source || 'direct',
        appareil: sub.device || 'N/A',
        temps_completion: sub.completion_time_seconds ? `${sub.completion_time_seconds}s` : 'N/A',
      };
    }) || [];

    if (format === 'csv') {
      const csv = generateCSV(exportData);
      const base64 = btoa(unescape(encodeURIComponent(csv)));
      
      return new Response(
        JSON.stringify({ data: base64, filename: `analytics_${Date.now()}.csv` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Format not supported yet" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Export error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
