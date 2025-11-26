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
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.5-flash-image-preview');
  const [pexelsSearch, setPexelsSearch] = useState('');

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
      const imageUrl = await aiService.generateImage(imagePrompt, selectedModel);
      
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
      setImagePrompt('');
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de générer l\'image. Vérifiez vos crédits IA.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const searchPexels = () => {
    if (!pexelsSearch.trim()) {
      toast({
        title: 'Erreur',
        description: 'Entrez un terme de recherche',
        variant: 'destructive',
      });
      return;
    }
    const pexelsUrl = `https://www.pexels.com/search/${encodeURIComponent(pexelsSearch)}`;
    window.open(pexelsUrl, '_blank');
    toast({
      title: 'Recherche Pexels',
      description: 'Copiez l\'URL de l\'image et collez-la dans le champ "Lien"',
    });
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
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="link">
              <LinkIcon className="w-4 h-4 mr-2" />
              Lien
            </TabsTrigger>
            <TabsTrigger value="pexels">
              <ImageIcon className="w-4 h-4 mr-2" />
              Pexels
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="w-4 h-4 mr-2" />
              Générer IA
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

          <TabsContent value="pexels" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Recherchez des images gratuites et de qualité professionnelle sur Pexels. 
                  Copiez ensuite l'URL de l'image et collez-la dans l'onglet "Lien".
                </p>
              </div>
              
              <div>
                <Label htmlFor="pexels-search">Rechercher sur Pexels</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="pexels-search"
                    value={pexelsSearch}
                    onChange={(e) => setPexelsSearch(e.target.value)}
                    placeholder="ex: nature, business, technology..."
                    onKeyPress={(e) => e.key === 'Enter' && searchPexels()}
                  />
                  <Button onClick={searchPexels} type="button">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">Comment utiliser :</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Cliquez sur "Rechercher" pour ouvrir Pexels dans un nouvel onglet</li>
                  <li>Sélectionnez une image qui vous plaît</li>
                  <li>Faites clic droit sur l'image → "Copier l'adresse de l'image"</li>
                  <li>Revenez ici et collez l'URL dans l'onglet "Lien"</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 mt-4">
            {step.media.type === 'image' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-model">Modèle IA</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google/gemini-2.5-flash-image-preview">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Nano Banana</span>
                          <span className="text-xs text-muted-foreground">Rapide - Image jusqu'à 1024x1024px</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="imagen-4-generate-001">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Imagen 4</span>
                          <span className="text-xs text-muted-foreground">Haute qualité • Meilleur rendu texte</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="imagen-4-ultra-generate-001">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Imagen 4 Ultra</span>
                          <span className="text-xs text-muted-foreground">Qualité supérieure • Plus lent</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="image-prompt">Décrivez l'image à générer</Label>
                  <Textarea
                    id="image-prompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Ex: Une photo professionnelle d'une femme souriante dans un bureau moderne, éclairage naturel, ultra haute résolution..."
                    rows={4}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Astuce: Ajoutez "ultra high resolution" pour maximiser la qualité
                  </p>
                </div>
                
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGenerating}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Génération en cours...' : 'Générer l\'image'}
                </Button>

                {step.media.url && step.media.url.startsWith('data:image') && (
                  <div className="mt-4 border rounded-lg p-4 bg-muted/20">
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