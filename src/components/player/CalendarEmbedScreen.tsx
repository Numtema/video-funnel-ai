import { QuizStep, ThemeConfig } from '@/types/funnel';

interface CalendarEmbedScreenProps {
  step: QuizStep;
  theme: ThemeConfig;
  onNext: () => void;
}

export function CalendarEmbedScreen({ step }: CalendarEmbedScreenProps) {
  return (
    <div className="space-y-6 p-8 rounded-lg bg-card/50 backdrop-blur">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold">{step.title}</h2>
        {step.description && (
          <p className="text-muted-foreground mt-2">{step.description}</p>
        )}
      </div>

      {step.embedCode ? (
        <div 
          className="w-full min-h-[600px]"
          dangerouslySetInnerHTML={{ __html: step.embedCode }}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Aucun calendrier configuré
        </div>
      )}
    </div>
  );
}
