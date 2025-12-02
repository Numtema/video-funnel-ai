import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Book, FileText, Video, MessageSquare, ArrowRight, ExternalLink, PlayCircle, Lightbulb } from 'lucide-react';
import numtemaLogo from '@/assets/numtema-face-logo.png';

const Resources = () => {
  const navigate = useNavigate();

  const resources = [
    {
      icon: Book,
      title: 'Documentation',
      desc: 'Guides complets pour maîtriser toutes les fonctionnalités de Nümtema Face.',
      link: '/docs',
      cta: 'Lire la documentation'
    },
    {
      icon: PlayCircle,
      title: 'Tutoriels Vidéo',
      desc: 'Apprenez à créer vos premiers funnels avec nos tutoriels étape par étape.',
      link: '/blog',
      cta: 'Voir les tutoriels'
    },
    {
      icon: FileText,
      title: 'Blog',
      desc: 'Articles, études de cas et conseils pour optimiser vos conversions.',
      link: '/blog',
      cta: 'Lire le blog'
    },
    {
      icon: MessageSquare,
      title: 'Support',
      desc: 'Notre équipe est là pour répondre à toutes vos questions.',
      link: '/support',
      cta: 'Contacter le support'
    },
  ];

  const guides = [
    {
      title: 'Créer votre premier funnel',
      desc: 'Guide complet pour démarrer avec Nümtema Face',
      duration: '10 min',
      category: 'Débutant'
    },
    {
      title: 'Lead Generation Machine',
      desc: 'Maîtrisez notre méthodologie en 9 étapes',
      duration: '20 min',
      category: 'Avancé'
    },
    {
      title: 'Optimiser vos conversions',
      desc: 'Best practices pour maximiser vos résultats',
      duration: '15 min',
      category: 'Intermédiaire'
    },
    {
      title: 'Intégrer Calendly',
      desc: 'Connectez votre calendrier pour les rendez-vous',
      duration: '5 min',
      category: 'Débutant'
    },
    {
      title: 'Analytics avancées',
      desc: 'Comprendre et exploiter vos données',
      duration: '12 min',
      category: 'Intermédiaire'
    },
    {
      title: 'Webhooks & API',
      desc: 'Connectez Nümtema Face à vos outils',
      duration: '8 min',
      category: 'Avancé'
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">Ressources</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Apprenez à <span className="text-primary">convertir</span> plus
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Documentation, tutoriels, articles et support pour maîtriser Nümtema Face.
          </p>
        </div>
      </section>

      {/* Resource Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, i) => (
              <Card key={i} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50 cursor-pointer" onClick={() => navigate(resource.link)}>
                <CardContent className="pt-6 pb-5">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <resource.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{resource.desc}</p>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    {resource.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Guides populaires</h2>
            <p className="text-muted-foreground">Les ressources les plus consultées par notre communauté</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, i) => (
              <Card key={i} className="group hover:shadow-elegant transition-all duration-300 border-border/50">
                <CardContent className="pt-6 pb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      guide.category === 'Débutant' ? 'bg-green-100 text-green-700' :
                      guide.category === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {guide.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{guide.duration}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                  <p className="text-muted-foreground text-sm">{guide.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Lightbulb className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Une question ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Notre équipe support est disponible pour vous aider.
          </p>
          <Button size="lg" onClick={() => navigate('/support')} className="shadow-elegant">
            Contacter le Support
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
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

export default Resources;
