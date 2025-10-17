import { QuizStep, ThemeConfig, QuestionOption } from '@/types/funnel';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="space-y-6 p-8 rounded-lg bg-card/50 backdrop-blur">
      {step.media.type === 'image' && step.media.url && (
        <img 
          src={step.media.url} 
          alt={step.title}
          className="w-full max-h-64 object-cover rounded-lg mb-4"
        />
      )}

      <h2 className="text-3xl font-bold text-center">{step.title}</h2>
      
      {step.description && (
        <p className="text-center text-muted-foreground">{step.description}</p>
      )}

      <div className="space-y-3 mt-8">
        {step.options?.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleOptionClick(option)}
            variant="outline"
            size="lg"
            className="w-full justify-start text-left h-auto py-4 px-6 hover:scale-[1.02] transition-transform"
            style={{
              borderColor: theme.colors.primary,
            }}
          >
            <span className="text-lg">{option.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
