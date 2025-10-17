import { QuizStep, ThemeConfig, QuizConfig } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { ArrowRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface WelcomeScreenProps {
  step: QuizStep;
  theme: ThemeConfig;
  socialLinks?: QuizConfig['socialLinks'];
  onNext: () => void;
}

export function WelcomeScreen({ step, theme, socialLinks, onNext }: WelcomeScreenProps) {
  return (
    <div className="text-center space-y-6 p-8 rounded-lg bg-card/50 backdrop-blur">
      {step.media.type === 'image' && step.media.url && (
        <img 
          src={step.media.url} 
          alt={step.title}
          className="w-full max-h-96 object-cover rounded-lg mb-6"
        />
      )}
      {step.media.type === 'video' && step.media.url && (
        <video 
          src={step.media.url} 
          controls
          className="w-full max-h-96 rounded-lg mb-6"
        />
      )}

      <h1 className="text-4xl font-bold mb-4">{step.title}</h1>
      
      {step.description && (
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
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
        className="mt-8 hover-scale"
      >
        Commencer
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      {/* Social links */}
      {socialLinks && (
        <div className="flex justify-center gap-4 mt-8">
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover-scale">
              <Facebook className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover-scale">
              <Twitter className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover-scale">
              <Instagram className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </a>
          )}
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover-scale">
              <Linkedin className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
