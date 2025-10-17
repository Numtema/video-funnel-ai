import { QuizStep, ThemeConfig } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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

      <h2 className="text-3xl font-bold">{step.title}</h2>
      
      {step.description && (
        <p className="text-lg text-muted-foreground max-w-xl mx-auto whitespace-pre-line">
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
