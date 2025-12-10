import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { funnelService } from '@/services/funnelService';
import { aiService } from '@/services/aiService';
import { QuizConfig, QuizStep, StepType } from '@/types/funnel';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Loader2,
  Wand2,
  Eye,
  Edit3,
  Check,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  HelpCircle,
  User,
  Calendar,
  Palette,
  Settings2,
  Zap,
  Target,
  Users,
  Briefcase,
  Heart,
  GraduationCap,
  ShoppingBag,
  Dumbbell,
  Home,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Save,
  Play
} from 'lucide-react';

interface AIFunnelGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type GenerationStep = 'prompt' | 'config' | 'generating' | 'preview' | 'customize';

const INDUSTRIES = [
  { id: 'coaching', label: 'Coaching', icon: Target },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag },
  { id: 'saas', label: 'SaaS / Tech', icon: Zap },
  { id: 'health', label: 'Santé / Bien-être', icon: Heart },
  { id: 'education', label: 'Formation', icon: GraduationCap },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'real-estate', label: 'Immobilier', icon: Home },
  { id: 'consulting', label: 'Consulting', icon: Briefcase },
  { id: 'other', label: 'Autre', icon: Lightbulb },
];

const FUNNEL_GOALS = [
  { id: 'lead-capture', label: 'Capturer des leads', description: 'Collecter emails et contacts' },
  { id: 'qualify', label: 'Qualifier des prospects', description: 'Filtrer les meilleurs leads' },
  { id: 'educate', label: 'Éduquer / Informer', description: 'Partager des connaissances' },
  { id: 'sell', label: 'Vendre un produit/service', description: 'Convertir en clients' },
  { id: 'book', label: 'Prendre des RDV', description: 'Remplir votre agenda' },
  { id: 'survey', label: 'Sondage / Feedback', description: 'Collecter des avis' },
];

const TONE_OPTIONS = [
  { id: 'professional', label: 'Professionnel' },
  { id: 'friendly', label: 'Amical et décontracté' },
  { id: 'inspiring', label: 'Inspirant et motivant' },
  { id: 'urgent', label: 'Urgent et persuasif' },
  { id: 'educational', label: 'Éducatif et pédagogue' },
];

const THEME_PRESETS = [
  { id: 'elegant', name: 'Élégant', colors: { background: '#D9CFC4', primary: '#A97C7C', accent: '#A11D1F', text: '#374151', buttonText: '#FFFFFF' } },
  { id: 'modern', name: 'Moderne', colors: { background: '#F8FAFC', primary: '#3B82F6', accent: '#8B5CF6', text: '#1E293B', buttonText: '#FFFFFF' } },
  { id: 'nature', name: 'Nature', colors: { background: '#ECFDF5', primary: '#059669', accent: '#10B981', text: '#064E3B', buttonText: '#FFFFFF' } },
  { id: 'sunset', name: 'Coucher de soleil', colors: { background: '#FFF7ED', primary: '#EA580C', accent: '#F97316', text: '#7C2D12', buttonText: '#FFFFFF' } },
  { id: 'ocean', name: 'Océan', colors: { background: '#F0F9FF', primary: '#0284C7', accent: '#06B6D4', text: '#0C4A6E', buttonText: '#FFFFFF' } },
  { id: 'dark', name: 'Sombre', colors: { background: '#1F2937', primary: '#6366F1', accent: '#A855F7', text: '#F9FAFB', buttonText: '#FFFFFF' } },
];

const PROMPT_EXAMPLES = [
  "Quiz pour qualifier les prospects intéressés par mon programme de coaching en développement personnel. Mon offre est un accompagnement de 3 mois à 2000€.",
  "Funnel de génération de leads pour mon agence immobilière. Je veux comprendre les besoins d'achat ou de location de mes visiteurs.",
  "Sondage interactif pour ma boutique e-commerce de cosmétiques bio. Je veux recommander des produits personnalisés.",
  "Quiz d'évaluation pour mon école de langues. Je veux déterminer le niveau des apprenants et leur proposer la bonne formation.",
];

