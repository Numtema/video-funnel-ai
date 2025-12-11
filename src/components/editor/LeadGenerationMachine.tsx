import { useState } from 'react';
import { QuizConfig, QuizStep, StepType, MediaType } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sparkles,
  Target,
  Heart,
  Stethoscope,
  Lightbulb,
  Award,
  Clock,
  UserPlus,
  Sprout,
  TrendingUp,
  Loader2,
  Wand2,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Les 9 étapes de la Lead Generation Machine
const LGM_STEPS = [
  {
    id: 'attract',
    name: 'ATTRACT',
    label: 'Attirer',
    icon: Target,
    color: '#EF4444',
    description: 'Attirer l\'attention avec un hook puissant',
    stepType: StepType.Welcome,
    aiPrompt: 'Créer une accroche percutante pour attirer l\'attention',
  },
  {
    id: 'engage',
    name: 'ENGAGE',
    label: 'Engager',
    icon: Heart,
    color: '#F97316',
    description: 'Engager émotionnellement le prospect',
    stepType: StepType.Message,
    aiPrompt: 'Créer un message qui suscite l\'intérêt et l\'émotion',
  },
  {
    id: 'diagnose',
    name: 'DIAGNOSE',
    label: 'Diagnostiquer',
    icon: Stethoscope,
    color: '#EAB308',
    description: 'Poser des questions pour comprendre le besoin',
    stepType: StepType.Question,
    aiPrompt: 'Créer une question de diagnostic pour identifier le problème principal',
  },
  {
    id: 'solution',
    name: 'SOLUTION',
    label: 'Solutionner',
    icon: Lightbulb,
    color: '#84CC16',
    description: 'Présenter la solution idéale',
    stepType: StepType.Message,
    aiPrompt: 'Présenter comment la solution résout le problème identifié',
  },
  {
    id: 'proof',
    name: 'PROOF',
    label: 'Prouver',
    icon: Award,
    color: '#22C55E',
    description: 'Apporter des preuves et témoignages',
    stepType: StepType.Message,
    aiPrompt: 'Créer un message avec des preuves sociales et témoignages',
  },
  {
    id: 'urgency',
    name: 'URGENCY',
    label: 'Créer l\'urgence',
    icon: Clock,
    color: '#06B6D4',
    description: 'Créer un sentiment d\'urgence',
    stepType: StepType.Message,
    aiPrompt: 'Créer un message d\'urgence sans être agressif',
  },
  {
    id: 'capture',
    name: 'CAPTURE',
    label: 'Capturer',
    icon: UserPlus,
    color: '#3B82F6',
    description: 'Collecter les informations du lead',
    stepType: StepType.LeadCapture,
    aiPrompt: 'Créer un formulaire de capture avec une promesse de valeur',
  },
  {
    id: 'nurture',
    name: 'NURTURE',
    label: 'Nourrir',
    icon: Sprout,
    color: '#8B5CF6',
    description: 'Message de remerciement et prochaines étapes',
    stepType: StepType.Message,
    aiPrompt: 'Créer un message de remerciement et annoncer les prochaines étapes',
  },
  {
    id: 'convert',
    name: 'CONVERT',
    label: 'Convertir',
    icon: TrendingUp,
    color: '#EC4899',
    description: 'Call-to-action final pour conversion',
    stepType: StepType.Message,
    aiPrompt: 'Créer un CTA final avec offre spéciale pour les nouveaux inscrits',
  },
];

interface LeadGenerationMachineProps {
  onGenerate: (steps: QuizStep[]) => void;
  onClose?: () => void;
}

interface BusinessInfo {
  businessName: string;
  industry: string;
  targetAudience: string;
  mainProblem: string;
  solution: string;
  uniqueValue: string;
  offer: string;
}

