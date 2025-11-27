import { useState } from 'react';
import { QuizStep, ThemeConfig, QuizConfig } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Send, MessageCircle } from 'lucide-react';

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
    
    console.log('═══════════════════════════════════════════════');
    console.log('🟢 LEAD CAPTURE SCREEN - FORM SUBMIT STARTED');
    console.log('═══════════════════════════════════════════════');
    console.log('📝 Form data:', { name, email, phone });
    console.log('📦 Props received:', { funnelId, score, answersCount: Object.keys(answers).length });
    
    if (!email || !email.trim()) {
      console.log('❌ Validation failed: email is empty');
      toast({
        title: 'Erreur',
        description: 'L\'email est requis',
        variant: 'destructive'
      });
      return;
    }

    console.log('✅ Validation passed, setting submitting state...');
    setSubmitting(true);

    try {
      const submitData = { name, email, phone, subscribed: false };
      console.log('📤 About to call onNext with:', submitData);
      console.log('⏱️ Timestamp:', new Date().toISOString());
      
      await onNext(submitData);
      
      console.log('═══════════════════════════════════════════════');
      console.log('✅ LEAD CAPTURE - ONNEXT COMPLETED SUCCESSFULLY');
      console.log('═══════════════════════════════════════════════');
      setSubmitted(true);
    } catch (error: any) {
      console.log('═══════════════════════════════════════════════');
      console.error('❌❌❌ LEAD CAPTURE - ERROR CAUGHT ❌❌❌');
      console.log('═══════════════════════════════════════════════');
      console.error('Error object:', error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      toast({
        title: 'Erreur de soumission',
        description: error?.message || 'Une erreur est survenue lors de l\'envoi',
        variant: 'destructive'
      });
      setSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!config?.whatsapp?.phoneNumber) return;
    
    const message = config.whatsapp.message || `Bonjour, je viens de compléter le formulaire ${step.title}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${config.whatsapp.phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (submitted) {
    return (
      <div className="space-y-6 p-8 rounded-lg bg-card/50 backdrop-blur text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Merci !</h2>
          <p className="text-muted-foreground">
            Vos informations ont été envoyées avec succès.
          </p>
        </div>

        {config?.whatsapp?.enabled && config.whatsapp.phoneNumber && (
          <Button
            onClick={handleWhatsAppClick}
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Continuer sur WhatsApp
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-8 rounded-lg bg-card/50 backdrop-blur">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold break-words">{step.title}</h2>
        {step.description && (
          <p className="text-muted-foreground mt-2 break-words px-2">{step.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step.fields?.includes('name') && (
          <div>
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jean Dupont"
              className="mt-1"
            />
          </div>
        )}

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jean@example.com"
            className="mt-1"
          />
        </div>

        {step.fields?.includes('phone') && (
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="mt-1"
            />
          </div>
        )}

        <Button 
          type="submit"
          disabled={submitting}
          size="lg"
          className="w-full mt-6"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.buttonText
          }}
        >
          {submitting ? 'Envoi...' : 'Envoyer'}
          <Send className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
