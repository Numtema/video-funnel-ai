import { useState } from 'react';
import { QuizStep, StepVariant, MediaConfig } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Trash2,
  Copy,
  FlaskConical,
  TrendingUp,
  Eye,
  Target,
  BarChart3,
  Percent
} from 'lucide-react';

interface ABTestingTabProps {
  step: QuizStep;
  onUpdate: (updates: Partial<QuizStep>) => void;
}

export function ABTestingTab({ step, onUpdate }: ABTestingTabProps) {
  const [newVariantName, setNewVariantName] = useState('');

  const variants = step.variants || [];
  const isEnabled = step.abTestEnabled || false;

  const handleToggleABTest = (enabled: boolean) => {
    if (enabled && variants.length === 0) {
      // Créer la première variante automatiquement (variante originale)
      const originalVariant: StepVariant = {
        id: `variant-original-${Date.now()}`,
        name: 'Original',
        title: step.title,
        description: step.description,
        buttonText: step.buttonText,
        weight: 50,
        views: 0,
        conversions: 0,
      };
      const newVariant: StepVariant = {
        id: `variant-b-${Date.now()}`,
        name: 'Variante B',
        weight: 50,
        views: 0,
        conversions: 0,
      };
      onUpdate({
        abTestEnabled: true,
        variants: [originalVariant, newVariant],
      });
    } else {
      onUpdate({ abTestEnabled: enabled });
    }
  };

  const handleAddVariant = () => {
    if (!newVariantName.trim()) return;

    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    const newWeight = Math.max(10, Math.floor((100 - totalWeight) / 2));

    const newVariant: StepVariant = {
      id: `variant-${Date.now()}`,
      name: newVariantName.trim(),
      weight: newWeight,
      views: 0,
      conversions: 0,
    };

    onUpdate({
      variants: [...variants, newVariant],
    });
    setNewVariantName('');
  };

  const handleUpdateVariant = (variantId: string, updates: Partial<StepVariant>) => {
    const updatedVariants = variants.map(v =>
      v.id === variantId ? { ...v, ...updates } : v
    );
    onUpdate({ variants: updatedVariants });
  };

  const handleDeleteVariant = (variantId: string) => {
    if (variants.length <= 2) return; // Minimum 2 variantes

    const updatedVariants = variants.filter(v => v.id !== variantId);
    // Redistribuer le poids
    const removedWeight = variants.find(v => v.id === variantId)?.weight || 0;
    const perVariant = Math.floor(removedWeight / updatedVariants.length);
    const redistributed = updatedVariants.map((v, i) => ({
      ...v,
      weight: v.weight + perVariant + (i === 0 ? removedWeight % updatedVariants.length : 0),
    }));

    onUpdate({ variants: redistributed });
  };

  const handleDuplicateVariant = (variant: StepVariant) => {
    const duplicated: StepVariant = {
      ...variant,
      id: `variant-${Date.now()}`,
      name: `${variant.name} (copie)`,
      weight: 10,
      views: 0,
      conversions: 0,
    };
    onUpdate({ variants: [...variants, duplicated] });
  };

  const normalizeWeights = () => {
    const total = variants.reduce((sum, v) => sum + v.weight, 0);
    if (total === 100) return;

    const factor = 100 / total;
    const normalized = variants.map((v, i) => ({
      ...v,
      weight: i === variants.length - 1
        ? 100 - variants.slice(0, -1).reduce((sum, x) => sum + Math.floor(x.weight * factor), 0)
        : Math.floor(v.weight * factor),
    }));
    onUpdate({ variants: normalized });
  };

  const getConversionRate = (variant: StepVariant) => {
    if (variant.views === 0) return 0;
    return ((variant.conversions / variant.views) * 100).toFixed(1);
  };

  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  const isWeightValid = totalWeight === 100;

  return (
    <div className="space-y-6">
      {/* Header avec toggle */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">A/B Testing</CardTitle>
                <CardDescription>Testez différentes versions de cette étape</CardDescription>
              </div>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggleABTest}
            />
          </div>
        </CardHeader>

        {isEnabled && (
          <CardContent className="pt-0">
            <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-700">
              <p className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Les visiteurs verront aléatoirement une des variantes selon les poids définis
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {isEnabled && (
        <>
          {/* Statistiques globales */}
          {variants.some(v => v.views > 0) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {variants.reduce((sum, v) => sum + v.views, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Vues totales</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">
                      {variants.reduce((sum, v) => sum + v.conversions, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">
                      {variants.reduce((sum, v) => sum + v.views, 0) > 0
                        ? ((variants.reduce((sum, v) => sum + v.conversions, 0) /
                            variants.reduce((sum, v) => sum + v.views, 0)) * 100).toFixed(1)
                        : 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Taux moyen</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Distribution des poids */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Distribution du trafic
                </CardTitle>
                {!isWeightValid && (
                  <Button size="sm" variant="outline" onClick={normalizeWeights}>
                    Normaliser à 100%
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6'][index % 5],
                      }}
                    />
                    <span className="text-sm flex-1 truncate">{variant.name}</span>
                    <span className="text-sm font-medium">{variant.weight}%</span>
                  </div>
                ))}
              </div>
              <Progress
                value={totalWeight}
                className="mt-3"
              />
              <p className={`text-xs mt-1 ${isWeightValid ? 'text-muted-foreground' : 'text-destructive'}`}>
                Total: {totalWeight}% {!isWeightValid && '(doit être 100%)'}
              </p>
            </CardContent>
          </Card>

          {/* Liste des variantes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Variantes ({variants.length})</Label>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {variants.map((variant, index) => (
                <AccordionItem
                  key={variant.id}
                  value={variant.id}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6'][index % 5],
                        }}
                      />
                      <span className="font-medium">{variant.name}</span>
                      <Badge variant="outline" className="ml-auto mr-2">
                        {variant.weight}%
                      </Badge>
                      {variant.views > 0 && (
                        <Badge variant="secondary">
                          {getConversionRate(variant)}% conv.
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4 pt-2">
                      {/* Nom de la variante */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Nom de la variante</Label>
                          <Input
                            value={variant.name}
                            onChange={(e) => handleUpdateVariant(variant.id, { name: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Poids ({variant.weight}%)</Label>
                          <Slider
                            value={[variant.weight]}
                            onValueChange={([value]) => handleUpdateVariant(variant.id, { weight: value })}
                            min={5}
                            max={95}
                            step={5}
                            className="mt-3"
                          />
                        </div>
                      </div>

                      {/* Titre personnalisé */}
                      <div>
                        <Label className="text-xs">Titre (laisser vide pour utiliser l'original)</Label>
                        <Input
                          value={variant.title || ''}
                          onChange={(e) => handleUpdateVariant(variant.id, { title: e.target.value || undefined })}
                          placeholder={step.title}
                          className="mt-1"
                        />
                      </div>

                      {/* Description personnalisée */}
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={variant.description || ''}
                          onChange={(e) => handleUpdateVariant(variant.id, { description: e.target.value || undefined })}
                          placeholder={step.description || 'Description originale'}
                          rows={2}
                          className="mt-1"
                        />
                      </div>

                      {/* Texte du bouton */}
                      <div>
                        <Label className="text-xs">Texte du bouton</Label>
                        <Input
                          value={variant.buttonText || ''}
                          onChange={(e) => handleUpdateVariant(variant.id, { buttonText: e.target.value || undefined })}
                          placeholder={step.buttonText || 'Continuer'}
                          className="mt-1"
                        />
                      </div>

                      {/* Stats */}
                      {(variant.views > 0 || variant.conversions > 0) && (
                        <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm font-medium">
                              <Eye className="h-3 w-3" />
                              {variant.views}
                            </div>
                            <div className="text-xs text-muted-foreground">Vues</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm font-medium">
                              <Target className="h-3 w-3" />
                              {variant.conversions}
                            </div>
                            <div className="text-xs text-muted-foreground">Conv.</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-success">
                              {getConversionRate(variant)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Taux</div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicateVariant(variant)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Dupliquer
                        </Button>
                        {variants.length > 2 && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-3 w-3 mr-1" />
                                Supprimer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cette variante ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Les statistiques de cette variante seront perdues.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteVariant(variant.id)}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Ajouter une variante */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nom de la nouvelle variante..."
                  value={newVariantName}
                  onChange={(e) => setNewVariantName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddVariant()}
                />
                <Button onClick={handleAddVariant} disabled={!newVariantName.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
