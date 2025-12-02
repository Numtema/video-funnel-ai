import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar, Clock, User, Tag } from 'lucide-react';
import numtemaLogo from '@/assets/numtema-face-logo.png';

const Blog = () => {
  const navigate = useNavigate();

  const featuredPost = {
    title: 'Lead Generation Machine : La méthodologie en 9 étapes pour des funnels qui convertissent',
    excerpt: 'Découvrez comment utiliser notre méthodologie exclusive ATTRACT, ENGAGE, DIAGNOSE, EMPATHIZE, CAPTURE, PRESCRIBE, TEACH, OFFER, NURTURE pour créer des funnels vidéo qui transforment vos visiteurs en clients.',
    author: 'Équipe Nümtema',
    date: '28 Nov 2025',
    readTime: '12 min',
    category: 'Méthodologie'
  };

  const posts = [
    {
      title: '5 erreurs à éviter dans vos funnels de conversion',
      excerpt: 'Les pièges les plus courants et comment les contourner pour maximiser vos conversions.',
      author: 'Équipe Nümtema',
      date: '25 Nov 2025',
      readTime: '8 min',
      category: 'Conseils'
    },
    {
      title: 'Comment l\'IA révolutionne la création de contenu marketing',
      excerpt: 'L\'intelligence artificielle générative ouvre de nouvelles possibilités pour les entrepreneurs.',
      author: 'Équipe Nümtema',
      date: '22 Nov 2025',
      readTime: '6 min',
      category: 'IA & Tech'
    },
    {
      title: 'Étude de cas : +300% de leads avec les funnels vidéo',
      excerpt: 'Comment Marie, coach business, a triplé sa génération de leads en 3 mois.',
      author: 'Équipe Nümtema',
      date: '18 Nov 2025',
      readTime: '10 min',
      category: 'Études de cas'
    },
    {
      title: 'Guide complet du scoring de leads',
      excerpt: 'Apprenez à qualifier automatiquement vos prospects pour concentrer vos efforts.',
      author: 'Équipe Nümtema',
      date: '15 Nov 2025',
      readTime: '9 min',
      category: 'Guides'
    },
    {
      title: 'Intégrer WhatsApp dans votre stratégie de suivi',
      excerpt: 'Le messaging instantané pour des conversions plus rapides et personnalisées.',
      author: 'Équipe Nümtema',
      date: '12 Nov 2025',
      readTime: '7 min',
      category: 'Intégrations'
    },
    {
      title: 'Les templates qui convertissent le mieux en 2025',
      excerpt: 'Analyse des funnels les plus performants et ce qui les rend efficaces.',
      author: 'Équipe Nümtema',
      date: '8 Nov 2025',
      readTime: '11 min',
      category: 'Analyses'
    },
  ];

  const categories = ['Tous', 'Méthodologie', 'Conseils', 'IA & Tech', 'Études de cas', 'Guides', 'Intégrations'];

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
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">Blog</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Conseils & <span className="text-primary">Stratégies</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Articles, études de cas et guides pour optimiser vos funnels et augmenter vos conversions.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b border-border/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat, i) => (
              <Button key={i} variant={i === 0 ? 'default' : 'outline'} size="sm">
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="overflow-hidden hover:shadow-elegant transition-all duration-300 border-border/50">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 aspect-video md:aspect-auto flex items-center justify-center">
                  <span className="text-6xl">📈</span>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{featuredPost.category}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {featuredPost.date}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {featuredPost.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <Button variant="link" className="text-primary">
                      Lire l'article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Card key={i} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50">
                <CardContent className="pt-6 pb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{post.category}</span>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Lire
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Restez informé</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Recevez nos derniers articles et conseils directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="votre@email.com"
              className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button className="shadow-elegant">S'abonner</Button>
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

export default Blog;
