import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Video, Sparkles, TrendingUp, Zap, Users, Shield, Palette, BarChart3, Clock, Rocket, Check, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <Video className="h-16 w-16 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/src/assets/numtema-face-logo.png" alt="Nümtema Face" className="h-8" />
            <span className="font-semibold text-lg">Nümtema Face</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/pricing')}>Tarifs</Button>
            <Button variant="outline" onClick={() => navigate('/auth')}>Connexion</Button>
            <Button onClick={() => navigate('/auth')} className="shadow-elegant">
              Commencer
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-primary">Nouveau • IA Générative</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Nümtema Face
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                Créez des funnels interactifs intelligents avec l'IA générative
              </p>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                La plateforme complète pour transformer vos visiteurs en clients qualifiés grâce à des parcours vidéo personnalisés et intelligents.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={() => navigate('/auth')} className="shadow-elegant text-lg px-8">
                  Commencer Gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/templates')} className="text-lg px-8">
                  Voir les Templates
                </Button>
              </div>
            </div>
            <div className="relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative rounded-2xl overflow-hidden shadow-elegant">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Video className="h-24 w-24 text-primary/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Créez votre premier funnel en 4 étapes simples
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: Palette, title: 'Créer', desc: 'Choisissez un template ou créez depuis zéro' },
              { step: '02', icon: Sparkles, title: 'Personnaliser', desc: 'Ajoutez vos médias et générez du contenu IA' },
              { step: '03', icon: Rocket, title: 'Partager', desc: 'Publiez et partagez votre funnel en un clic' },
              { step: '04', icon: BarChart3, title: 'Analyser', desc: 'Suivez les performances en temps réel' },
            ].map((item, i) => (
              <Card key={i} className="relative hover:shadow-elegant transition-smooth animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="text-6xl font-bold text-primary/10 mb-2">{item.step}</div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète pour créer des expériences inoubliables
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Video, title: 'Funnels Vidéo Interactifs', desc: 'Créez des expériences immersives avec vidéos, images et audio générés par IA' },
              { icon: Sparkles, title: 'IA Générative Intégrée', desc: 'Générez du contenu, des médias et des analyses avec l\'intelligence artificielle' },
              { icon: TrendingUp, title: 'Analytics Avancées', desc: 'Suivez les performances en temps réel et optimisez vos conversions' },
              { icon: Users, title: 'Lead Capture Intelligent', desc: 'Qualifiez et capturez vos prospects avec des formulaires intelligents' },
              { icon: Shield, title: 'Sécurité & Conformité', desc: 'Données sécurisées et conformes RGPD hébergées en Europe' },
              { icon: Zap, title: 'Intégrations Natives', desc: 'Connectez vos outils favoris : CRM, email, calendrier, paiement' },
              { icon: Palette, title: 'Personnalisation Totale', desc: 'Marque blanche complète avec vos couleurs, logo et domaine' },
              { icon: Clock, title: 'Déploiement Instantané', desc: 'Publiez et partagez vos funnels en quelques clics seulement' },
            ].map((feature, i) => (
              <Card key={i} className="hover:shadow-elegant transition-smooth animate-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-elegant">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="animate-scale-in">
                  <div className="text-5xl md:text-6xl font-bold text-primary mb-2">50+</div>
                  <p className="text-lg text-muted-foreground">Générations IA gratuites par mois</p>
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                  <div className="text-5xl md:text-6xl font-bold text-accent mb-2">3</div>
                  <p className="text-lg text-muted-foreground">Funnels actifs sur le plan gratuit</p>
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  <div className="text-5xl md:text-6xl font-bold text-success mb-2">∞</div>
                  <p className="text-lg text-muted-foreground">Possibilités créatives</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez ce que nos utilisateurs pensent de Nümtema Face
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sophie Martin', role: 'Coach Business', company: 'SM Coaching', text: 'Nümtema Face a transformé ma génération de leads. Je capture 3x plus de prospects qualifiés qu\'avant.' },
              { name: 'Thomas Dubois', role: 'Fondateur', company: 'Digital Academy', text: 'L\'IA générative me fait gagner des heures sur la création de contenu. Incroyablement puissant.' },
              { name: 'Marie Lefebvre', role: 'Consultante Marketing', company: 'ML Consulting', text: 'Les analytics en temps réel me permettent d\'optimiser mes funnels en continu. ROI exceptionnel.' },
            ].map((testimonial, i) => (
              <Card key={i} className="hover:shadow-elegant transition-smooth animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role} • {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Tarifs simples et transparents</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Free', price: '0€', period: '/mois', features: ['3 funnels actifs', '50 générations IA/mois', 'Analytics de base', 'Support communautaire'] },
              { name: 'Starter', price: '29€', period: '/mois', features: ['10 funnels actifs', '200 générations IA/mois', 'Analytics avancées', 'Support email', 'Domaine personnalisé'], popular: true },
              { name: 'Pro', price: '79€', period: '/mois', features: ['Funnels illimités', '1000 générations IA/mois', 'Analytics premium', 'Support prioritaire', 'Marque blanche', 'API access'] },
            ].map((plan, i) => (
              <Card key={i} className={`relative hover:shadow-elegant transition-smooth animate-scale-in ${plan.popular ? 'border-primary border-2' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Populaire
                  </div>
                )}
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/pricing')}
                  >
                    {plan.name === 'Free' ? 'Commencer' : 'Choisir ce plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="link" onClick={() => navigate('/pricing')}>
              Voir tous les détails des plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Questions fréquentes</h2>
            <p className="text-xl text-muted-foreground">
              Tout ce que vous devez savoir sur Nümtema Face
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {[
              { q: 'Qu\'est-ce qu\'un funnel interactif ?', a: 'Un funnel interactif est un parcours personnalisé qui guide vos visiteurs à travers une série d\'étapes engageantes (vidéos, questions, formulaires) pour les qualifier et les convertir en clients.' },
              { q: 'Comment fonctionne l\'IA générative ?', a: 'Notre IA peut générer du texte, des images, des vidéos et des audios pour vos funnels. Il suffit de décrire ce que vous voulez, et l\'IA crée le contenu pour vous en quelques secondes.' },
              { q: 'Puis-je utiliser mon propre domaine ?', a: 'Oui, à partir du plan Starter, vous pouvez connecter votre propre domaine personnalisé pour une expérience complètement brandée.' },
              { q: 'Les données sont-elles sécurisées ?', a: 'Absolument. Toutes vos données sont hébergées en Europe, chiffrées et conformes RGPD. Nous prenons la sécurité très au sérieux.' },
              { q: 'Puis-je changer de plan à tout moment ?', a: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont effectifs immédiatement.' },
              { q: 'Y a-t-il un engagement ?', a: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment, aucune question posée.' },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-lg px-6 border">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-semibold">{faq.q}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à transformer vos visiteurs en clients ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Rejoignez des centaines d'entrepreneurs qui utilisent Nümtema Face pour développer leur activité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="shadow-elegant text-lg px-8">
                Commencer Gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/templates')} className="text-lg px-8">
                Explorer les Templates
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Aucune carte bancaire requise • 50 générations IA offertes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/src/assets/numtema-face-logo.png" alt="Nümtema Face" className="h-8" />
                <span className="font-semibold">Nümtema Face</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Créez des funnels interactifs intelligents avec l'IA générative.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><Button variant="link" className="h-auto p-0" onClick={() => navigate('/pricing')}>Tarifs</Button></li>
                <li><Button variant="link" className="h-auto p-0" onClick={() => navigate('/templates')}>Templates</Button></li>
                <li><Button variant="link" className="h-auto p-0">Fonctionnalités</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li><Button variant="link" className="h-auto p-0">Documentation</Button></li>
                <li><Button variant="link" className="h-auto p-0">Blog</Button></li>
                <li><Button variant="link" className="h-auto p-0">Support</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><Button variant="link" className="h-auto p-0">Confidentialité</Button></li>
                <li><Button variant="link" className="h-auto p-0">Conditions</Button></li>
                <li><Button variant="link" className="h-auto p-0">Mentions légales</Button></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Nümtema AI Foundry • Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
