import { QuizStep, ThemeConfig, QuizConfig } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { ArrowRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';

interface WelcomeScreenProps {
  step: QuizStep;
  theme: ThemeConfig;
  socialLinks?: QuizConfig['socialLinks'];
  onNext: () => void;
}

export function WelcomeScreen({ step, theme, socialLinks, onNext }: WelcomeScreenProps) {
  return (
    <div className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 rounded-lg bg-card/50 backdrop-blur">
      {step.media.type === 'image' && step.media.url && (
        <img 
          src={step.media.url} 
          alt={step.title}
          className="w-full max-h-64 sm:max-h-80 md:max-h-96 object-cover rounded-lg mb-4 sm:mb-6"
        />
      )}
      {step.media.type === 'video' && step.media.url && (
        <>
          {isYouTubeUrl(step.media.url) ? (
            <div className="relative w-full mb-4 sm:mb-6" style={{ paddingBottom: '56.25%', maxHeight: '350px' }}>
              <iframe
                src={getYouTubeEmbedUrl(step.media.url) || ''}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video 
              src={step.media.url} 
              controls
              className="w-full max-h-64 sm:max-h-80 md:max-h-96 rounded-lg mb-4 sm:mb-6"
            />
          )}
        </>
      )}

      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 break-words leading-tight px-2">{step.title}</h1>
      
      {step.description && (
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto break-words px-3 leading-relaxed">
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
        className="mt-6 sm:mt-8 hover-scale"
      >
        Commencer
        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      {/* Social links */}
      {socialLinks && (
        <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover-scale">
              <Facebook className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.colors.primary }} />
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover-scale">
              <Twitter className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.colors.primary }} />
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover-scale">
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.colors.primary }} />
            </a>
          )}
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover-scale">
              <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.colors.primary }} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
