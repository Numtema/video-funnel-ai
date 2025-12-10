import { useState, useEffect } from 'react';
import { QuizStep, ThemeConfig, StepType, QuizConfig } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Monitor,
  Smartphone,
  SplitSquareHorizontal,
  Maximize2,
  RotateCcw,
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';

interface LivePreviewPaneProps {
  steps: QuizStep[];
  currentStepId: string | null;
  theme: ThemeConfig;
  config: QuizConfig;
  onStepChange?: (stepId: string) => void;
}

type ViewMode = 'desktop' | 'mobile' | 'split';

export function LivePreviewPane({
  steps,
  currentStepId,
  theme,
  config,
  onStepChange
}: LivePreviewPaneProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [previewStepIndex, setPreviewStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = currentStepId
    ? steps.find(s => s.id === currentStepId)
    : steps[previewStepIndex];

  useEffect(() => {
    if (currentStepId) {
      const index = steps.findIndex(s => s.id === currentStepId);
      if (index >= 0) setPreviewStepIndex(index);
    }
  }, [currentStepId, steps]);

  const handlePrevStep = () => {
    if (previewStepIndex > 0) {
      const newIndex = previewStepIndex - 1;
      setPreviewStepIndex(newIndex);
      onStepChange?.(steps[newIndex].id);
    }
  };

  const handleNextStep = () => {
    if (previewStepIndex < steps.length - 1) {
      const newIndex = previewStepIndex + 1;
      setPreviewStepIndex(newIndex);
      onStepChange?.(steps[newIndex].id);
    }
  };

  const handleReset = () => {
    setPreviewStepIndex(0);
    onStepChange?.(steps[0]?.id);
  };

  const renderStepPreview = (step: QuizStep | undefined, isMobile: boolean = false) => {
    if (!step) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p className="text-sm">Aucune étape à afficher</p>
        </div>
      );
    }

    const containerClass = isMobile
      ? 'p-3 text-sm'
      : 'p-4 sm:p-6';

    return (
      <div
        className={cn("h-full overflow-y-auto", containerClass)}
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          fontFamily: theme.font,
        }}
      >
        {/* Logo */}
        {theme.logo && (
          <div className="flex justify-center mb-4 pb-3 border-b" style={{ borderColor: theme.colors.primary + '20' }}>
            <img
              src={theme.logo}
              alt="Logo"
              className={cn("object-contain", isMobile ? "h-8" : "h-10 sm:h-12")}
            />
          </div>
        )}

        {/* Media */}
        {step.media.type !== 'none' && step.media.url && (
          <div className={cn("mb-4 rounded-lg overflow-hidden", isMobile ? "aspect-video" : "aspect-video max-h-48")}>
            {step.media.type === 'image' && (
              <img
                src={step.media.url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
            {step.media.type === 'video' && (
              <>
                {isYouTubeUrl(step.media.url) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(step.media.url) || ''}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={step.media.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          <h2
            className={cn(
              "font-bold leading-tight break-words",
              isMobile ? "text-base" : "text-lg sm:text-xl"
            )}
            style={{
              color: theme.colors.text,
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {step.title || 'Titre de l\'étape'}
          </h2>

          {step.description && (
            <p
              className={cn(
                "opacity-80 leading-relaxed break-words whitespace-pre-line",
                isMobile ? "text-xs" : "text-sm"
              )}
              style={{
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {step.description}
            </p>
          )}

          {/* Question Options */}
          {step.type === StepType.Question && step.options && (
            <div className={cn("space-y-2 mt-4", isMobile && "space-y-1.5")}>
              {step.options.map((option) => (
                <button
                  key={option.id}
                  className={cn(
                    "w-full rounded-lg border-2 text-left transition-all hover:scale-[1.01] break-words",
                    isMobile ? "p-2 text-xs" : "p-3 text-sm"
                  )}
                  style={{
                    borderColor: theme.colors.primary,
                    backgroundColor: 'transparent',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                  }}
                >
                  <span className="block leading-snug">{option.text || 'Option'}</span>
                </button>
              ))}
            </div>
          )}

          {/* Lead Capture */}
          {step.type === StepType.LeadCapture && (
            <div className={cn("space-y-2 mt-4", isMobile && "space-y-1.5")}>
              {step.fields?.includes('name') && (
                <input
                  type="text"
                  placeholder="Nom complet"
                  className={cn(
                    "w-full rounded-lg border bg-transparent",
                    isMobile ? "p-2 text-xs" : "p-3 text-sm"
                  )}
                  style={{ borderColor: theme.colors.primary }}
                  readOnly
                />
              )}
              {step.fields?.includes('email') && (
                <input
                  type="email"
                  placeholder="Email"
                  className={cn(
                    "w-full rounded-lg border bg-transparent",
                    isMobile ? "p-2 text-xs" : "p-3 text-sm"
                  )}
                  style={{ borderColor: theme.colors.primary }}
                  readOnly
                />
              )}
              {step.fields?.includes('phone') && (
                <input
                  type="tel"
                  placeholder="Téléphone"
                  className={cn(
                    "w-full rounded-lg border bg-transparent",
                    isMobile ? "p-2 text-xs" : "p-3 text-sm"
                  )}
                  style={{ borderColor: theme.colors.primary }}
                  readOnly
                />
              )}
            </div>
          )}

          {/* CTA Button */}
          <button
            className={cn(
              "w-full rounded-lg font-semibold transition-all hover:opacity-90 mt-4",
              isMobile ? "py-2 px-4 text-xs" : "py-3 px-6 text-sm"
            )}
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.buttonText,
            }}
          >
            {step.buttonText || 'Continuer'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Live Preview</h3>
          <Badge variant="outline" className="text-xs">
            {previewStepIndex + 1}/{steps.length}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-0.5">
            <Button
              variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="h-7 px-2"
            >
              <Monitor className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="h-7 px-2"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewMode === 'split' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('split')}
              className="h-7 px-2"
            >
              <SplitSquareHorizontal className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden bg-muted/20 p-2 sm:p-4">
        {viewMode === 'split' ? (
          // Side by Side View
          <div className="flex gap-4 h-full justify-center items-start">
            {/* Desktop Preview */}
            <div className="flex flex-col items-center">
              <Badge variant="outline" className="mb-2 text-xs">Desktop</Badge>
              <div
                className="w-80 h-[450px] bg-card rounded-lg shadow-lg overflow-hidden border"
              >
                {renderStepPreview(currentStep, false)}
              </div>
            </div>

            {/* Mobile Preview */}
            <div className="flex flex-col items-center">
              <Badge variant="outline" className="mb-2 text-xs">Mobile</Badge>
              <div
                className="w-44 h-[380px] bg-card rounded-2xl shadow-lg overflow-hidden border-4 border-gray-800 relative"
              >
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-b-xl z-10" />
                <div className="h-full pt-4">
                  {renderStepPreview(currentStep, true)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Single View (Desktop or Mobile)
          <div className="flex justify-center h-full">
            <div
              className={cn(
                "bg-card rounded-lg shadow-lg overflow-hidden border transition-all",
                viewMode === 'desktop'
                  ? "w-full max-w-lg h-full"
                  : "w-48 sm:w-52 h-[420px] rounded-2xl border-4 border-gray-800 relative"
              )}
            >
              {viewMode === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-b-xl z-10" />
              )}
              <div className={cn("h-full", viewMode === 'mobile' && "pt-4")}>
                {renderStepPreview(currentStep, viewMode === 'mobile')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-3 border-t bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevStep}
          disabled={previewStepIndex === 0}
          className="h-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Précédent</span>
        </Button>

        <div className="flex items-center gap-1">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => {
                setPreviewStepIndex(index);
                onStepChange?.(step.id);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === previewStepIndex
                  ? "bg-primary w-4"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextStep}
          disabled={previewStepIndex === steps.length - 1}
          className="h-8"
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