const AIFunnelGenerator = ({ open, onOpenChange }: AIFunnelGeneratorProps) => {
  const [step, setStep] = useState<GenerationStep>('prompt');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Prompt & Config
  const [prompt, setPrompt] = useState('');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('');
  const [tone, setTone] = useState('professional');
  const [stepCount, setStepCount] = useState([8]);
  const [includeWelcome, setIncludeWelcome] = useState(true);
  const [includeLeadCapture, setIncludeLeadCapture] = useState(true);
  const [includeCalendar, setIncludeCalendar] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(THEME_PRESETS[0]);
  const [aiModel, setAiModel] = useState('google/gemini-2.5-flash');

  // Generated funnel
  const [generatedConfig, setGeneratedConfig] = useState<QuizConfig | null>(null);
  const [funnelName, setFunnelName] = useState('');
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);

  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  const buildEnhancedPrompt = () => {
    const industryInfo = INDUSTRIES.find(i => i.id === industry);
    const goalInfo = FUNNEL_GOALS.find(g => g.id === goal);
    const toneInfo = TONE_OPTIONS.find(t => t.id === tone);

    let enhancedPrompt = prompt;

    if (industryInfo) {
      enhancedPrompt += `\n\nIndustrie/Secteur: ${industryInfo.label}`;
    }
    if (goalInfo) {
      enhancedPrompt += `\nObjectif principal: ${goalInfo.label} - ${goalInfo.description}`;
    }
    if (toneInfo) {
      enhancedPrompt += `\nTon souhaité: ${toneInfo.label}`;
    }

    enhancedPrompt += `\n\nConfiguration requise:`;
    enhancedPrompt += `\n- Nombre d'étapes souhaité: environ ${stepCount[0]} étapes`;
    enhancedPrompt += `\n- ${includeWelcome ? 'Inclure' : 'Ne pas inclure'} une page d'accueil engageante`;
    enhancedPrompt += `\n- ${includeLeadCapture ? 'Inclure' : 'Ne pas inclure'} une étape de capture de leads`;
    enhancedPrompt += `\n- ${includeCalendar ? 'Inclure' : 'Ne pas inclure'} une intégration calendrier`;

    return enhancedPrompt;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez décrire votre funnel");
      return;
    }

    try {
      setLoading(true);
      setStep('generating');

      const enhancedPrompt = buildEnhancedPrompt();
      const config = await aiService.generateFunnel(enhancedPrompt, aiModel);

      // Apply selected theme
      config.theme = {
        ...config.theme,
        colors: selectedTheme.colors,
      };

      setGeneratedConfig(config);
      setFunnelName(`Funnel ${new Date().toLocaleDateString('fr-FR')}`);
      setProgress(100);

      setTimeout(() => {
        setStep('preview');
        setLoading(false);
      }, 500);

    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la génération");
      setStep('prompt');
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    await handleGenerate();
  };

  const handleSave = async () => {
    if (!generatedConfig || !funnelName.trim()) {
      toast.error("Donnez un nom à votre funnel");
      return;
    }

    try {
      setLoading(true);

      const funnel = await funnelService.create({
        name: funnelName,
        description: prompt.substring(0, 200),
        config: generatedConfig,
      });

      toast.success("Funnel créé avec succès !");
      onOpenChange(false);
      handleReset();
      navigate(`/funnels/${funnel.id}/edit`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('prompt');
    setPrompt('');
    setIndustry('');
    setGoal('');
    setTone('professional');
    setStepCount([8]);
    setIncludeWelcome(true);
    setIncludeLeadCapture(true);
    setIncludeCalendar(false);
    setSelectedTheme(THEME_PRESETS[0]);
    setGeneratedConfig(null);
    setFunnelName('');
    setEditingStepIndex(null);
    setProgress(0);
  };

  const updateStep = (index: number, updates: Partial<QuizStep>) => {
    if (!generatedConfig) return;

    const newSteps = [...generatedConfig.steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setGeneratedConfig({ ...generatedConfig, steps: newSteps });
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'welcome': return <Play className="h-4 w-4" />;
      case 'question': return <HelpCircle className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'lead_capture': return <User className="h-4 w-4" />;
      case 'calendar_embed': return <Calendar className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getStepTypeName = (type: string) => {
    switch (type) {
      case 'welcome': return 'Accueil';
      case 'question': return 'Question';
      case 'message': return 'Message';
      case 'lead_capture': return 'Capture';
      case 'calendar_embed': return 'Calendrier';
      default: return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) handleReset();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wand2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Générateur de Funnel IA</DialogTitle>
                <DialogDescription>
                  Décrivez votre funnel et laissez l'IA créer tous les steps
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {['prompt', 'config', 'generating', 'preview'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step === s ? 'bg-primary text-primary-foreground scale-110' :
                  ['prompt', 'config', 'generating', 'preview'].indexOf(step) > i ? 'bg-primary/20 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {['prompt', 'config', 'generating', 'preview'].indexOf(step) > i ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 3 && (
                  <div className={`w-12 h-0.5 mx-1 ${
                    ['prompt', 'config', 'generating', 'preview'].indexOf(step) > i ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-180px)]">
          <div className="p-6">
            {/* Step 1: Prompt */}
            {step === 'prompt' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="prompt" className="text-base font-semibold">
                    Décrivez votre funnel idéal
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Ex: Je veux créer un quiz pour qualifier les prospects intéressés par mes services de coaching en développement personnel. Mon offre principale est un programme de 12 semaines..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    className="text-base resize-none"
                    maxLength={5000}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{prompt.length}/5000 caractères</span>
                    <span>Plus c'est détaillé, meilleur sera le résultat</span>
                  </div>
                </div>

                {/* Prompt Examples */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Exemples pour vous inspirer :</Label>
                  <div className="grid gap-2">
                    {PROMPT_EXAMPLES.map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setPrompt(example)}
                        className="text-left text-sm p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all line-clamp-2"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Config */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Secteur d'activité</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez..." />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind.id} value={ind.id}>
                            <div className="flex items-center gap-2">
                              <ind.icon className="h-4 w-4" />
                              {ind.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Objectif principal</Label>
                    <Select value={goal} onValueChange={setGoal}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez..." />
                      </SelectTrigger>
                      <SelectContent>
                        {FUNNEL_GOALS.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStep('config')} disabled={!prompt.trim()}>
                    Configuration avancée
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Config */}
            {step === 'config' && (
              <div className="space-y-6">
                <Tabs defaultValue="structure">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="structure">
                      <Settings2 className="h-4 w-4 mr-2" />
                      Structure
                    </TabsTrigger>
                    <TabsTrigger value="style">
                      <Palette className="h-4 w-4 mr-2" />
                      Style
                    </TabsTrigger>
                    <TabsTrigger value="advanced">
                      <Zap className="h-4 w-4 mr-2" />
                      Avancé
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="structure" className="space-y-6 mt-4">
                    {/* Step Count */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Nombre d'étapes</Label>
                        <span className="text-sm font-medium">{stepCount[0]} étapes</span>
                      </div>
                      <Slider
                        value={stepCount}
                        onValueChange={setStepCount}
                        min={3}
                        max={20}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommandé: 5-10 étapes pour un bon taux de conversion
                      </p>
                    </div>

                    {/* Step Types */}
                    <div className="space-y-4">
                      <Label>Types d'étapes à inclure</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Play className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Page d'accueil</div>
                              <div className="text-xs text-muted-foreground">Présentation et hook d'attention</div>
                            </div>
                          </div>
                          <Switch checked={includeWelcome} onCheckedChange={setIncludeWelcome} />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-accent" />
                            <div>
                              <div className="font-medium">Capture de leads</div>
                              <div className="text-xs text-muted-foreground">Formulaire email/téléphone</div>
                            </div>
                          </div>
                          <Switch checked={includeLeadCapture} onCheckedChange={setIncludeLeadCapture} />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-success" />
                            <div>
                              <div className="font-medium">Prise de RDV</div>
                              <div className="text-xs text-muted-foreground">Intégration calendrier</div>
                            </div>
                          </div>
                          <Switch checked={includeCalendar} onCheckedChange={setIncludeCalendar} />
                        </div>
                      </div>
                    </div>

                    {/* Tone */}
                    <div className="space-y-2">
                      <Label>Ton de communication</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TONE_OPTIONS.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="space-y-6 mt-4">
                    <div className="space-y-3">
                      <Label>Thème de couleurs</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {THEME_PRESETS.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setSelectedTheme(theme)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              selectedTheme.id === theme.id ? 'border-primary ring-2 ring-primary/20' : 'border-muted hover:border-primary/50'
                            }`}
                          >
                            <div className="flex gap-1 mb-2">
                              <div className="h-6 w-6 rounded" style={{ backgroundColor: theme.colors.primary }} />
                              <div className="h-6 w-6 rounded" style={{ backgroundColor: theme.colors.accent }} />
                              <div className="h-6 w-6 rounded" style={{ backgroundColor: theme.colors.background }} />
                            </div>
                            <div className="text-sm font-medium">{theme.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6 mt-4">
                    <div className="space-y-2">
                      <Label>Modèle IA</Label>
                      <Select value={aiModel} onValueChange={setAiModel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google/gemini-2.5-flash">
                            Gemini 2.5 Flash (Rapide)
                          </SelectItem>
                          <SelectItem value="google/gemini-2.5-pro">
                            Gemini 2.5 Pro (Plus puissant)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Crédits IA restants: {(profile?.max_ai_generations_monthly || 50) - (profile?.current_month_ai_count || 0)}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep('prompt')}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Button>
                  <Button onClick={handleGenerate} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Générer le funnel
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Generating */}
            {step === 'generating' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
                    <Wand2 className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -inset-4 rounded-full border-4 border-primary/20 animate-spin" style={{ animationDuration: '3s' }} />
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Génération en cours...</h3>
                  <p className="text-muted-foreground">
                    L'IA crée votre funnel personnalisé
                  </p>
                </div>

                <div className="w-full max-w-md space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Analyse du prompt</span>
                    <span>Création des étapes</span>
                    <span>Finalisation</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {['Analyse du contexte', 'Création des questions', 'Optimisation du copywriting', 'Configuration du design'].map((task, i) => (
                    <Badge
                      key={task}
                      variant={progress > (i + 1) * 25 ? 'default' : 'outline'}
                      className="animate-fade-in"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    >
                      {progress > (i + 1) * 25 && <Check className="h-3 w-3 mr-1" />}
                      {task}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Preview */}
            {step === 'preview' && generatedConfig && (
              <div className="space-y-6">
                {/* Funnel Name */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="funnelName">Nom du funnel</Label>
                    <Input
                      id="funnelName"
                      value={funnelName}
                      onChange={(e) => setFunnelName(e.target.value)}
                      placeholder="Mon super funnel"
                      className="mt-1"
                    />
                  </div>
                  <Button variant="outline" onClick={handleRegenerate} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Régénérer
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-3xl font-bold text-primary">{generatedConfig.steps.length}</div>
                      <div className="text-sm text-muted-foreground">Étapes</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-3xl font-bold text-accent">
                        {generatedConfig.steps.filter(s => s.type === 'question').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Questions</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-3xl font-bold text-success">
                        {generatedConfig.steps.filter(s => s.type === 'lead_capture').length > 0 ? 'Oui' : 'Non'}
                      </div>
                      <div className="text-sm text-muted-foreground">Capture</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Steps Preview */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Aperçu des étapes</Label>
                  <div className="space-y-2">
                    {generatedConfig.steps.map((s, index) => (
                      <Card
                        key={s.id || index}
                        className={`cursor-pointer transition-all hover:shadow-md ${editingStepIndex === index ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setEditingStepIndex(editingStepIndex === index ? null : index)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              {getStepIcon(s.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {getStepTypeName(s.type)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Étape {index + 1}
                                </span>
                              </div>
                              <h4 className="font-medium line-clamp-1">{s.title}</h4>
                              {s.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {s.description}
                                </p>
                              )}
                              {s.options && s.options.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {s.options.slice(0, 3).map((opt, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {opt.text}
                                    </Badge>
                                  ))}
                                  {s.options.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{s.options.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Inline Edit */}
                          {editingStepIndex === index && (
                            <div className="mt-4 pt-4 border-t space-y-3" onClick={(e) => e.stopPropagation()}>
                              <div>
                                <Label className="text-xs">Titre</Label>
                                <Input
                                  value={s.title}
                                  onChange={(e) => updateStep(index, { title: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Description</Label>
                                <Textarea
                                  value={s.description || ''}
                                  onChange={(e) => updateStep(index, { description: e.target.value })}
                                  className="mt-1"
                                  rows={2}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setStep('config')}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Modifier la config
                  </Button>
                  <Button onClick={handleSave} disabled={loading || !funnelName.trim()} className="gap-2">
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Créer le funnel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AIFunnelGenerator;