export function LeadGenerationMachine({ onGenerate, onClose }: LeadGenerationMachineProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'info' | 'select' | 'generating' | 'preview'>('info');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedSteps, setGeneratedSteps] = useState<QuizStep[]>([]);
  const [selectedSteps, setSelectedSteps] = useState<string[]>(LGM_STEPS.map(s => s.id));
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: '',
    industry: '',
    targetAudience: '',
    mainProblem: '',
    solution: '',
    uniqueValue: '',
    offer: '',
  });

  const industries = [
    'Coaching / Formation',
    'E-commerce',
    'SaaS / Tech',
    'Immobilier',
    'Santé / Bien-être',
    'Finance / Assurance',
    'Marketing / Communication',
    'Consulting',
    'Agence web / Design',
    'Autre',
  ];

  const toggleStep = (stepId: string) => {
    setSelectedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const generateSteps = async () => {
    setGenerating(true);
    setProgress(0);
    setStep('generating');

    try {
      const stepsToGenerate = LGM_STEPS.filter(s => selectedSteps.includes(s.id));
      const generated: QuizStep[] = [];
      let currentProgress = 0;

      for (let i = 0; i < stepsToGenerate.length; i++) {
        const lgmStep = stepsToGenerate[i];
        currentProgress = Math.round(((i + 1) / stepsToGenerate.length) * 100);
        setProgress(currentProgress);

        // Build the AI prompt
        const prompt = buildPromptForStep(lgmStep, businessInfo);

        // Call AI to generate content
        const { data, error } = await supabase.functions.invoke('ai-gateway', {
          body: {
            action: 'lgm-step',
            prompt,
          },
        });

        if (error) throw error;

        const content = data?.content || {};
        const quizStep = createQuizStep(lgmStep, content, i);
        generated.push(quizStep);

        // Small delay for UX
        await new Promise(r => setTimeout(r, 300));
      }

      setGeneratedSteps(generated);
      setStep('preview');

      toast({
        title: 'Funnel généré !',
        description: `${generated.length} étapes créées avec la méthode LGM`,
      });
    } catch (error: any) {
      console.error('Error generating LGM steps:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de générer le funnel',
        variant: 'destructive',
      });
      setStep('select');
    } finally {
      setGenerating(false);
    }
  };

  const buildPromptForStep = (lgmStep: typeof LGM_STEPS[0], info: BusinessInfo): string => {
    return `Tu es un expert en marketing et génération de leads.

Contexte entreprise :
- Nom : ${info.businessName}
- Secteur : ${info.industry}
- Audience cible : ${info.targetAudience}
- Problème principal : ${info.mainProblem}
- Solution : ${info.solution}
- Valeur unique : ${info.uniqueValue}
- Offre : ${info.offer}

Étape LGM : ${lgmStep.name} - ${lgmStep.description}
Type d'étape : ${lgmStep.stepType}

Mission : ${lgmStep.aiPrompt}

Génère un contenu pour cette étape en JSON avec :
{
  "title": "Titre accrocheur (max 60 caractères)",
  "description": "Description engageante (max 150 caractères)",
  "buttonText": "Texte du bouton CTA (max 25 caractères)"${lgmStep.stepType === StepType.Question ? `,
  "options": [
    {"text": "Option 1", "score": 1},
    {"text": "Option 2", "score": 2},
    {"text": "Option 3", "score": 3}
  ]` : ''}${lgmStep.stepType === StepType.LeadCapture ? `,
  "fields": ["name", "email", "phone"]` : ''}
}

Réponds uniquement avec le JSON, sans explications.`;
  };

  const createQuizStep = (lgmStep: typeof LGM_STEPS[0], content: any, index: number): QuizStep => {
    const baseStep: QuizStep = {
      id: uuidv4(),
      type: lgmStep.stepType,
      title: content.title || `${lgmStep.label} - ${businessInfo.businessName}`,
      description: content.description || lgmStep.description,
      buttonText: content.buttonText || 'Continuer',
      media: {
        type: 'none' as MediaType,
        url: '',
      },
    };

    if (lgmStep.stepType === StepType.Question && content.options) {
      baseStep.options = content.options.map((opt: any, idx: number) => ({
        id: uuidv4(),
        text: opt.text,
        score: opt.score || idx + 1,
      }));
    }

    if (lgmStep.stepType === StepType.LeadCapture) {
      baseStep.fields = content.fields || ['name', 'email'];
    }

    return baseStep;
  };

  const handleConfirm = () => {
    onGenerate(generatedSteps);
    onClose?.();
  };

  // Step 1: Business Information
  if (step === 'info') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Lead Generation Machine</h2>
          <p className="text-muted-foreground mt-2">
            Générez un funnel de conversion optimisé en 9 étapes
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations sur votre entreprise</CardTitle>
            <CardDescription>
              Ces informations permettent à l'IA de personnaliser votre funnel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom de l'entreprise *</Label>
                <Input
                  value={businessInfo.businessName}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                  placeholder="Ex: MonCoaching Pro"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Secteur d'activité *</Label>
                <Select
                  value={businessInfo.industry}
                  onValueChange={(value) => setBusinessInfo({ ...businessInfo, industry: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Audience cible *</Label>
              <Input
                value={businessInfo.targetAudience}
                onChange={(e) => setBusinessInfo({ ...businessInfo, targetAudience: e.target.value })}
                placeholder="Ex: Entrepreneurs souhaitant développer leur activité en ligne"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Problème principal de votre audience *</Label>
              <Textarea
                value={businessInfo.mainProblem}
                onChange={(e) => setBusinessInfo({ ...businessInfo, mainProblem: e.target.value })}
                placeholder="Ex: Ils n'arrivent pas à générer des leads qualifiés de manière régulière"
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label>Votre solution *</Label>
              <Textarea
                value={businessInfo.solution}
                onChange={(e) => setBusinessInfo({ ...businessInfo, solution: e.target.value })}
                placeholder="Ex: Un système de funnels automatisés qui génère des leads 24h/24"
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label>Valeur unique (ce qui vous différencie)</Label>
              <Input
                value={businessInfo.uniqueValue}
                onChange={(e) => setBusinessInfo({ ...businessInfo, uniqueValue: e.target.value })}
                placeholder="Ex: 10 ans d'expérience, méthode éprouvée, 500+ clients"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Offre / Lead Magnet</Label>
              <Input
                value={businessInfo.offer}
                onChange={(e) => setBusinessInfo({ ...businessInfo, offer: e.target.value })}
                placeholder="Ex: E-book gratuit, Consultation offerte, Webinar..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
          )}
          <Button
            onClick={() => setStep('select')}
            disabled={
              !businessInfo.businessName ||
              !businessInfo.industry ||
              !businessInfo.targetAudience ||
              !businessInfo.mainProblem ||
              !businessInfo.solution
            }
          >
            Continuer
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Select steps
  if (step === 'select') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Sélectionnez les étapes</h2>
          <p className="text-muted-foreground mt-2">
            Choisissez les étapes à inclure dans votre funnel
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LGM_STEPS.map((lgmStep, index) => {
            const Icon = lgmStep.icon;
            const isSelected = selectedSteps.includes(lgmStep.id);

            return (
              <Card
                key={lgmStep.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary shadow-md'
                    : 'border-border hover:border-muted-foreground'
                }`}
                onClick={() => toggleStep(lgmStep.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleStep(lgmStep.id)}
                    />
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${lgmStep.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: lgmStep.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                        <span className="font-semibold text-sm">{lgmStep.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {lgmStep.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">Conseil</p>
              <p className="text-xs mt-1">
                Pour un funnel optimal, gardez les 9 étapes. Vous pourrez toujours modifier ou supprimer des étapes après la génération.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep('info')}>
            Retour
          </Button>
          <Button
            onClick={generateSteps}
            disabled={selectedSteps.length === 0}
          >
            Générer {selectedSteps.length} étapes
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Generating
  if (step === 'generating') {
    return (
      <div className="space-y-8 py-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Wand2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Génération en cours...</h2>
          <p className="text-muted-foreground mt-2">
            L'IA crée votre funnel Lead Generation Machine
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <Progress value={progress} className="h-2" />
          <p className="text-center text-sm text-muted-foreground">
            {progress}% - Génération des étapes...
          </p>
        </div>

        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Step 4: Preview
  if (step === 'preview') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Funnel généré !</h2>
          <p className="text-muted-foreground mt-2">
            Voici les {generatedSteps.length} étapes créées pour votre funnel
          </p>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {generatedSteps.map((step, index) => {
            const lgmStep = LGM_STEPS.find(
              (s) => selectedSteps[index] && s.id === selectedSteps[index]
            ) || LGM_STEPS[index];
            const Icon = lgmStep?.icon || Target;

            return (
              <Card key={step.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${lgmStep?.color || '#6366f1'}20` }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: lgmStep?.color || '#6366f1' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Étape {index + 1}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {step.type}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{step.title}</h4>
                      {step.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      )}
                      {step.options && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {step.options.map((opt) => (
                            <Badge key={opt.id} variant="outline" className="text-xs">
                              {opt.text}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep('select')}>
            Régénérer
          </Button>
          <Button onClick={handleConfirm}>
            Utiliser ce funnel
            <CheckCircle2 className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
