import { useState } from 'react';
import { QuizStep, ThemeConfig } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface LeadCaptureScreenProps {
  step: QuizStep;
  theme: ThemeConfig;
  funnelId: string;
  answers: Record<string, any>;
  score: number;
  onNext: (data: any) => void;
}

export function LeadCaptureScreen({ step, theme, funnelId, answers, score, onNext }: LeadCaptureScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      toast({
        title: 'Erreur',
        description: 'L\'email est requis',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    try {
      await onNext({ name, email, phone, subscribed: false });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi',
        variant: 'destructive'
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-8 rounded-lg bg-card/50 backdrop-blur">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">{step.title}</h2>
        {step.description && (
          <p className="text-muted-foreground mt-2">{step.description}</p>
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
