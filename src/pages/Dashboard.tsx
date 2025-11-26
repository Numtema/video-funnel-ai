import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAIUsage } from '@/hooks/useAIUsage';
import MainLayout from '@/components/layout/MainLayout';
import CreateFunnelModal from '@/components/funnels/CreateFunnelModal';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { RecentFunnelsTable } from '@/components/dashboard/RecentFunnelsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Video, FileText, TrendingUp, Sparkles, BarChart3, Zap } from 'lucide-react';

const Dashboard = () => {
  const { profile, user } = useAuth();
  const { usage, percentage } = useAIUsage();
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getTipOfDay = () => {
    const tips = [
      "Utilisez des vidéos courtes pour maintenir l'engagement",
      "Testez différents call-to-action pour optimiser vos conversions",
      "L'IA peut générer vos médias automatiquement",
      "Analysez vos données pour comprendre votre audience",
      "Un bon titre fait 50% du succès de votre funnel",
    ];
    return tips[new Date().getDate() % tips.length];
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-elegant transition-smooth animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funnels Actifs</CardTitle>
              <Video className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                sur {profile?.max_funnels || 3} disponibles
              </p>
              <div className="mt-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">ce mois-ci</p>
              <p className="text-xs text-success mt-1">+0% vs mois dernier</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">moyenne globale</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crédits IA</CardTitle>
              <Sparkles className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usage.current}/{usage.max}
              </div>
              <p className="text-xs text-muted-foreground mb-2">utilisés ce mois</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Commencez dès maintenant</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Button 
              size="lg" 
              onClick={() => setCreateModalOpen(true)}
              className="shadow-elegant h-20"
            >
              <div className="flex flex-col items-center gap-2">
                <PlusCircle className="h-6 w-6" />
                <span>Créer un Funnel</span>
              </div>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/funnels')}
              className="h-20"
            >
              <div className="flex flex-col items-center gap-2">
                <Video className="h-6 w-6" />
                <span>Mes Funnels</span>
              </div>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/analytics')}
              className="h-20"
            >
              <div className="flex flex-col items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>Analytics</span>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Performance Chart & Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
          <ActivityFeed />
        </div>

        {/* Recent Funnels Table */}
        <RecentFunnelsTable />

        <CreateFunnelModal 
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
