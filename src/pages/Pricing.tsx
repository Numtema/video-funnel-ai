import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: '0€',
    period: '/mois',
    description: 'Pour tester et démarrer',
    features: [
      '3 funnels actifs',
      '50 générations IA/mois',
      'Analytics basiques',
      'Support email',
    ],
    stripeUrl: null,
    highlighted: false,
  },
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
    stripeUrl: 'https://buy.stripe.com/6oUcN5bHOeDX4GfaBc6J208',
    highlighted: false,
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
    stripeUrl: 'https://buy.stripe.com/28E9ATaDKcvP2y724G6J209',
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
    stripeUrl: null,
    highlighted: false,
    contact: true,
  },
];

export default function Pricing() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = (stripeUrl: string | null, planName: string) => {
    if (!stripeUrl) {
      if (planName === 'Enterprise') {
        window.location.href = 'mailto:contact@numtema.com?subject=Demande Enterprise Plan';
      } else {
        toast({
          title: 'Plan actuel',
          description: 'Vous êtes déjà sur le plan gratuit',
        });
      }
      return;
    }

    // Ouvrir directement le lien Stripe
    window.open(stripeUrl, '_blank');
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Tarifs</h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-2">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
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
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.stripeUrl, plan.name)}
                  disabled={plan.name === 'Free'}
                >
                  {plan.name === 'Free'
                    ? 'Plan actuel'
                    : plan.contact
                      ? 'Nous contacter'
                      : 'Souscrire'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
