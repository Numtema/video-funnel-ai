import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workbook } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("📊 Generating Lead Machine Funnel with workbook:", workbook);

    // System prompt suivant la méthodologie Lead Generation Machine
    const systemPrompt = `Tu es un expert en création de funnels Lead Generation Machine suivant la méthodologie en 9 étapes : ATTRACT, ENGAGE, DIAGNOSE, EMPATHIZE, CAPTURE, PRESCRIBE, TEACH, OFFER, NURTURE.

Tu dois générer un funnel complet avec des scripts vidéo personnalisés et engageants basés sur les informations fournies par l'utilisateur dans le workbook.

STRUCTURE DU FUNNEL À CRÉER :

1. WELCOME SCREEN (ATTRACT + ENGAGE) - Vidéo 30-60 secondes
   - Script "Get Attention" combinant : outcome + pain + empathy + authority
   - Doit accrocher l'attention et donner envie de faire le quiz
   - Format : Salutation + problème + empathie + autorité + call-to-action

2. QUESTIONS (DIAGNOSE) - 4-5 questions max, 15 secondes chacune
   - Questions simples et non intimidantes
   - Commencer facile, progresser vers plus spécifique
   - Chaque question doit apporter de la valeur diagnostique

3. EMPATHIZE MESSAGES - Vidéos courtes 15-30 secondes entre questions
   - Reconnaissance de la réponse précédente
   - Démontrer compréhension de leur situation
   - Transition naturelle vers la question suivante

4. LEAD CAPTURE (CAPTURE) - Vidéo 15-30 secondes
   - Rappeler la valeur des résultats personnalisés
   - Mentionner les bonus/guides en échange des coordonnées
   - Créer l'anticipation des résultats

5. OUTCOME SCREENS (PRESCRIBE + TEACH + OFFER) - Vidéo 4-6 minutes
   - PRESCRIBE (1 min) : Conseils personnalisés pour une petite victoire
   - TEACH (2-3 min) : Moment "Eurêka" avec Old Way vs New Way
   - OFFER (30 sec) : Présentation de l'offre de manière naturelle

FORMAT DE RÉPONSE ATTENDU :
Retourne un objet JSON avec :
{
  "name": "Nom du funnel",
  "description": "Description courte",
  "steps": [
    {
      "type": "welcome",
      "title": "Titre",
      "content": "Script vidéo complet Get Attention",
      "buttonText": "Commencer le Quiz"
    },
    {
      "type": "question",
      "title": "Question 1",
      "content": "Script d'intro de la question",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
    },
    {
      "type": "message",
      "title": "Empathie",
      "content": "Script de reconnaissance et empathie",
      "buttonText": "Continuer"
    },
    ... (répéter question + message pour 4-5 questions)
    {
      "type": "leadCapture",
      "title": "Vos Résultats Personnalisés",
      "content": "Script de capture avec valeur"
    },
    {
      "type": "message",
      "title": "Votre Stratégie Personnalisée",
      "content": "Script complet PRESCRIBE + TEACH + OFFER (4-6 minutes)"
    }
  ]
}

RÈGLES IMPORTANTES :
- Scripts en français naturel et conversationnel
- Ton authentique et personnel (tutoiement)
- Utiliser "je" et "vous" pour créer la connexion
- Intégrer les éléments du workbook de manière organique
- Transitions fluides entre les étapes
- Call-to-action clairs et motivants
- Scripts prêts à être lus en vidéo face caméra`;

    // Préparer le prompt utilisateur avec tout le workbook
    const userPrompt = `Crée un funnel Lead Generation Machine complet avec des scripts vidéo personnalisés basés sur ces informations :

CONTEXTE BUSINESS :
- Type de business : ${workbook.businessContext.businessType}
- Audience cible : ${workbook.businessContext.targetAudience}
- Offre principale : ${workbook.businessContext.mainOffer}
- Prix : ${workbook.businessContext.pricePoint}

HOOK ATTENTION :
- Situation actuelle (Pain) : ${workbook.hookAttention.avatarCurrentSituation}
- Situation désirée (Outcome) : ${workbook.hookAttention.avatarDesiredSituation}
- Blockers : ${workbook.hookAttention.blockers.join(", ")}
- Concept du quiz : ${workbook.hookAttention.quizConcept}

BUILD TRUST :
- Dream Outcome : ${workbook.buildTrust.outcome}
- Pain : ${workbook.buildTrust.pain}
- Empathy : ${workbook.buildTrust.empathy}
- Authority : ${workbook.buildTrust.authority}

SHIFT BELIEFS :
- Old Way : ${workbook.shiftBeliefs.oldWay}
- New Way : ${workbook.shiftBeliefs.newWay}
- Cost of Old Way : ${workbook.shiftBeliefs.costOfOldWay}
- Benefit of New Way : ${workbook.shiftBeliefs.benefitOfNewWay}

MAKE AN OFFER :
- Dream Outcome : ${workbook.makeOffer.dreamOutcome}
- Perceived Likelihood : ${workbook.makeOffer.perceivedLikelihood}
- Time Delay : ${workbook.makeOffer.timeDelay}
- Effort & Sacrifice : ${workbook.makeOffer.effortAndSacrifice}

Génère maintenant le funnel complet avec tous les scripts vidéo personnalisés et engageants.`;

    console.log("🤖 Calling Lovable AI to generate funnel...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8, // Plus créatif pour les scripts
        max_tokens: 8000, // Scripts longs nécessaires
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log("✅ AI response received:", generatedContent.substring(0, 200) + "...");

    // Parser la réponse JSON
    let funnelData;
    try {
      // Extraire le JSON de la réponse (peut être enveloppé dans des markdown code blocks)
      const jsonMatch = generatedContent.match(/```json\n([\s\S]*?)\n```/) || 
                       generatedContent.match(/```\n([\s\S]*?)\n```/) ||
                       [null, generatedContent];
      
      funnelData = JSON.parse(jsonMatch[1] || generatedContent);
      console.log("✅ Funnel data parsed successfully");
    } catch (parseError) {
      console.error("❌ Failed to parse AI response:", parseError);
      throw new Error("Failed to parse AI-generated funnel data");
    }

    // Construire la config complète du funnel
    const config = {
      steps: funnelData.steps.map((step: any, index: number) => ({
        id: `step-${index + 1}`,
        type: step.type,
        title: step.title,
        content: step.content,
        media: {
          type: step.type === "welcome" ? "video" : undefined,
          url: ""
        },
        buttonText: step.buttonText || "Continuer",
        options: step.options || [],
        nextStepId: index < funnelData.steps.length - 1 ? `step-${index + 2}` : undefined
      })),
      theme: {
        colors: {
          primary: "#A97C7C",
          accent: "#A11D1F",
          background: "#D9CFC4",
          text: "#374151",
          buttonText: "#FFFFFF"
        },
        font: "Poppins"
      },
      settings: {
        progressBar: true,
        backButton: true,
        collectEmails: true,
        requirePhone: false
      },
      tracking: {
        webhookUrl: ""
      }
    };

    console.log("✅ Lead Machine Funnel generated successfully");

    return new Response(
      JSON.stringify({ 
        name: funnelData.name,
        description: funnelData.description,
        config 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("❌ Error in generate-lead-machine-funnel:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
