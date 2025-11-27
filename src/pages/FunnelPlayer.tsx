import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { funnelService } from '@/services/funnelService';
import { submissionService } from '@/services/submissionService';
import { QuizStep, QuizConfig, StepType } from '@/types/funnel';
import { useAnalytics } from '@/hooks/useAnalytics';
import { getNextStep, calculateProgress, getStepIndexById } from '@/components/player/PlayerLogic';
import { WelcomeScreen } from '@/components/player/WelcomeScreen';
import { QuestionScreen } from '@/components/player/QuestionScreen';
import { MessageScreen } from '@/components/player/MessageScreen';
import { LeadCaptureScreen } from '@/components/player/LeadCaptureScreen';
import { CalendarEmbedScreen } from '@/components/player/CalendarEmbedScreen';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import logo from '@/assets/logo.svg';

export default function FunnelPlayer() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [funnelId, setFunnelId] = useState<string>('');
  const [currentStepId, setCurrentStepId] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [stepHistory, setStepHistory] = useState<string[]>([]);

  const { sessionId, trackStepEnter, trackStepLeave, saveSession } = useAnalytics(funnelId);

  useEffect(() => {
    loadFunnel();
  }, [shareToken]);

  const loadFunnel = async () => {
    if (!shareToken) {
      setLoading(false);
      return;
    }

    try {
      const funnel = await funnelService.getByShareToken(shareToken);
      setFunnelId(funnel.id);
      setConfig(funnel.config);
      if (funnel.config.steps.length > 0) {
        setCurrentStepId(funnel.config.steps[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Funnel loading error:', error);
      setLoading(false);
      toast({
        title: 'Erreur',
        description: 'Funnel introuvable ou inactif',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (config && currentStepId) {
      const step = config.steps.find(s => s.id === currentStepId);
      if (step) {
        trackStepEnter(step.id, step.type);
      }
    }
  }, [currentStepId, config]);

  const handleNext = async (answer?: any) => {
    if (!config) return;
    
    const currentStep = config.steps.find(s => s.id === currentStepId);
    if (!currentStep) return;
    
    // Track step leave
    trackStepLeave(currentStep.id, !!answer, answer);

    // Save answer and update score
    let newScore = score;
    if (answer !== undefined) {
      setAnswers(prev => ({ ...prev, [currentStep.id]: answer }));
      
      if (currentStep.type === StepType.Question && typeof answer?.score === 'number') {
        newScore = score + answer.score;
        setScore(newScore);
      }
    }

    // Handle lead capture submission
    if (currentStep.type === StepType.LeadCapture && answer) {
      try {
        const completionTime = Math.floor((Date.now() - startTime) / 1000);
        await submissionService.submit({
          funnelId,
          sessionId,
          answers,
          contact: {
            name: answer.name,
            email: answer.email,
            phone: answer.phone,
            subscribed: answer.subscribed || false
          },
          score: newScore,
          completionTime
        });
      } catch (error) {
        console.error('Submission error:', error);
      }
    }

    // Get next step using conditional logic
    const nextStepId = getNextStep(currentStep.id, answer, config, newScore);
    
    if (nextStepId) {
      setStepHistory(prev => [...prev, currentStepId]);
      setCurrentStepId(nextStepId);
    } else {
      // Funnel completed
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (stepHistory.length > 0) {
      const previousStepId = stepHistory[stepHistory.length - 1];
      setStepHistory(prev => prev.slice(0, -1));
      setCurrentStepId(previousStepId);
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

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-3xl font-bold text-foreground">Funnel introuvable</h1>
          <p className="text-muted-foreground">Ce funnel n'existe pas ou n'est pas publié.</p>
          <a 
            href="/" 
            className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  const currentStep = config.steps.find(s => s.id === currentStepId);
  if (!currentStep) return null;

  const currentStepIndex = getStepIndexById(currentStepId, config.steps);
  const progress = calculateProgress(currentStepIndex, config.steps.length);

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: config.theme.colors.background,
        color: config.theme.colors.text,
        fontFamily: config.theme.font
      }}
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div 
          className="h-full transition-all duration-500 ease-out"
          style={{ 
            width: `${progress}%`,
            backgroundColor: config.theme.colors.primary 
          }}
        />
      </div>

      {/* Back button */}
      {stepHistory.length > 0 && (
        <div className="fixed top-4 left-4 z-40">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="backdrop-blur-sm bg-background/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      )}

      {/* Logo */}
      {config.theme.logo && (
        <div className="pt-8 pb-4 flex justify-center">
          <img src={config.theme.logo} alt="Logo" className="h-16 object-contain" />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-8">
        <div className="w-full max-w-2xl animate-fade-in">
          {currentStep.type === StepType.Welcome && (
            <WelcomeScreen 
              step={currentStep} 
              theme={config.theme} 
              onNext={handleNext}
              socialLinks={config.socialLinks}
            />
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
              config={config}
            />
          )}
          {currentStep.type === StepType.CalendarEmbed && (
            <CalendarEmbedScreen step={currentStep} theme={config.theme} onNext={handleNext} />
          )}
        </div>
      </div>

      {/* Branding footer */}
      <div className="py-4 text-center text-sm text-muted-foreground backdrop-blur-sm bg-background/30">
        <div className="flex items-center justify-center gap-2">
          <span>Powered by</span>
          <img src={logo} alt="Nümtema Face" className="h-5" />
        </div>
      </div>
    </div>
  );
}
