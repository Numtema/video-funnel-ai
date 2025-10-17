import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Eye, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Analytics = () => {
  return (
    <MainLayout>
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Vue d'ensemble de vos performances
            </p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-40">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 derniers jours</SelectItem>
                <SelectItem value="30">30 derniers jours</SelectItem>
                <SelectItem value="90">90 derniers jours</SelectItem>
                <SelectItem value="365">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Exporter CSV
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions Totales</CardTitle>
              <Eye className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success">+0%</span> vs période précédente
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success">+0%</span> vs période précédente
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux Global</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Moyenne de conversion
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visiteurs Uniques</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Sessions par visiteur: 0
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sessions par jour</CardTitle>
              <CardDescription>Évolution sur la période sélectionnée</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Graphique disponible avec des données</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sources de trafic</CardTitle>
              <CardDescription>Origine de vos visiteurs</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Données disponibles après collecte</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Aucune donnée pour le moment</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Créez et publiez vos funnels pour commencer à collecter des données analytiques
            </p>
            <Button size="lg">
              Créer un funnel
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Analytics;
