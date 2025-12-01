import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { funnelService } from '@/services/funnelService';
import { aiService } from '@/services/aiService';
import { QuizConfig } from '@/types/funnel';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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
import { Sparkles, Loader2, Rocket, Library, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadMachineWizard } from './LeadMachineWizard';
import { LeadMachineWorkbook } from '@/types/leadMachine';

interface CreateFunnelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateFunnelModal = ({ open, onOpenChange }: CreateFunnelModalProps) => {
  const [step, setStep] = useState<'method' | 'ai' | 'blank' | 'template' | 'leadMachine'>('method');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiModel, setAiModel] = useState('google/gemini-2.5-flash');
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleCreateBlank = async () => {
    if (!name.trim()) {
      toast.error("Le nom du funnel est requis");
      return;
    }

    try {
      setLoading(true);
      
      const defaultConfig: QuizConfig = {
        steps: [],
        theme: {
          font: 'Poppins',
          colors: {
            background: '#D9CFC4',
            primary: '#A97C7C',
            accent: '#A11D1F',
            text: '#374151',
            buttonText: '#FFFFFF',
          },
        },
      };

      const funnel = await funnelService.create({
        name,
        description: description || undefined,
        config: defaultConfig,
      });

      toast.success("Funnel créé ! Vous pouvez maintenant le configurer");

      onOpenChange(false);
      navigate(`/funnels/${funnel.id}/edit`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Veuillez décrire votre funnel");
      return;
    }

    try {
      setLoading(true);
      
      const config = await aiService.generateFunnel(aiPrompt, aiModel);
      
      const funnel = await funnelService.create({
        name: `Funnel généré par IA`,
        description: aiPrompt.substring(0, 200),
        config,
      });

      toast.success("Funnel créé avec IA ! Votre funnel a été généré avec succès");

      onOpenChange(false);
      navigate(`/funnels/${funnel.id}/edit`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadMachineGeneration = async (workbook: LeadMachineWorkbook) => {
    setLoading(true);
    try {
      console.log("🚀 Starting Lead Machine funnel generation...");
      
      const { data, error } = await supabase.functions.invoke('generate-lead-machine-funnel', {
        body: { workbook }
      });

      if (error) throw error;

      console.log("✅ Lead Machine funnel generated:", data);

      const result = await funnelService.create({
        name: data.name,
        description: data.description,
        config: data.config
      });

      toast.success("Funnel Lead Machine créé ! Votre funnel de conversion a été généré avec succès");

      onOpenChange(false);
      handleReset();
      navigate(`/funnels/${result.id}/edit`);
    } catch (error: any) {
      console.error("Error generating Lead Machine funnel:", error);
      toast.error(error.message || "Erreur lors de la génération du funnel");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('method');
    setName('');
    setDescription('');
    setAiPrompt('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) handleReset();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Créer un nouveau funnel</DialogTitle>
          <DialogDescription>
            Choisissez comment vous souhaitez créer votre funnel
          </DialogDescription>
        </DialogHeader>

        {step === 'method' && (
          <div className="grid gap-4 md:grid-cols-2 py-4">
            <Card 
              className="cursor-pointer hover:shadow-elegant transition-smooth hover:scale-105 border-2 border-accent/20"
              onClick={() => setStep('leadMachine')}
            >
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Lead Machine</CardTitle>
                <CardDescription>
                  Wizard guidé avec IA pour un funnel de conversion optimisé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 rounded-lg p-3 text-sm">
                  <span className="font-semibold">🎯 Nouveau</span>
                  <p className="text-muted-foreground mt-1">
                    9 étapes : ATTRACT → NURTURE
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-elegant transition-smooth hover:scale-105 border-2 border-accent/20"
              onClick={() => setStep('ai')}
            >
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Générer avec IA</CardTitle>
                <CardDescription>
                  Décrivez votre funnel et laissez l'IA le créer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 rounded-lg p-3 text-sm">
                  <span className="font-semibold">✨ Recommandé</span>
                  <p className="text-muted-foreground mt-1">
                    Rapide et intelligent
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-elegant transition-smooth hover:scale-105"
              onClick={() => setStep('template')}
            >
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Library className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Partir d'un template</CardTitle>
                <CardDescription>
                  Templates pré-configurés prêts à l'emploi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <span className="font-semibold">Rapide</span>
                  <p className="text-muted-foreground mt-1">
                    Personnalisables
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-elegant transition-smooth hover:scale-105"
              onClick={() => setStep('blank')}
            >
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Partir de zéro</CardTitle>
                <CardDescription>
                  Créez votre funnel étape par étape
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <span className="font-semibold">Contrôle total</span>
                  <p className="text-muted-foreground mt-1">
                    Utilisateurs avancés
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'leadMachine' && (
          <LeadMachineWizard 
            onComplete={handleLeadMachineGeneration}
            onBack={() => setStep('method')}
          />
        )}

        {step === 'ai' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="aiPrompt">Décrivez votre funnel</Label>
              <Textarea
                id="aiPrompt"
                placeholder="Ex: Je veux créer un quiz pour qualifier les prospects intéressés par mes services de coaching en développement personnel..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={5}
                maxLength={10000}
              />
              <p className="text-xs text-muted-foreground">
                {aiPrompt.length}/10000 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aiModel">Modèle IA</Label>
              <Select value={aiModel} onValueChange={setAiModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google/gemini-2.5-flash">
                    Gemini 2.5 Flash (Recommandé)
                  </SelectItem>
                  <SelectItem value="google/gemini-2.5-pro">
                    Gemini 2.5 Pro (Plus puissant)
                  </SelectItem>
                  <SelectItem value="openai/gpt-5-mini">
                    GPT-5 Mini
                  </SelectItem>
                  <SelectItem value="openai/gpt-5">
                    GPT-5 (Plus intelligent)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStep('method')}>
                Retour
              </Button>
              <Button onClick={handleAIGeneration} disabled={loading || !aiPrompt.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer avec IA
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'blank' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du funnel *</Label>
              <Input
                id="name"
                placeholder="Mon super funnel"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description de votre funnel..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStep('method')}>
                Retour
              </Button>
              <Button onClick={handleCreateBlank} disabled={loading || !name.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Créer
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'template' && (
          <div className="space-y-4 py-4">
            <p className="text-center text-muted-foreground">
              Redirection vers la page des templates...
            </p>
            <div className="flex justify-center">
              <Button onClick={() => {
                onOpenChange(false);
                navigate('/templates');
              }}>
                <Library className="mr-2 h-4 w-4" />
                Voir les templates
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateFunnelModal;
