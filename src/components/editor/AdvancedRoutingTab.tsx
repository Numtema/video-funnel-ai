import { useState } from 'react';
import { QuizConfig, ScoreSegment, QuizStep, StepType } from '@/types/funnel';
import { calculateMaxScore, generateDefaultSegments } from '@/components/player/PlayerLogic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Route,
  Target,
  Zap,
  MessageSquare,
  ExternalLink,
  Palette,
  Award,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface AdvancedRoutingTabProps {
  config: QuizConfig;
  onUpdate: (updates: Partial<QuizConfig>) => void;
}

const SEGMENT_COLORS = [
  { name: 'Rouge', value: '#EF4444' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Vert', value: '#10B981' },
  { name: 'Bleu', value: '#3B82F6' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Rose', value: '#EC4899' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Indigo', value: '#6366F1' },
];

const SEGMENT_PRESETS = [
  {
    name: 'Débutant / Intermédiaire / Expert',
    segments: ['Débutant', 'Intermédiaire', 'Expert'],
    colors: ['#EF4444', '#F59E0B', '#10B981'],
  },
  {
    name: 'Froid / Tiède / Chaud',
    segments: ['Lead Froid', 'Lead Tiède', 'Lead Chaud'],
    colors: ['#3B82F6', '#F59E0B', '#EF4444'],
  },
  {
    name: 'Bronze / Argent / Or',
    segments: ['Bronze', 'Argent', 'Or'],
    colors: ['#B45309', '#9CA3AF', '#F59E0B'],
  },
  {
    name: 'Basique / Standard / Premium',
    segments: ['Basique', 'Standard', 'Premium'],
    colors: ['#6B7280', '#3B82F6', '#8B5CF6'],
  },
];

export function AdvancedRoutingTab({ config, onUpdate }: AdvancedRoutingTabProps) {
  const [newSegmentName, setNewSegmentName] = useState('');

  const scoring = config.scoring || { enabled: false, threshold: 0 };
  const segments = scoring.segments || [];
  const maxScore = calculateMaxScore(config);
  const showSegmentResult = scoring.showSegmentResult ?? true;

  // Filtrer les steps disponibles pour le routing
  const availableSteps = config.steps.filter(
    s => s.type === StepType.Message || s.type === StepType.CalendarEmbed
  );

  const handleToggleScoring = (enabled: boolean) => {
    if (enabled && segments.length === 0) {
      // Générer des segments par défaut
      const defaultSegments = generateDefaultSegments(maxScore);
      onUpdate({
        scoring: {
          ...scoring,
          enabled: true,
          segments: defaultSegments,
        },
      });
    } else {
      onUpdate({
        scoring: { ...scoring, enabled },
      });
    }
  };

  const handleToggleShowResult = (show: boolean) => {
    onUpdate({
      scoring: { ...scoring, showSegmentResult: show },
    });
  };

  const handleApplyPreset = (preset: typeof SEGMENT_PRESETS[0]) => {
    const segmentSize = Math.floor(maxScore / preset.segments.length);
    const newSegments: ScoreSegment[] = preset.segments.map((label, index) => ({
      id: `segment-${index}-${Date.now()}`,
      name: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      minScore: index * segmentSize,
      maxScore: index === preset.segments.length - 1 ? maxScore : (index + 1) * segmentSize - 1,
      color: preset.colors[index],
    }));

    onUpdate({
      scoring: { ...scoring, enabled: true, segments: newSegments },
    });
  };

  const handleAddSegment = () => {
    if (!newSegmentName.trim()) return;

    const lastSegment = segments[segments.length - 1];
    const newMinScore = lastSegment ? lastSegment.maxScore + 1 : 0;

    const newSegment: ScoreSegment = {
      id: `segment-${Date.now()}`,
      name: newSegmentName.toLowerCase().replace(/\s+/g, '-'),
      label: newSegmentName.trim(),
      minScore: newMinScore,
      maxScore: maxScore,
      color: SEGMENT_COLORS[segments.length % SEGMENT_COLORS.length].value,
    };

    // Ajuster le segment précédent
    const updatedSegments = segments.length > 0
      ? [...segments.slice(0, -1), { ...lastSegment, maxScore: newMinScore - 1 }, newSegment]
      : [newSegment];

    onUpdate({
      scoring: { ...scoring, segments: updatedSegments },
    });
    setNewSegmentName('');
  };

  const handleUpdateSegment = (segmentId: string, updates: Partial<ScoreSegment>) => {
    const updatedSegments = segments.map(s =>
      s.id === segmentId ? { ...s, ...updates } : s
    );
    onUpdate({
      scoring: { ...scoring, segments: updatedSegments },
    });
  };

  const handleDeleteSegment = (segmentId: string) => {
    if (segments.length <= 1) return;

    const index = segments.findIndex(s => s.id === segmentId);
    const deletedSegment = segments[index];

    let updatedSegments = segments.filter(s => s.id !== segmentId);

    // Redistribuer les scores
    if (index > 0 && updatedSegments[index - 1]) {
      updatedSegments[index - 1] = {
        ...updatedSegments[index - 1],
        maxScore: deletedSegment.maxScore,
      };
    } else if (updatedSegments[0]) {
      updatedSegments[0] = {
        ...updatedSegments[0],
        minScore: deletedSegment.minScore,
      };
    }

    onUpdate({
      scoring: { ...scoring, segments: updatedSegments },
    });
  };

  const handleRecalculateSegments = () => {
    if (segments.length === 0) return;

    const segmentSize = Math.floor(maxScore / segments.length);
    const recalculated = segments.map((segment, index) => ({
      ...segment,
      minScore: index * segmentSize,
      maxScore: index === segments.length - 1 ? maxScore : (index + 1) * segmentSize - 1,
    }));

    onUpdate({
      scoring: { ...scoring, segments: recalculated },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Route className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Routing Avancé par Score</CardTitle>
                <CardDescription>Segmentez vos leads selon leurs réponses</CardDescription>
              </div>
            </div>
            <Switch
              checked={scoring.enabled}
              onCheckedChange={handleToggleScoring}
            />
          </div>
        </CardHeader>

        {scoring.enabled && (
          <CardContent className="pt-0 space-y-3">
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
              <p className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Score maximum possible : <strong>{maxScore} points</strong>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Afficher le segment au visiteur</Label>
              <Switch
                checked={showSegmentResult}
                onCheckedChange={handleToggleShowResult}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {scoring.enabled && (
        <>
          {/* Presets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Modèles prédéfinis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {SEGMENT_PRESETS.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => handleApplyPreset(preset)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {preset.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-full border border-white"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-xs truncate">{preset.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visualisation des segments */}
          {segments.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Répartition des scores
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={handleRecalculateSegments}>
                    Recalculer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-8 bg-muted rounded-lg overflow-hidden flex">
                  {segments.map((segment, index) => {
                    const width = ((segment.maxScore - segment.minScore + 1) / (maxScore + 1)) * 100;
                    return (
                      <div
                        key={segment.id}
                        className="h-full flex items-center justify-center text-xs font-medium text-white transition-all"
                        style={{
                          width: `${width}%`,
                          backgroundColor: segment.color,
                        }}
                        title={`${segment.label}: ${segment.minScore}-${segment.maxScore} points`}
                      >
                        {width > 15 && segment.label}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>{maxScore}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des segments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Segments ({segments.length})
              </Label>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {segments.map((segment, index) => (
                <AccordionItem
                  key={segment.id}
                  value={segment.id}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className="font-medium">{segment.label}</span>
                      <Badge variant="outline" className="ml-auto mr-2">
                        {segment.minScore} - {segment.maxScore} pts
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4 pt-2">
                      {/* Label et couleur */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Nom du segment</Label>
                          <Input
                            value={segment.label}
                            onChange={(e) => handleUpdateSegment(segment.id, { label: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Couleur</Label>
                          <Select
                            value={segment.color}
                            onValueChange={(value) => handleUpdateSegment(segment.id, { color: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: segment.color }}
                                />
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {SEGMENT_COLORS.map((color) => (
                                <SelectItem key={color.value} value={color.value}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-4 h-4 rounded-full"
                                      style={{ backgroundColor: color.value }}
                                    />
                                    {color.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Plage de scores */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Score minimum</Label>
                          <Input
                            type="number"
                            min={0}
                            max={maxScore}
                            value={segment.minScore}
                            onChange={(e) => handleUpdateSegment(segment.id, { minScore: parseInt(e.target.value) || 0 })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Score maximum</Label>
                          <Input
                            type="number"
                            min={0}
                            max={maxScore}
                            value={segment.maxScore}
                            onChange={(e) => handleUpdateSegment(segment.id, { maxScore: parseInt(e.target.value) || maxScore })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* Routing vers étape */}
                      <div>
                        <Label className="text-xs flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          Rediriger vers une étape
                        </Label>
                        <Select
                          value={segment.nextStepId || 'none'}
                          onValueChange={(value) => handleUpdateSegment(segment.id, {
                            nextStepId: value === 'none' ? undefined : value
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Continuer normalement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Continuer normalement</SelectItem>
                            {availableSteps.map((step) => (
                              <SelectItem key={step.id} value={step.id}>
                                {step.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Message personnalisé */}
                      <div>
                        <Label className="text-xs flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Message personnalisé (optionnel)
                        </Label>
                        <Textarea
                          value={segment.customMessage || ''}
                          onChange={(e) => handleUpdateSegment(segment.id, { customMessage: e.target.value || undefined })}
                          placeholder="Message affiché à ce segment..."
                          rows={2}
                          className="mt-1"
                        />
                      </div>

                      {/* Redirection externe */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Type de redirection
                          </Label>
                          <Select
                            value={segment.redirectType || 'none'}
                            onValueChange={(value) => handleUpdateSegment(segment.id, {
                              redirectType: value as ScoreSegment['redirectType']
                            })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Aucune</SelectItem>
                              <SelectItem value="website">Site web</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              <SelectItem value="messenger">Messenger</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {segment.redirectType && segment.redirectType !== 'none' && (
                          <div>
                            <Label className="text-xs">URL / Numéro</Label>
                            <Input
                              value={segment.redirectUrl || ''}
                              onChange={(e) => handleUpdateSegment(segment.id, { redirectUrl: e.target.value })}
                              placeholder={segment.redirectType === 'whatsapp' ? '+33612345678' : 'https://...'}
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {segments.length > 1 && (
                        <div className="pt-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-3 w-3 mr-1" />
                                Supprimer ce segment
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer ce segment ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteSegment(segment.id)}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Ajouter un segment */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nom du nouveau segment..."
                  value={newSegmentName}
                  onChange={(e) => setNewSegmentName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSegment()}
                />
                <Button onClick={handleAddSegment} disabled={!newSegmentName.trim()}>
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
