import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { funnelService } from '@/services/funnelService';
import { QuizStep, QuizConfig, StepType } from '@/types/funnel';
import { useAnalytics } from '@/hooks/useAnalytics';
import { WelcomeScreen } from '@/components/player/WelcomeScreen';
import { QuestionScreen } from '@/components/player/QuestionScreen';
import { MessageScreen } from '@/components/player/MessageScreen';
import { LeadCaptureScreen } from '@/components/player/LeadCaptureScreen';
import { CalendarEmbedScreen } from '@/components/player/CalendarEmbedScreen';
import { toast } from '@/hooks/use-toast';

export default function FunnelPlayer() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [funnelId, setFunnelId] = useState<string>('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const { trackStepEnter, trackStepLeave, saveSession } = useAnalytics(funnelId);

  useEffect(() => {
    loadFunnel();
  }, [shareToken]);

  const loadFunnel = async () => {
    if (!shareToken) {
      navigate('/404');
      return;
    }

    try {
      const funnel = await funnelService.getByShareToken(shareToken);
      setFunnelId(funnel.id);
      setConfig(funnel.config);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Funnel introuvable ou inactif',
        variant: 'destructive'
      });
      navigate('/404');
    }
  };

  useEffect(() => {
    if (config && config.steps[currentStepIndex]) {
      const step = config.steps[currentStepIndex];
      trackStepEnter(step.id, step.type);
    }
  }, [currentStepIndex, config]);

  const handleNext = (answer?: any) => {
    const currentStep = config!.steps[currentStepIndex];
    
    // Track step leave
    trackStepLeave(currentStep.id, !!answer, answer);

    // Save answer
    if (answer !== undefined) {
      setAnswers(prev => ({ ...prev, [currentStep.id]: answer }));
      
      // Update score for questions
      if (currentStep.type === StepType.Question && typeof answer?.score === 'number') {
        setScore(prev => prev + answer.score);
      }
    }

    // Navigate to next step
    if (currentStepIndex < config!.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Funnel completed
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await saveSession(true, score);
    toast({
      title: 'Merci !',
      description: 'Votre réponse a été enregistrée'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!config || !config.steps[currentStepIndex]) {
    return null;
  }

  const currentStep = config.steps[currentStepIndex];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: config.theme.colors.background,
        color: config.theme.colors.text,
        fontFamily: config.theme.font
      }}
    >
      <div className="w-full max-w-2xl">
        {currentStep.type === StepType.Welcome && (
          <WelcomeScreen step={currentStep} theme={config.theme} onNext={handleNext} />
        )}
        {currentStep.type === StepType.Question && (
          <QuestionScreen step={currentStep} theme={config.theme} onNext={handleNext} />
        )}
        {currentStep.type === StepType.Message && (
          <MessageScreen step={currentStep} theme={config.theme} onNext={handleNext} />
        )}
        {currentStep.type === StepType.LeadCapture && (
          <LeadCaptureScreen 
            step={currentStep} 
            theme={config.theme} 
            funnelId={funnelId}
            answers={answers}
            score={score}
            onNext={handleNext} 
          />
        )}
        {currentStep.type === StepType.CalendarEmbed && (
          <CalendarEmbedScreen step={currentStep} theme={config.theme} onNext={handleNext} />
        )}
      </div>
    </div>
  );
}
