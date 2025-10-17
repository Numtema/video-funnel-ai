import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { funnelService } from '@/services/funnelService';
import { aiService } from '@/services/aiService';
import { QuizConfig } from '@/types/funnel';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
import { Sparkles, Loader2, Rocket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateFunnelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateFunnelModal = ({ open, onOpenChange }: CreateFunnelModalProps) => {
  const [step, setStep] = useState<'method' | 'ai' | 'blank'>('method');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiModel, setAiModel] = useState('google/gemini-2.5-flash');
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateBlank = async () => {
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du funnel est requis",
        variant: "destructive",
      });
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

      toast({
        title: "Funnel créé !",
        description: "Vous pouvez maintenant le configurer",
      });

      onOpenChange(false);
      navigate(`/funnels/${funnel.id}/edit`);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez décrire votre funnel",
        variant: "destructive",
      });
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

      toast({
        title: "Funnel créé avec IA !",
        description: "Votre funnel a été généré avec succès",
      });

      onOpenChange(false);
      navigate(`/funnels/${funnel.id}/edit`);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
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
      <DialogContent className="max-w-2xl">
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
              onClick={() => setStep('ai')}
            >
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Générer avec IA</CardTitle>
                <CardDescription>
                  Décrivez votre funnel et laissez l'IA le créer pour vous
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
              onClick={() => setStep('blank')}
            >
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Partir de zéro</CardTitle>
                <CardDescription>
                  Créez votre funnel étape par étape manuellement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <span className="font-semibold">Contrôle total</span>
                  <p className="text-muted-foreground mt-1">
                    Pour les utilisateurs avancés
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'ai' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="aiPrompt">Décrivez votre funnel</Label>
              <Textarea
                id="aiPrompt"
                placeholder="Ex: Funnel pour un coach en développement personnel qui vend une formation en ligne sur la confiance en soi..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {aiPrompt.length}/500 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modèle IA</Label>
              <Select value={aiModel} onValueChange={setAiModel}>
                <SelectTrigger id="model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google/gemini-2.5-flash">
                    Gemini Flash (Rapide) ⚡
                  </SelectItem>
                  <SelectItem value="google/gemini-2.5-pro">
                    Gemini Pro (Précis) 🎯
                  </SelectItem>
                  <SelectItem value="google/gemini-2.5-flash-lite">
                    Gemini Flash Lite (Ultra rapide) 🚀
                  </SelectItem>
                  <SelectItem value="openai/gpt-5">
                    GPT-5 (Puissant) 💪
                  </SelectItem>
                  <SelectItem value="openai/gpt-5-mini">
                    GPT-5 Mini (Équilibré) ⚖️
                  </SelectItem>
                  <SelectItem value="openai/gpt-5-nano">
                    GPT-5 Nano (Économique) 💰
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep('method')} className="flex-1">
                Retour
              </Button>
              <Button 
                onClick={handleAIGeneration}
                disabled={!aiPrompt.trim() || loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
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
                placeholder="Ex: Quiz Découverte Produit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                placeholder="Décrivez l'objectif de ce funnel..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/500 caractères
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep('method')} className="flex-1">
                Retour
              </Button>
              <Button onClick={handleCreateBlank} disabled={loading} className="flex-1">
                {loading ? 'Création...' : 'Créer le funnel'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateFunnelModal;
