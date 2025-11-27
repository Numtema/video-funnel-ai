import { QuizStep, ThemeConfig } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';

interface MessageScreenProps {
  step: QuizStep;
  theme: ThemeConfig;
  onNext: () => void;
}

export function MessageScreen({ step, theme, onNext }: MessageScreenProps) {
  return (
    <div className="text-center space-y-6 p-8 rounded-lg bg-card/50 backdrop-blur">
      {step.media.type === 'image' && step.media.url && (
        <img 
          src={step.media.url} 
          alt={step.title}
          className="w-full max-h-64 object-cover rounded-lg mb-4"
        />
      )}
      
      {step.media.type === 'video' && step.media.url && (
        <>
          {isYouTubeUrl(step.media.url) ? (
            <div className="relative w-full mb-4" style={{ paddingBottom: '56.25%', maxHeight: '300px' }}>
              <iframe
                src={getYouTubeEmbedUrl(step.media.url) || ''}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video 
              src={step.media.url} 
              controls
              className="w-full max-h-64 rounded-lg mb-4"
            />
          )}
        </>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold break-words">{step.title}</h2>
      
      {step.description && (
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto whitespace-pre-line break-words px-2">
          {step.description}
        </p>
      )}

      <Button 
        size="lg"
        onClick={onNext}
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.colors.buttonText
        }}
        className="mt-6"
      >
        Continuer
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
