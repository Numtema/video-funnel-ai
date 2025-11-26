import { QuizStep, ThemeConfig } from '@/types/funnel';

interface CalendarEmbedScreenProps {
  step: QuizStep;
  theme: ThemeConfig;
  onNext: () => void;
}

export function CalendarEmbedScreen({ step }: CalendarEmbedScreenProps) {
  return (
    <div className="space-y-6 p-8 rounded-lg bg-card/50 backdrop-blur max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">{step.title}</h2>
        {step.description && (
          <p className="text-muted-foreground mt-2">{step.description}</p>
        )}
      </div>

      {step.embedCode ? (
        <div 
          className="w-full min-h-[700px] rounded-lg overflow-hidden bg-background shadow-lg"
          dangerouslySetInnerHTML={{ __html: step.embedCode }}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Aucun calendrier configuré</p>
          <p className="text-sm mt-2">Ajoutez votre code d'intégration Calendly dans l'éditeur</p>
        </div>
      )}
    </div>
  );
}
