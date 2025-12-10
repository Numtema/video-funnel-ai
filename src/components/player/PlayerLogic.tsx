import { QuizConfig, QuizStep, StepType, StepVariant, ScoreSegment } from '@/types/funnel';

// Sélectionne une variante A/B basée sur les poids
export function selectVariant(step: QuizStep, sessionId: string): StepVariant | null {
  if (!step.abTestEnabled || !step.variants || step.variants.length === 0) {
    return null;
  }

  // Utiliser le sessionId pour avoir une sélection consistante par session
  const hash = sessionId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  const random = Math.abs(hash % 100);

  // Calculer les poids cumulatifs
  let cumulative = 0;
  for (const variant of step.variants) {
    cumulative += variant.weight;
    if (random < cumulative) {
      return variant;
    }
  }

  // Fallback: retourner la première variante
  return step.variants[0];
}

// Applique une variante à un step
export function applyVariant(step: QuizStep, variant: StepVariant | null): QuizStep {
  if (!variant) return step;

  return {
    ...step,
    title: variant.title || step.title,
    description: variant.description || step.description,
    buttonText: variant.buttonText || step.buttonText,
    media: variant.media || step.media,
    options: variant.options || step.options,
  };
}

// Trouve le segment correspondant au score
export function findSegment(score: number, segments: ScoreSegment[]): ScoreSegment | null {
  if (!segments || segments.length === 0) return null;

  // Trier par minScore décroissant pour trouver le bon segment
  const sortedSegments = [...segments].sort((a, b) => b.minScore - a.minScore);

  for (const segment of sortedSegments) {
    if (score >= segment.minScore && score <= segment.maxScore) {
      return segment;
    }
  }

  // Fallback: trouver le segment le plus proche
  for (const segment of sortedSegments) {
    if (score >= segment.minScore) {
      return segment;
    }
  }

  return segments[segments.length - 1]; // Dernier segment par défaut
}

// Détermine la prochaine étape avec routing avancé
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

  // 3. Check segment-based routing (après LeadCapture ou dernière question)
  if (config.scoring?.enabled && config.scoring.segments && config.scoring.segments.length > 0) {
    // Appliquer le routing par segment après LeadCapture
    if (currentStep.type === StepType.LeadCapture) {
      const segment = findSegment(score, config.scoring.segments);
      if (segment?.nextStepId) {
        return segment.nextStepId;
      }
    }
  }

  // 4. Legacy scoring-based routing (after LeadCapture)
  if (config.scoring?.enabled && currentStep.type === StepType.LeadCapture) {
    if (score >= (config.scoring.threshold || 0) && config.scoring.highScoreStepId) {
      return config.scoring.highScoreStepId;
    } else if (score < (config.scoring.threshold || 0) && config.scoring.lowScoreStepId) {
      return config.scoring.lowScoreStepId;
    }
  }

  // 5. Default: next step in array
  const currentIndex = config.steps.findIndex(s => s.id === currentStepId);
  if (currentIndex < config.steps.length - 1) {
    return config.steps[currentIndex + 1].id;
  }

  return null; // End of funnel
}

// Calcul de la redirection basée sur le segment
export function getSegmentRedirect(
  score: number,
  config: QuizConfig
): { url: string; type: string; message?: string } | null {
  if (!config.scoring?.enabled || !config.scoring.segments) {
    return null;
  }

  const segment = findSegment(score, config.scoring.segments);
  if (!segment || !segment.redirectUrl || segment.redirectType === 'none') {
    return null;
  }

  return {
    url: segment.redirectUrl,
    type: segment.redirectType || 'website',
    message: segment.customMessage
  };
}

export function calculateProgress(currentStepIndex: number, totalSteps: number): number {
  return Math.round(((currentStepIndex + 1) / totalSteps) * 100);
}

export function getStepIndexById(stepId: string, steps: QuizStep[]): number {
  return steps.findIndex(s => s.id === stepId);
}

// Calcule le score maximum possible
export function calculateMaxScore(config: QuizConfig): number {
  let maxScore = 0;
  for (const step of config.steps) {
    if (step.type === StepType.Question && step.options) {
      const maxOptionScore = Math.max(...step.options.map(o => o.score || 0));
      maxScore += maxOptionScore;
    }
  }
  return maxScore;
}

// Génère les segments par défaut
export function generateDefaultSegments(maxScore: number): ScoreSegment[] {
  const third = Math.floor(maxScore / 3);

  return [
    {
      id: 'segment-beginner',
      name: 'beginner',
      label: 'Débutant',
      minScore: 0,
      maxScore: third,
      color: '#EF4444', // Red
    },
    {
      id: 'segment-intermediate',
      name: 'intermediate',
      label: 'Intermédiaire',
      minScore: third + 1,
      maxScore: third * 2,
      color: '#F59E0B', // Orange
    },
    {
      id: 'segment-expert',
      name: 'expert',
      label: 'Expert',
      minScore: third * 2 + 1,
      maxScore: maxScore,
      color: '#10B981', // Green
    }
  ];
}
