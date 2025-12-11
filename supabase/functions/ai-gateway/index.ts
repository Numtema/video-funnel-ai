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
      throw new Error('AI_API_KEY not configured');
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
                content: `Tu es un expert en marketing digital, copywriting et psychologie de conversion. Tu crées des funnels qui convertissent vraiment.

## TON RÔLE
Génère un funnel complet et ultra-optimisé basé sur la description de l'utilisateur. Chaque élément doit être pensé pour maximiser l'engagement et la conversion.

## MÉTHODOLOGIE DE CRÉATION

### 1. ANALYSE DU CONTEXTE
- Identifie l'audience cible et ses douleurs
- Comprends l'objectif final (leads, ventes, RDV, etc.)
- Adapte le ton et le vocabulaire à l'audience

### 2. STRUCTURE OPTIMALE DU FUNNEL
Suis cette structure éprouvée :

**ÉTAPE 1 - WELCOME (Hook)**
- Titre accrocheur qui parle directement au problème
- Description qui crée l'intrigue et promet une solution
- Call-to-action qui donne envie de commencer

**ÉTAPES 2-6 - QUESTIONS (Diagnostic)**
- Questions progressives : du général au spécifique
- 4-6 questions maximum pour ne pas fatiguer
- Chaque question doit apporter de la valeur (micro-insights)
- Options de réponse claires et sans jugement
- Scores pour segmenter les profils

**ÉTAPES INTERMÉDIAIRES - MESSAGES (Empathie)**
- Messages de validation entre les questions
- Montrent que tu comprends leur situation
- Créent de l'anticipation pour les résultats

**AVANT-DERNIÈRE ÉTAPE - LEAD CAPTURE**
- Rappelle la valeur des résultats personnalisés
- Demande email obligatoire, téléphone optionnel
- Promesse claire de ce qu'ils vont recevoir

**DERNIÈRE ÉTAPE - RÉSULTAT/MESSAGE FINAL**
- Remerciement et récap des insights
- Prochaine étape claire (RDV, offre, contenu)

### 3. COPYWRITING QUI CONVERTIT
- Tutoiement ou vouvoiement selon l'audience
- Phrases courtes et impactantes
- Verbes d'action
- Bénéfices > Caractéristiques
- Urgence subtile sans être agressif

### 4. RÈGLES TECHNIQUES
- IDs uniques : "welcome-1", "question-1", "opt-1-1", etc.
- Types disponibles : "welcome", "question", "message", "lead_capture", "calendar_embed"
- Pour les questions : 2-4 options avec scores de 0-10
- Media : utilise des images Pexels pertinentes (https://images.pexels.com/photos/XXXXX/pexels-photo-XXXXX.jpeg)

## FORMAT JSON ATTENDU
{
  "steps": [
    {
      "id": "welcome-1",
      "type": "welcome",
      "title": "Titre hook puissant qui interpelle",
      "description": "Description qui crée l'intrigue et promet une transformation",
      "media": { "type": "image", "url": "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" }
    },
    {
      "id": "question-1",
      "type": "question",
      "title": "Question engageante qui qualifie",
      "description": "Contexte optionnel pour aider à répondre",
      "media": { "type": "image", "url": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" },
      "options": [
        { "id": "q1-opt-1", "text": "Option claire et spécifique", "score": 10 },
        { "id": "q1-opt-2", "text": "Autre option pertinente", "score": 7 },
        { "id": "q1-opt-3", "text": "Troisième possibilité", "score": 4 },
        { "id": "q1-opt-4", "text": "Option par défaut", "score": 1 }
      ]
    },
    {
      "id": "message-1",
      "type": "message",
      "title": "Super ! Tu es sur la bonne voie",
      "description": "Message d'empathie qui valide leur réponse et crée de l'anticipation",
      "media": { "type": "image", "url": "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg" }
    },
    {
      "id": "lead-capture-1",
      "type": "lead_capture",
      "title": "Tes résultats personnalisés t'attendent !",
      "description": "Entre ton email pour recevoir ton analyse complète et des conseils adaptés à ton profil",
      "fields": ["name", "email", "phone"],
      "media": { "type": "image", "url": "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg" }
    },
    {
      "id": "result-1",
      "type": "message",
      "title": "Merci ! Voici ta prochaine étape",
      "description": "Message de conclusion avec call-to-action final",
      "media": { "type": "image", "url": "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg" }
    }
  ],
  "theme": {
    "font": "Inter",
    "colors": {
      "background": "#FAFAFA",
      "primary": "#6366F1",
      "accent": "#EC4899",
      "text": "#1F2937",
      "buttonText": "#FFFFFF"
    }
  },
  "scoring": {
    "enabled": true,
    "threshold": 25
  }
}

## IMPORTANT
- Génère entre 6 et 15 étapes selon la complexité demandée
- Alterne intelligemment questions et messages d'empathie
- Le contenu doit être en FRANÇAIS
- Réponds UNIQUEMENT avec du JSON valide
- PAS de markdown, PAS de commentaires, PAS d'explications`
              },
              {
                role: 'user',
                content: params.prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 6000
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

      case 'lgm-step': {
        console.log('Generating LGM step with prompt:', params.prompt);
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
                content: 'Tu es un expert en marketing et génération de leads. Réponds uniquement avec du JSON valide, sans markdown ni explications.'
              },
              {
                role: 'user',
                content: params.prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`LGM step generation error (${response.status}):`, errorText);
          throw new Error(`AI Gateway error: ${errorText}`);
        }

        const lgmData = await response.json();
        let content = lgmData.choices?.[0]?.message?.content || '{}';
        
        // Remove markdown code blocks if present
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        try {
          const parsedContent = JSON.parse(content);
          return new Response(
            JSON.stringify({ content: parsedContent }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (parseError) {
          console.error('Failed to parse LGM response:', content);
          return new Response(
            JSON.stringify({ content: { title: 'Étape générée', description: content, buttonText: 'Continuer' } }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
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
