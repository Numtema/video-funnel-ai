import { QuizStep, ThemeConfig, QuestionOption } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';
import { renderMarkdown, cleanProfileTitle } from '@/lib/markdown';

interface QuestionScreenProps {
  step: QuizStep;
  theme: ThemeConfig;
  onNext: (answer: { optionId: string; text: string; score: number }) => void;
}

export function QuestionScreen({ step, theme, onNext }: QuestionScreenProps) {
  const handleOptionClick = (option: QuestionOption) => {
    onNext({
      optionId: option.id,
      text: option.text,
      score: option.score || 0
    });
  };

  const cleanTitle = cleanProfileTitle(step.title);

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 rounded-lg bg-card/50 backdrop-blur">
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

      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center break-words leading-tight px-2">
        {cleanTitle}
      </h2>
      
      {step.description && (
        <div className="text-sm sm:text-base text-center text-muted-foreground break-words px-2 leading-relaxed">
          {renderMarkdown(step.description)}
        </div>
      )}

      <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
        {step.options?.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleOptionClick(option)}
            variant="outline"
            size="lg"
            className="w-full justify-start text-left h-auto py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 hover:scale-[1.02] transition-transform"
            style={{
              borderColor: theme.colors.primary,
            }}
          >
            <span className="text-xs sm:text-sm md:text-base leading-snug sm:leading-relaxed break-words whitespace-normal block w-full" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
              {renderMarkdown(option.text)}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
