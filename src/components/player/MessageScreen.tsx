import { QuizStep, ThemeConfig } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';
import { renderMarkdown, cleanProfileTitle } from '@/lib/markdown';

interface MessageScreenProps {
  step: QuizStep;
  theme: ThemeConfig;
  onNext: () => void;
}

export function MessageScreen({ step, theme, onNext }: MessageScreenProps) {
  const cleanTitle = cleanProfileTitle(step.title);
  
  return (
    <div className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 rounded-lg bg-card/50 backdrop-blur">
      {step.media.type === 'image' && step.media.url && (
        <img 
          src={step.media.url} 
          alt={cleanTitle}
          className="w-full max-h-48 sm:max-h-64 object-cover rounded-lg mb-3 sm:mb-4"
        />
      )}
      
      {step.media.type === 'video' && step.media.url && (
        <>
          {isYouTubeUrl(step.media.url) ? (
            <div className="relative w-full mb-3 sm:mb-4" style={{ paddingBottom: '56.25%', maxHeight: '250px' }}>
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
              className="w-full max-h-48 sm:max-h-64 rounded-lg mb-3 sm:mb-4"
            />
          )}
        </>
      )}

      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold break-words leading-tight px-2">
        {cleanTitle}
      </h2>
      
      {step.description && (
        <div className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto break-words px-3 leading-relaxed text-left">
          {renderMarkdown(step.description)}
        </div>
      )}

      <Button 
        size="lg"
        onClick={onNext}
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.colors.buttonText
        }}
        className="mt-4 sm:mt-6"
      >
        Continuer
        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
}
