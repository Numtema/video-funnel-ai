import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Rocket, Video, Users, BarChart3, Zap, Settings, Shield, ArrowRight, Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import numtemaLogo from '@/assets/numtema-face-logo.png';

const Documentation = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Rocket,
      title: 'Démarrage Rapide',
      desc: 'Créez votre premier funnel en 5 minutes',
      articles: ['Créer un compte', 'Votre premier funnel', 'Publier et partager', 'Analyser les résultats']
    },
    {
      icon: Video,
      title: 'Création de Funnels',
      desc: 'Guide complet de l\'éditeur de funnels',
      articles: ['Types d\'étapes', 'Ajouter des médias', 'Routing conditionnel', 'Lead capture']
    },
    {
      icon: Users,
      title: 'Lead Generation Machine',
      desc: 'Maîtrisez la méthodologie en 9 étapes',
      articles: ['Introduction à LGM', 'Le Wizard guidé', 'Scripts et contenus', 'Personnalisation']
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      desc: 'Comprendre et exploiter vos données',
      articles: ['Tableau de bord', 'Métriques clés', 'Export de données', 'Optimisation']
    },
    {
      icon: Zap,
      title: 'Intégrations',
      desc: 'Connectez vos outils favoris',
      articles: ['Calendly', 'WhatsApp', 'Webhooks', 'Notifications email']
    },
    {
      icon: Settings,
      title: 'Paramètres',
      desc: 'Configurez votre compte et vos funnels',
      articles: ['Profil utilisateur', 'Abonnement', 'Domaine personnalisé', 'Marque blanche']
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src={numtemaLogo} alt="Nümtema Face" className="h-10 md:h-12" />
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
      <section className="py-16 md:py-20 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Book className="h-12 w-12 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Tout ce dont vous avez besoin pour maîtriser Nümtema Face
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Rechercher dans la documentation..." 
              className="pl-12 h-12 text-base"
            />
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, i) => (
              <Card key={i} className="group hover:shadow-elegant transition-all duration-300 border-border/50">
                <CardContent className="pt-6 pb-5">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{section.desc}</p>
                  <ul className="space-y-2">
                    {section.articles.map((article, j) => (
                      <li key={j}>
                        <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground hover:text-primary justify-start">
                          <ChevronRight className="h-4 w-4 mr-1" />
                          {article}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Banner */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Nouveau sur Nümtema Face ?</h3>
                <p className="text-muted-foreground">Suivez notre guide de démarrage rapide pour créer votre premier funnel en 5 minutes.</p>
              </div>
              <Button size="lg" onClick={() => navigate('/auth')} className="shadow-elegant whitespace-nowrap">
                Commencer le tutoriel
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
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

export default Documentation;
