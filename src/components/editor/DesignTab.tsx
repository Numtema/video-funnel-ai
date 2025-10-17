import { QuizStep } from '@/types/funnel';
import { Label } from '@/components/ui/label';

interface DesignTabProps {
  step: QuizStep;
  onUpdate: (step: QuizStep) => void;
}

export function DesignTab({ step, onUpdate }: DesignTabProps) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>Options de design prochainement disponibles</p>
      <p className="text-sm mt-2">Les styles globaux s'appliquent automatiquement</p>
    </div>
  );
}