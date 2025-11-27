import { QuizStep, ThemeConfig, StepType } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';

interface PreviewPaneProps {
  step: QuizStep | undefined;
  theme: ThemeConfig;
}

export function PreviewPane({ step, theme }: PreviewPaneProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const deviceSizes = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  if (!step) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Sélectionnez une étape pour voir l'aperçu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Aperçu</h3>
        <div className="flex gap-1 border rounded-lg p-1">
          <Button
            variant={deviceMode === 'desktop' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('desktop')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceMode === 'tablet' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('tablet')}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceMode === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('mobile')}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-muted/30 p-4">
        <div className={cn('mx-auto transition-all', deviceSizes[deviceMode])}>
          <div
            className="rounded-lg shadow-lg overflow-y-auto max-h-[600px]"
            style={{
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              fontFamily: theme.font,
            }}
          >
            {/* Logo */}
            {theme.logo && (
              <div className="p-4 flex justify-center border-b" style={{ borderColor: theme.colors.primary + '20' }}>
                <img src={theme.logo} alt="Logo" className="h-12 object-contain" />
              </div>
            )}

            {/* Media */}
            {step.media.type !== 'none' && step.media.url && (
              <div className="aspect-video bg-muted">
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
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold break-words" style={{ color: theme.colors.text }}>
                {step.title || 'Titre de l\'étape'}
              </h2>
              
              {step.description && (
                <p className="text-base opacity-80 break-words whitespace-pre-line">
                  {step.description}
                </p>
              )}

              {/* Question Options */}
              {step.type === StepType.Question && step.options && (
                <div className="space-y-2 mt-4">
                  {step.options.map((option) => (
                    <button
                      key={option.id}
                      className="w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all hover:scale-[1.02] break-words whitespace-normal text-sm sm:text-base"
                      style={{
                        borderColor: theme.colors.primary,
                        backgroundColor: 'transparent',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}
                    >
                      <span className="block">{option.text || 'Option de réponse'}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Lead Capture */}
              {step.type === StepType.LeadCapture && (
                <div className="space-y-3 mt-4">
                  {step.fields?.includes('name') && (
                    <input
                      type="text"
                      placeholder="Nom complet"
                      className="w-full p-3 rounded-lg border"
                      style={{ borderColor: theme.colors.primary }}
                    />
                  )}
                  {step.fields?.includes('email') && (
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full p-3 rounded-lg border"
                      style={{ borderColor: theme.colors.primary }}
                    />
                  )}
                  {step.fields?.includes('phone') && (
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      className="w-full p-3 rounded-lg border"
                      style={{ borderColor: theme.colors.primary }}
                    />
                  )}
                </div>
              )}

              {/* CTA Button */}
              <button
                className="w-full py-3 px-6 rounded-lg font-semibold transition-all hover:scale-[1.02] mt-6"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.buttonText,
                }}
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}