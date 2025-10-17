import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Video, FileText, TrendingUp, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { profile, user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl">
              {getGreeting()}, {profile?.full_name || user?.email?.split('@')[0]} ! 👋
            </CardTitle>
            <CardDescription className="text-lg">
              Bienvenue sur Nümtema Face - Créez des funnels intelligents
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funnels Actifs</CardTitle>
              <Video className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                sur {profile?.max_funnels || 3} disponibles
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">moyenne globale</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crédits IA</CardTitle>
              <Sparkles className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.current_month_ai_count || 0}/{profile?.max_ai_generations_monthly || 50}
              </div>
              <p className="text-xs text-muted-foreground">utilisés ce mois</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Commencez à créer votre premier funnel</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button size="lg" className="shadow-elegant">
              <PlusCircle className="mr-2 h-5 w-5" />
              Créer un Funnel
            </Button>
            <Button size="lg" variant="outline">
              <Sparkles className="mr-2 h-5 w-5" />
              Explorer les Templates
            </Button>
            <Button size="lg" variant="outline">
              <TrendingUp className="mr-2 h-5 w-5" />
              Voir les Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Video className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Aucun funnel pour le moment</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Créez votre premier funnel avec l'aide de l'IA et commencez à convertir vos visiteurs en clients.
            </p>
            <Button size="lg" className="shadow-elegant">
              <PlusCircle className="mr-2 h-5 w-5" />
              Créer mon premier funnel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
