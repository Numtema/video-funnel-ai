import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract and verify user from JWT
async function authenticateUser(req: Request): Promise<{ userId: string; error?: string }> {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { userId: '', error: 'Authorization header missing or invalid' };
  }

  const token = authHeader.replace('Bearer ', '');
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return { userId: '', error: 'Supabase configuration missing' };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.error('Auth error:', error?.message);
    return { userId: '', error: 'Invalid or expired token' };
  }

  return { userId: user.id };
}

// Check if user has available AI credits
async function checkAIQuota(userId: string): Promise<{ allowed: boolean; error?: string }> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return { allowed: false, error: 'Supabase configuration missing' };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get user's AI usage limits
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('current_month_ai_count, max_ai_generations_monthly, ai_count_reset_at')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    console.error('Profile fetch error:', error?.message);
    return { allowed: false, error: 'Could not verify AI quota' };
  }

  // Check if we need to reset the monthly count
  const resetDate = profile.ai_count_reset_at ? new Date(profile.ai_count_reset_at) : null;
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  if (!resetDate || resetDate < oneMonthAgo) {
    // Reset needed - will be handled by increment_ai_usage function
    return { allowed: true };
  }

  const currentCount = profile.current_month_ai_count || 0;
  const maxGenerations = profile.max_ai_generations_monthly || 50;

  if (currentCount >= maxGenerations) {
    return { allowed: false, error: 'Limite mensuelle de générations IA atteinte' };
  }

  return { allowed: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const { userId, error: authError } = await authenticateUser(req);
    
    if (authError || !userId) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: authError || 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check AI quota
    const { allowed, error: quotaError } = await checkAIQuota(userId);
    
    if (!allowed) {
      console.error('Quota check failed:', quotaError);
      return new Response(
        JSON.stringify({ error: quotaError || 'AI quota exceeded' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, ...params } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log(`AI Gateway action: ${action} for user: ${userId}`);

    let response;

    switch (action) {
      case 'generate-funnel': {
        console.log('Generating funnel with prompt:', params.prompt);
        response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: params.model || 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `Tu es un expert en marketing, psychologie et design pédagogique.
Génère un QuizConfig JSON complet et engageant basé sur la description utilisateur.

DIRECTIVES IMPORTANTES:
1. **Comprends l'objectif**: Analyse le prompt pour identifier l'audience cible et l'objectif du funnel
2. **Adapte la complexité**: Selon la description:
   - Funnel simple (quiz rapide, lead capture): 3-5 étapes
   - Funnel standard (qualification, diagnostic): 7-12 étapes
   - Funnel complexe (formation, évaluation détaillée): 15-30 étapes
   Utilise le nombre d'étapes nécessaire pour accomplir l'objectif décrit par l'utilisateur
3. **Crée un parcours captivant**: Conçois des étapes qui guident l'utilisateur. Commence par welcome, utilise des questions/messages variés, termine par lead_capture
4. **Contenu engageant**: Rédige des textes empathiques, clairs et motivants
5. **IDs uniques**: Assure-toi que TOUS les 'id' sont uniques ("step-1", "opt-1-1", etc.)
6. **Médias pertinents**: Pour chaque étape, fournis une URL valide et gratuite depuis Pexels (https://images.pexels.com/...) ou Pixabay qui correspond visuellement au contenu
7. **Design thématique**: Choisis une police Google Fonts et une palette de couleurs harmonieuse adaptée à l'ambiance du funnel

Structure attendue:
{
  "steps": [
    {
      "id": "step-1",
      "type": "welcome",
      "title": "Titre accrocheur et personnalisé",
      "description": "Description engageante qui capte l'attention",
      "media": { "type": "image", "url": "https://images.pexels.com/photos/XXXXX/..." }
    },
    {
      "id": "question-1",
      "type": "question",
      "title": "Question pertinente qui fait réfléchir",
      "media": { "type": "image", "url": "https://images.pexels.com/photos/XXXXX/..." },
      "options": [
        { "id": "opt-1-1", "text": "Option A", "score": 10 },
        { "id": "opt-1-2", "text": "Option B", "score": 5 }
      ]
    },
    // Ajoute autant de questions/messages que nécessaire pour atteindre l'objectif (jusqu'à 30 max)
    {
      "id": "lead-capture",
      "type": "lead_capture",
      "title": "Recevez vos résultats personnalisés",
      "description": "Entrez vos coordonnées pour découvrir votre profil",
      "fields": ["name", "email"],
      "media": { "type": "image", "url": "https://images.pexels.com/photos/XXXXX/..." }
    }
  ],
  "theme": {
    "font": "Poppins",
    "colors": {
      "background": "#F0F4F8",
      "primary": "#4A90E2",
      "accent": "#FF6B6B",
      "text": "#333333",
      "buttonText": "#FFFFFF"
    }
  },
  "scoring": {
    "enabled": true,
    "threshold": 30
  }
}

Réponds UNIQUEMENT avec du JSON valide, sans markdown ni commentaires.`
              },
              {
                role: 'user',
                content: params.prompt
              }
            ]
          })
        });
        break;
      }

      case 'suggest-text': {
        response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'Tu es un copywriter expert. Améliore le texte fourni pour le rendre plus engageant et persuasif. Réponds uniquement avec le texte amélioré, sans explication.'
              },
              {
                role: 'user',
                content: `Champ: ${params.field}\nTexte actuel: ${params.currentValue}\n\nAméliore ce texte.`
              }
            ]
          })
        });
        break;
      }

      case 'generate-image': {
        console.log('Generating image with prompt:', params.prompt);
        console.log('Using model:', params.model || 'google/gemini-2.5-flash-image-preview');
        
        const model = params.model || 'google/gemini-2.5-flash-image-preview';
        
        response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [{ 
              role: 'user', 
              content: params.prompt 
            }],
            modalities: ['image', 'text']
          })
        });
        break;
      }

      case 'analyze-submissions': {
        response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-pro',
            messages: [
              {
                role: 'system',
                content: `Analyse les réponses soumises et retourne un JSON avec:
{
  "sentiment": "Positive" | "Negative" | "Neutral",
  "keywords": ["mot1", "mot2", "mot3"],
  "summary": "Résumé en 1 phrase"
}

Réponds UNIQUEMENT avec du JSON valide.`
              },
              { role: 'user', content: JSON.stringify(params.answers) }
            ]
          })
        });
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI Gateway error (${response.status}):`, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez plus tard.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits AI épuisés. Rechargez votre compte.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${errorText}`);
    }

    const data = await response.json();
    console.log('AI Gateway response received for user:', userId);
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Gateway error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
