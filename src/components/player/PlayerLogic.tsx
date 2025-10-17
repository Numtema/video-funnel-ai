import { QuizConfig, QuizStep, StepType } from '@/types/funnel';

export function getNextStep(
  currentStepId: string, 
  answer: any, 
  config: QuizConfig, 
  score: number
): string | null {
  const currentStep = config.steps.find(s => s.id === currentStepId);
  if (!currentStep) return null;
  
  // 1. Check answer-specific nextStepId (for options)
  if (currentStep.type === StepType.Question && currentStep.options) {
    const selectedOption = currentStep.options.find(o => o.id === answer?.optionId);
    if (selectedOption?.nextStepId) {
      return selectedOption.nextStepId;
    }
  }

  // 2. Check step-level nextStepId
  if (currentStep.nextStepId) {
    return currentStep.nextStepId;
  }

  // 3. Check scoring-based routing (after LeadCapture)
  if (config.scoring?.enabled && currentStep.type === StepType.LeadCapture) {
    if (score >= (config.scoring.threshold || 0) && config.scoring.highScoreStepId) {
      return config.scoring.highScoreStepId;
    } else if (score < (config.scoring.threshold || 0) && config.scoring.lowScoreStepId) {
      return config.scoring.lowScoreStepId;
    }
  }

  // 4. Default: next step in array
  const currentIndex = config.steps.findIndex(s => s.id === currentStepId);
  if (currentIndex < config.steps.length - 1) {
    return config.steps[currentIndex + 1].id;
  }

  return null; // End of funnel
}

export function calculateProgress(currentStepIndex: number, totalSteps: number): number {
  return Math.round(((currentStepIndex + 1) / totalSteps) * 100);
}

export function getStepIndexById(stepId: string, steps: QuizStep[]): number {
  return steps.findIndex(s => s.id === stepId);
}
