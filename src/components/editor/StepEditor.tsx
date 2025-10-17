import { useState } from 'react';
import { QuizStep, StepType } from '@/types/funnel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Sparkles } from 'lucide-react';
import { ContentTab } from './ContentTab';
import { MediaTab } from './MediaTab';
import { DesignTab } from './DesignTab';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

interface StepEditorProps {
  step: QuizStep;
  onUpdate: (step: QuizStep) => void;
  onDelete: () => void;
}

export function StepEditor({ step, onUpdate, onDelete }: StepEditorProps) {
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const handleTitleChange = (title: string) => {
    onUpdate({ ...step, title });
  };

  const handleDescriptionChange = (description: string) => {
    onUpdate({ ...step, description });
  };

  const handleAISuggestTitle = async () => {
    if (!step.title) {
      toast({ title: 'Entrez d\'abord un titre', variant: 'destructive' });
      return;
    }
    setIsGeneratingTitle(true);
    try {
      const suggestion = await aiService.suggestText('title', step.title);
      onUpdate({ ...step, title: suggestion });
      toast({ title: 'Titre amélioré !' });
    } catch (error: any) {
      toast({ 
        title: 'Erreur IA', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleAISuggestDescription = async () => {
    if (!step.description) {
      toast({ title: 'Entrez d\'abord une description', variant: 'destructive' });
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const suggestion = await aiService.suggestText('description', step.description);
      onUpdate({ ...step, description: suggestion });
      toast({ title: 'Description améliorée !' });
    } catch (error: any) {
      toast({ 
        title: 'Erreur IA', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const getStepTypeLabel = (type: StepType): string => {
    const labels = {
      [StepType.Welcome]: 'Écran de Bienvenue',
      [StepType.Question]: 'Question',
      [StepType.Message]: 'Message',
      [StepType.LeadCapture]: 'Capture de Lead',
      [StepType.CalendarEmbed]: 'Calendrier Intégré',
    };
    return labels[type];
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{getStepTypeLabel(step.type)}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer l'étape
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="step-title">Titre</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                onClick={handleAISuggestTitle}
                disabled={isGeneratingTitle}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                <span className="text-xs">{isGeneratingTitle ? 'Génération...' : 'IA'}</span>
              </Button>
            </div>
            <Input
              id="step-title"
              value={step.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Entrez un titre accrocheur..."
              className="text-lg font-semibold"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="step-description">Description</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                onClick={handleAISuggestDescription}
                disabled={isGeneratingDesc}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                <span className="text-xs">{isGeneratingDesc ? 'Génération...' : 'IA'}</span>
              </Button>
            </div>
            <Textarea
              id="step-description"
              value={step.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Ajoutez une description..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="media">Média</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <ContentTab step={step} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <MediaTab step={step} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="design" className="mt-6">
          <DesignTab step={step} onUpdate={onUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}