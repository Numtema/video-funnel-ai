import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Sparkles, TrendingUp, Zap, Users, Shield, Palette, BarChart3, Clock, Rocket, ArrowRight, Target, MessageSquare, Globe, Layers, GitBranch, Bell } from 'lucide-react';


const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Video,
      title: 'Funnels Vidéo Interactifs',
      desc: 'Créez des parcours immersifs avec vidéos, images et audio. Vos visiteurs interagissent directement avec votre contenu pour une expérience mémorable.',
      benefits: ['Support YouTube et uploads', 'Vidéos auto-play', 'Branchement conditionnel']
    },
    {
      icon: Sparkles,
      title: 'IA Générative Intégrée',
      desc: 'Générez automatiquement du texte, des scripts, des images et des idées de contenu grâce à notre IA intégrée.',
      benefits: ['Génération de texte', 'Création d\'images', 'Scripts personnalisés']
    },
    {
      icon: MessageSquare,
      title: 'Lead Generation Machine',
      desc: 'Notre méthodologie exclusive en 9 étapes pour créer des funnels qui convertissent : ATTRACT, ENGAGE, DIAGNOSE, EMPATHIZE, CAPTURE, PRESCRIBE, TEACH, OFFER, NURTURE.',
      benefits: ['Wizard guidé', 'Scripts générés par IA', 'Méthodologie prouvée']
    },
    {
      icon: Users,
      title: 'Lead Capture Intelligent',
      desc: 'Capturez et qualifiez vos prospects avec des formulaires intelligents et un scoring automatique.',
      benefits: ['Formulaires personnalisables', 'Scoring automatique', 'Notifications temps réel']
    },
    {
      icon: GitBranch,
      title: 'Routing Conditionnel',
      desc: 'Créez des parcours personnalisés basés sur les réponses de vos visiteurs. Chaque prospect vit une expérience unique.',
      benefits: ['Branchements multiples', 'Logique avancée', 'Parcours personnalisés']
    },
    {
      icon: TrendingUp,
      title: 'Analytics Avancées',
      desc: 'Tableau de bord complet avec métriques de performance, sources de trafic, appareils et taux de conversion.',
      benefits: ['Dashboard temps réel', 'Export CSV', 'Insights détaillés']
    },
    {
      icon: Zap,
      title: 'Intégrations Natives',
      desc: 'Connectez vos outils favoris : Calendly pour les rendez-vous, WhatsApp pour le suivi, webhooks pour votre CRM.',
      benefits: ['Calendly / Cal.com', 'WhatsApp Click-to-Chat', 'Webhooks personnalisés']
    },
    {
      icon: Bell,
      title: 'Notifications Email',
      desc: 'Recevez une notification instantanée par email pour chaque nouveau lead avec tous les détails de son parcours.',
      benefits: ['Alertes instantanées', 'Détails du parcours', 'Réponses incluses']
    },
    {
      icon: Palette,
      title: 'White Label Complet',
      desc: 'Personnalisez entièrement l\'apparence de vos funnels : votre logo, vos couleurs, votre domaine.',
      benefits: ['Logo personnalisé', 'Couleurs de marque', 'Domaine custom']
    },
    {
      icon: Layers,
      title: 'Templates Prêts à l\'Emploi',
      desc: 'Démarrez rapidement avec nos templates pré-configurés pour différents secteurs et objectifs.',
      benefits: ['Lead Generation', 'Quiz', 'Formations']
    },
    {
      icon: Shield,
      title: 'Sécurité & RGPD',
      desc: 'Vos données et celles de vos prospects sont sécurisées et hébergées en Europe, conformément au RGPD.',
      benefits: ['Hébergement Europe', 'Données chiffrées', 'Conforme RGPD']
    },
    {
      icon: Clock,
      title: 'Déploiement Instantané',
      desc: 'Publiez vos funnels en un clic et partagez-les instantanément via un lien unique.',
      benefits: ['Publication 1-clic', 'Lien de partage', 'QR Code']
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-xl md:text-2xl font-bold text-primary font-poppins">Nümtema Face</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>Connexion</Button>
            <Button onClick={() => navigate('/auth')} className="shadow-elegant">
              Commencer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">Fonctionnalités</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Tout pour <span className="text-primary">convertir</span> vos visiteurs
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Découvrez toutes les fonctionnalités de Nümtema Face pour créer des funnels interactifs qui génèrent des leads qualifiés.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="shadow-elegant">
            Essayer Gratuitement
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50">
                <CardContent className="pt-6 pb-5">
                  <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.desc}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à créer votre premier funnel ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Commencez gratuitement avec 50 générations IA et 3 funnels actifs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="shadow-elegant">
              Commencer Gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
              Voir les Tarifs
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-8">
        <div className="container mx-auto px-4 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Nümtema AI Foundry • Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
};

export default Features;
