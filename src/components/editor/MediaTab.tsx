import { useState } from 'react';
import { QuizStep, MediaConfig } from '@/types/funnel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles, Link as LinkIcon, Upload, Image as ImageIcon } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface MediaTabProps {
  step: QuizStep;
  onUpdate: (step: QuizStep) => void;
}

export function MediaTab({ step, onUpdate }: MediaTabProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');

  const handleMediaTypeChange = (type: 'image' | 'video' | 'audio' | 'none') => {
    onUpdate({
      ...step,
      media: {
        type,
        url: type === 'none' ? '' : step.media.url,
      },
    });
  };

  const handleUrlChange = (url: string) => {
    onUpdate({
      ...step,
      media: {
        ...step.media,
        url,
      },
    });
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer une description pour générer l\'image',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const imageUrl = await aiService.generateImage(imagePrompt);
      
      onUpdate({
        ...step,
        media: {
          type: 'image',
          url: imageUrl,
        },
      });

      toast({
        title: 'Image générée',
        description: 'Votre image a été créée avec succès',
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer l\'image. Vérifiez vos crédits IA.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Type de média</Label>
        <Select value={step.media.type} onValueChange={(value: any) => handleMediaTypeChange(value)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Vidéo</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {step.media.type !== 'none' && (
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="link">
              <LinkIcon className="w-4 h-4 mr-2" />
              Lien
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="w-4 h-4 mr-2" />
              Générer avec IA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="media-url">URL du média</Label>
              <Input
                id="media-url"
                value={step.media.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://..."
                className="mt-2"
              />
            </div>

            {step.media.url && (
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Aperçu</p>
                {step.media.type === 'image' && (
                  <img
                    src={step.media.url}
                    alt="Preview"
                    className="w-full rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                {step.media.type === 'video' && (
                  <video
                    src={step.media.url}
                    controls
                    className="w-full rounded-lg"
                  />
                )}
                {step.media.type === 'audio' && (
                  <audio
                    src={step.media.url}
                    controls
                    className="w-full"
                  />
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 mt-4">
            {step.media.type === 'image' && (
              <div>
                <Label htmlFor="image-prompt">Décrivez l'image à générer</Label>
                <Textarea
                  id="image-prompt"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Ex: Une photo professionnelle d'une femme souriante dans un bureau moderne..."
                  rows={4}
                  className="mt-2"
                />
                
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGenerating}
                  className="w-full mt-4"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Génération en cours...' : 'Générer l\'image'}
                </Button>

                {step.media.url && step.media.url.startsWith('data:image') && (
                  <div className="mt-4 border rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Image générée</p>
                    <img
                      src={step.media.url}
                      alt="Generated"
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {step.media.type === 'video' && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Génération de vidéos prochainement disponible</p>
                <p className="text-sm mt-2">Utilisez le lien pour intégrer une vidéo existante</p>
              </div>
            )}

            {step.media.type === 'audio' && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Génération audio prochainement disponible</p>
                <p className="text-sm mt-2">Utilisez le lien pour intégrer un audio existant</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}