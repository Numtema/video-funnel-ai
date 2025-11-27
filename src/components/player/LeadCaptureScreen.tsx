import { useState } from 'react';
import { QuizStep, ThemeConfig, QuizConfig } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Send, MessageCircle } from 'lucide-react';
import { leadCaptureSchema } from '@/lib/validation';

interface LeadCaptureScreenProps {
  step: QuizStep;
  theme: ThemeConfig;
  funnelId: string;
  answers: Record<string, any>;
  score: number;
  onNext: (data: any) => void;
  config?: QuizConfig;
}

export function LeadCaptureScreen({ step, theme, funnelId, answers, score, onNext, config }: LeadCaptureScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input data with zod
    const validationResult = leadCaptureSchema.safeParse({
      name: name.trim() || undefined,
      email: email.trim(),
      phone: phone.trim() || undefined,
    });
    
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || 'Données invalides';
      toast({
        title: 'Erreur de validation',
        description: firstError,
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    try {
      const validatedData = validationResult.data;
      await onNext({ 
        name: validatedData.name || '', 
        email: validatedData.email, 
        phone: validatedData.phone || '', 
        subscribed: false 
      });
      setSubmitted(true);
    } catch (error) {
      console.error('❌ LeadCaptureScreen: Submission error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi',
        variant: 'destructive'
      });
      setSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!config?.whatsapp?.phoneNumber) return;
    
    // Sanitize phone number (remove non-digits)
    const cleanPhone = config.whatsapp.phoneNumber.replace(/\D/g, '');
    if (!cleanPhone) return;
    
    // Sanitize and limit message length
    const message = config.whatsapp.message || `Bonjour, je viens de compléter le formulaire ${step.title}`;
    const truncatedMessage = message.substring(0, 500); // WhatsApp message limit
    const encodedMessage = encodeURIComponent(truncatedMessage);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (submitted) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 rounded-lg bg-card/50 backdrop-blur text-center">
        <div className="mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Send className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 px-2">Merci !</h2>
          <p className="text-sm sm:text-base text-muted-foreground px-3">
            Vos informations ont été envoyées avec succès.
          </p>
        </div>

        {config?.whatsapp?.enabled && config.whatsapp.phoneNumber && (
          <Button
            onClick={handleWhatsAppClick}
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm sm:text-base"
          >
            <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Continuer sur WhatsApp
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 rounded-lg bg-card/50 backdrop-blur">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold break-words leading-tight px-2">{step.title}</h2>
        {step.description && (
          <p className="text-sm sm:text-base text-muted-foreground mt-2 break-words px-3 leading-relaxed">{step.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {step.fields?.includes('name') && (
          <div>
            <Label htmlFor="name" className="text-sm sm:text-base">Nom complet</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jean Dupont"
              className="mt-1 text-sm sm:text-base"
            />
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jean@example.com"
            className="mt-1 text-sm sm:text-base"
          />
        </div>

        {step.fields?.includes('phone') && (
          <div>
            <Label htmlFor="phone" className="text-sm sm:text-base">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="mt-1 text-sm sm:text-base"
            />
          </div>
        )}

        <Button 
          type="submit"
          disabled={submitting}
          size="lg"
          className="w-full mt-4 sm:mt-6 text-sm sm:text-base"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.buttonText
          }}
        >
          {submitting ? 'Envoi...' : 'Envoyer'}
          <Send className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </form>
    </div>
  );
}
