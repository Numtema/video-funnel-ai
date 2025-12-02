import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Video, Sparkles, TrendingUp, Zap, Users, Shield, Palette, BarChart3, Clock, Rocket, Check, ArrowRight, Play, Star, Globe, MessageSquare, Target } from 'lucide-react';
import numtemaLogo from '@/assets/numtema-face-logo.png';

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
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src={numtemaLogo} alt="Nümtema Face" className="h-10 md:h-12" />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Button variant="ghost" onClick={() => navigate('/templates')} className="text-muted-foreground hover:text-foreground">
              Templates
            </Button>
            <Button variant="ghost" onClick={() => navigate('/pricing')} className="text-muted-foreground hover:text-foreground">
              Tarifs
            </Button>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')} className="hidden sm:inline-flex">
              Connexion
            </Button>
            <Button onClick={() => navigate('/auth')} className="shadow-elegant">
              Commencer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-8 animate-fade-in">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-foreground">Nouveau • Lead Generation Machine</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Transformez
                </span>
                <br />
                <span className="text-foreground">vos visiteurs en clients</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Créez des funnels vidéo interactifs avec l'IA générative. Qualifiez, engagez et convertissez automatiquement vos prospects.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button size="lg" onClick={() => navigate('/auth')} className="shadow-elegant text-base px-8 h-12">
                  Commencer Gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/templates')} className="text-base px-8 h-12 group">
                  <Play className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                  Voir une démo
                </Button>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Sans carte bancaire</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>50 crédits IA offerts</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative rounded-2xl overflow-hidden shadow-elegant border border-border/50 bg-card">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_hsl(var(--background))_100%)]" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse">
                      <Video className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-muted-foreground font-medium">Funnel Vidéo Interactif</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-8 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">4.9/5</span>
              <span className="text-sm">sur 200+ avis</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">1,500+</span>
              <span className="text-sm">entrepreneurs</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-5 w-5 text-accent" />
              <span className="font-medium">25+</span>
              <span className="text-sm">pays</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-5 w-5 text-success" />
              <span className="font-medium">3x</span>
              <span className="text-sm">plus de conversions</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">Comment ça marche</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Créez votre funnel en <span className="text-primary">4 étapes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              De l'idée au funnel publié en quelques minutes grâce à l'IA
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { step: '01', icon: Palette, title: 'Créer', desc: 'Template, Lead Machine ou création libre' },
              { step: '02', icon: Sparkles, title: 'Personnaliser', desc: 'L\'IA génère vos contenus et médias' },
              { step: '03', icon: Rocket, title: 'Publier', desc: 'Un clic pour mettre en ligne' },
              { step: '04', icon: BarChart3, title: 'Analyser', desc: 'Suivez vos performances en temps réel' },
            ].map((item, i) => (
              <Card key={i} className="relative group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50 animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardContent className="pt-8 pb-6">
                  <div className="text-7xl font-bold text-primary/10 absolute top-4 right-4">{item.step}</div>
                  <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">Fonctionnalités</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Tout pour <span className="text-accent">convertir</span> vos visiteurs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une suite complète d'outils pour créer des expériences mémorables
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Video, title: 'Funnels Vidéo', desc: 'Expériences immersives avec vidéos, images et audio générés par IA' },
              { icon: Sparkles, title: 'IA Générative', desc: 'Génération automatique de contenus, scripts et médias' },
              { icon: TrendingUp, title: 'Analytics Avancées', desc: 'Tableau de bord complet pour optimiser vos conversions' },
              { icon: Users, title: 'Lead Capture', desc: 'Formulaires intelligents avec scoring automatique' },
              { icon: MessageSquare, title: 'Lead Machine', desc: 'Méthodologie en 9 étapes pour des funnels qui convertissent' },
              { icon: Zap, title: 'Intégrations', desc: 'Connectez Calendly, WhatsApp, CRM et plus encore' },
              { icon: Palette, title: 'White Label', desc: 'Votre marque, votre logo, votre domaine' },
              { icon: Shield, title: 'Sécurité RGPD', desc: 'Données chiffrées et hébergées en Europe' },
              { icon: Clock, title: 'Déploiement Rapide', desc: 'Publiez en un clic, partagez instantanément' },
            ].map((feature, i) => (
              <Card key={i} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50 animate-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <CardContent className="pt-6 pb-5">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="shadow-elegant border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
                {[
                  { value: '50+', label: 'Générations IA gratuites par mois', color: 'text-primary' },
                  { value: '3', label: 'Funnels actifs sur le plan gratuit', color: 'text-accent' },
                  { value: '∞', label: 'Possibilités créatives', color: 'text-success' },
                ].map((stat, i) => (
                  <div key={i} className="p-8 md:p-12 text-center animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className={`text-5xl md:text-6xl font-bold mb-3 ${stat.color}`}>{stat.value}</div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">Témoignages</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Ils nous font <span className="text-primary">confiance</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez ce que nos utilisateurs pensent de Nümtema Face
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sophie Martin', role: 'Coach Business', company: 'SM Coaching', text: 'Nümtema Face a transformé ma génération de leads. Je capture 3x plus de prospects qualifiés qu\'avant.' },
              { name: 'Thomas Dubois', role: 'Fondateur', company: 'Digital Academy', text: 'L\'IA générative me fait gagner des heures sur la création de contenu. Incroyablement puissant.' },
              { name: 'Marie Lefebvre', role: 'Consultante Marketing', company: 'ML Consulting', text: 'Les analytics en temps réel me permettent d\'optimiser mes funnels en continu. ROI exceptionnel.' },
            ].map((testimonial, i) => (
              <Card key={i} className="group hover:shadow-elegant transition-all duration-300 border-border/50 animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{testimonial.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role} • {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">Tarifs</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Tarifs <span className="text-accent">simples</span> et transparents
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Free', price: '0€', period: '/mois', features: ['3 funnels actifs', '50 générations IA/mois', 'Analytics de base', 'Support communautaire'] },
              { name: 'Starter', price: '29€', period: '/mois', features: ['10 funnels actifs', '200 générations IA/mois', 'Analytics avancées', 'Support email', 'Domaine personnalisé'], popular: true },
              { name: 'Pro', price: '79€', period: '/mois', features: ['Funnels illimités', '1000 générations IA/mois', 'Analytics premium', 'Support prioritaire', 'Marque blanche', 'API access'] },
            ].map((plan, i) => (
              <Card key={i} className={`relative group hover:shadow-elegant transition-all duration-300 animate-scale-in ${plan.popular ? 'border-primary border-2 scale-105' : 'border-border/50'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                    Populaire
                  </div>
                )}
                <CardContent className="pt-8 pb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
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
          <div className="text-center mt-10">
            <Button variant="link" onClick={() => navigate('/pricing')} className="text-muted-foreground hover:text-foreground">
              Voir tous les détails des plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">FAQ</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Questions <span className="text-accent">fréquentes</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Tout ce que vous devez savoir sur Nümtema Face
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: 'Qu\'est-ce qu\'un funnel interactif ?', a: 'Un funnel interactif est un parcours personnalisé qui guide vos visiteurs à travers une série d\'étapes engageantes (vidéos, questions, formulaires) pour les qualifier et les convertir en clients.' },
              { q: 'Comment fonctionne l\'IA générative ?', a: 'Notre IA peut générer du texte, des images, des vidéos et des audios pour vos funnels. Il suffit de décrire ce que vous voulez, et l\'IA crée le contenu pour vous en quelques secondes.' },
              { q: 'Qu\'est-ce que Lead Generation Machine ?', a: 'Lead Generation Machine est notre méthodologie en 9 étapes (ATTRACT, ENGAGE, DIAGNOSE, etc.) qui vous guide pour créer des funnels vidéo qui convertissent. L\'IA génère automatiquement les scripts personnalisés.' },
              { q: 'Puis-je utiliser mon propre domaine ?', a: 'Oui, à partir du plan Starter, vous pouvez connecter votre propre domaine personnalisé pour une expérience complètement brandée.' },
              { q: 'Les données sont-elles sécurisées ?', a: 'Absolument. Toutes vos données sont hébergées en Europe, chiffrées et conformes RGPD. Nous prenons la sécurité très au sérieux.' },
              { q: 'Y a-t-il un engagement ?', a: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment, aucune question posée.' },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-xl px-6 border border-border/50">
                <AccordionTrigger className="hover:no-underline py-5">
                  <span className="text-left font-semibold">{faq.q}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Prêt à <span className="text-primary">transformer</span> vos visiteurs en clients ?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Rejoignez des centaines d'entrepreneurs qui utilisent Nümtema Face pour développer leur activité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="shadow-elegant text-base px-8 h-12">
                Commencer Gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/templates')} className="text-base px-8 h-12">
                Explorer les Templates
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Aucune carte bancaire requise • 50 générations IA offertes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-1">
              <img src={numtemaLogo} alt="Nümtema Face" className="h-10 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Créez des funnels interactifs intelligents avec l'IA générative.
              </p>
              <p className="text-xs text-muted-foreground">
                Powered by Nümtema AI Foundry
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-3 text-sm">
                <li><Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate('/pricing')}>Tarifs</Button></li>
                <li><Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate('/templates')}>Templates</Button></li>
                <li><Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate('/features')}>Fonctionnalités</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-3 text-sm">
                <li><Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate('/docs')}>Documentation</Button></li>
                <li><Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate('/blog')}>Blog</Button></li>
                <li><Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate('/support')}>Support</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-3 text-sm">
                <li><Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate('/privacy')}>Confidentialité</Button></li>
                <li><Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate('/terms')}>Conditions</Button></li>
                <li><Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate('/legal')}>Mentions légales</Button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Nümtema AI Foundry • Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
