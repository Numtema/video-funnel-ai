import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  Sparkles, 
  BarChart3, 
  Share2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

export const OnboardingModal = ({ open, onComplete }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps: OnboardingStep[] = [
    {
      title: 'Bienvenue sur Nümtema Face ! 🎉',
      description: 'Créez des funnels interactifs intelligents avec l\'IA générative. Transformez vos visiteurs en clients qualifiés grâce à des expériences immersives.',
      icon: <Rocket className="w-16 h-16 text-primary" />,
    },
    {
      title: 'Créez votre premier funnel',
      description: 'Utilisez l\'IA pour générer automatiquement votre funnel complet : questions, messages, design et médias. En quelques clics, votre expérience interactive est prête.',
      icon: <Sparkles className="w-16 h-16 text-accent" />,
      action: {
        label: 'Créer maintenant',
        onClick: () => {
          onComplete();
          navigate('/funnels');
        },
      },
    },
    {
      title: 'Analysez vos performances',
      description: 'Suivez en temps réel vos conversions, le comportement de vos visiteurs, et identifiez les points d\'optimisation pour maximiser vos résultats.',
      icon: <BarChart3 className="w-16 h-16 text-success" />,
      action: {
        label: 'Voir les analytics',
        onClick: () => {
          onComplete();
          navigate('/analytics');
        },
      },
    },
    {
      title: 'Partagez et convertissez',
      description: 'Publiez votre funnel en un clic et partagez-le avec votre audience. Collectez des leads qualifiés et recevez des notifications en temps réel.',
      icon: <Share2 className="w-16 h-16 text-primary" />,
    },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-2xl font-bold">
              Guide de démarrage
            </DialogTitle>
            <span className="text-sm text-muted-foreground">
              Étape {currentStep + 1} sur {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </DialogHeader>

        <div className="py-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="p-4 bg-muted rounded-full">
              {currentStepData.icon}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">{currentStepData.title}</h3>
              <DialogDescription className="text-base leading-relaxed max-w-lg">
                {currentStepData.description}
              </DialogDescription>
            </div>

            {currentStepData.action && (
              <Button
                onClick={currentStepData.action.onClick}
                size="lg"
                className="mt-4"
              >
                {currentStepData.action.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Passer le guide
          </Button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
            )}
            
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Terminer
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
