import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log(`AI Gateway action: ${action}`);

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
                content: `Tu es un expert en marketing et funnels de conversion.
Génère un QuizConfig JSON complet basé sur la description utilisateur.

Structure attendue:
{
  "steps": [
    {
      "id": "step-1",
      "type": "welcome",
      "title": "Titre accrocheur",
      "description": "Description engageante",
      "media": { "type": "none", "url": "" }
    },
    // Ajoute 3-5 questions pertinentes avec type "question"
    // Chaque question doit avoir options avec text, score, nextStepId
    {
      "id": "lead-capture",
      "type": "lead_capture",
      "title": "Obtenez vos résultats",
      "fields": ["name", "email"],
      "media": { "type": "none", "url": "" }
    }
  ],
  "theme": {
    "font": "Poppins",
    "colors": {
      "background": "#D9CFC4",
      "primary": "#A97C7C",
      "accent": "#A11D1F",
      "text": "#374151",
      "buttonText": "#FFFFFF"
    }
  },
  "scoring": {
    "enabled": true,
    "threshold": 50
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
        response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [{ role: 'user', content: params.prompt }],
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
    console.log('AI Gateway response received');
    
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