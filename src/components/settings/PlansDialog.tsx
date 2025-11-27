import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    price: '29€',
    period: '/mois',
    description: 'Pour les petites entreprises',
    features: [
      '10 funnels actifs',
      '200 générations IA/mois',
      'Analytics avancées',
      'Webhooks illimités',
      'Support prioritaire',
    ],
    priceId: 'price_1SXrjmIo2oYoHceFtI0kBmVL',
  },
  {
    name: 'Pro',
    price: '79€',
    period: '/mois',
    description: 'Pour les professionnels',
    features: [
      'Funnels illimités',
      '1000 générations IA/mois',
      'Analytics complètes + Export',
      'Webhooks + API',
      'Templates personnalisés',
      'Support prioritaire',
      'Domaine personnalisé',
    ],
    priceId: 'price_1SXrkxIo2oYoHceFyNjl85Lb',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Sur mesure',
    period: '',
    description: 'Pour les grandes organisations',
    features: [
      'Tout du plan Pro',
      'Générations IA illimitées',
      'Support dédié',
      'SLA garanti',
      'Formation personnalisée',
      'Intégrations sur mesure',
    ],
    priceId: null,
    contact: true,
  },
];

interface PlansDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlansDialog({ open, onOpenChange }: PlansDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      if (planName === 'Enterprise') {
        window.open('mailto:contact@numtema.com?subject=Enterprise Plan Inquiry', '_blank');
      }
      return;
    }

    setLoading(planName);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Connexion requise',
          description: 'Veuillez vous connecter pour souscrire à un plan',
          variant: 'destructive',
        });
        setLoading(null);
        return;
      }

      const { data, error } = await supabase.functions.invoke('stripe-create-checkout', {
        body: { priceId, planName: planName.toLowerCase() },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('Aucune URL de paiement reçue');
      }
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de créer la session de paiement',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choisissez votre plan</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={plan.highlighted ? 'border-primary shadow-lg' : ''}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.highlighted && (
                    <Badge variant="default">Populaire</Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.priceId, plan.name)}
                  disabled={loading === plan.name}
                >
                  {plan.contact 
                    ? 'Nous contacter'
                    : loading === plan.name 
                      ? 'Chargement...' 
                      : 'Souscrire'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
