import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Sparkles, TrendingUp, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-primary">Powered by Nümtema AI Foundry</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Nümtema Face
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Créez des funnels interactifs intelligents avec l'IA générative
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="shadow-elegant text-lg px-8">
              Commencer Gratuitement
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Découvrir les Templates
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-elegant transition-smooth animate-scale-in">
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Funnels Vidéo</h3>
              <p className="text-muted-foreground">
                Créez des expériences immersives avec vidéos, images et audio générés par IA
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">IA Générative</h3>
              <p className="text-muted-foreground">
                Générez du contenu, des médias et des analyses avec l'intelligence artificielle
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Avancées</h3>
              <p className="text-muted-foreground">
                Suivez les performances en temps réel et optimisez vos conversions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-2xl p-8 shadow-elegant text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Générations IA gratuites par mois</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">3</div>
              <p className="text-muted-foreground">Funnels actifs sur le plan gratuit</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">∞</div>
              <p className="text-muted-foreground">Possibilités créatives</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground">
          <p>© 2025 Nümtema AI Foundry</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
