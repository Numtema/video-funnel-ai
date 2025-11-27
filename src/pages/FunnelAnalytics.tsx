import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { KPICard } from '@/components/analytics/KPICard';
import { SessionsChart } from '@/components/analytics/SessionsChart';
import { TrafficSourcesChart } from '@/components/analytics/TrafficSourcesChart';
import { DeviceBreakdownChart } from '@/components/analytics/DeviceBreakdownChart';
import { SubmissionsTable } from '@/components/analytics/SubmissionsTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Users, TrendingUp, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { subDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const FunnelAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [funnelName, setFunnelName] = useState('');
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalSubmissions: 0,
    conversionRate: 0,
    avgTime: 0
  });
  const [sessions, setSessions] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [trafficSources, setTrafficSources] = useState<any[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<any[]>([]);

  useEffect(() => {
    if (user && id) {
      loadFunnelAnalytics();
    }
  }, [user, id, dateRange]);

  const loadFunnelAnalytics = async () => {
    setLoading(true);
    try {
      const days = parseInt(dateRange);
      const startDate = subDays(new Date(), days).toISOString();

      // Get funnel info
      const { data: funnel, error: funnelError } = await supabase
        .from('funnels')
        .select('name')
        .eq('id', id!)
        .eq('user_id', user!.id)
        .single();

      if (funnelError || !funnel) {
        toast({ 
          title: 'Erreur', 
          description: 'Funnel introuvable', 
          variant: 'destructive' 
        });
        navigate('/analytics');
        return;
      }

      setFunnelName(funnel.name);

      // Get sessions for this funnel
      const { data: sessionsData } = await supabase
        .from('analytics_sessions')
        .select('*')
        .eq('funnel_id', id!)
        .gte('started_at', startDate);

      // Get submissions for this funnel
      const { data: submissionsData } = await supabase
        .from('submissions')
        .select('*')
        .eq('funnel_id', id!)
        .gte('created_at', startDate);

      const totalSessions = sessionsData?.length || 0;
      const totalSubmissions = submissionsData?.length || 0;
      const conversionRate = totalSessions > 0 ? (totalSubmissions / totalSessions) * 100 : 0;

      // Calculate average completion time
      const completedSessions = sessionsData?.filter(s => s.completed_at) || [];
      const avgTime = completedSessions.length > 0
        ? Math.round(completedSessions.reduce((acc, s) => {
            const duration = new Date(s.completed_at).getTime() - new Date(s.started_at).getTime();
            return acc + duration / 1000;
          }, 0) / completedSessions.length)
        : 0;

      setStats({
        totalSessions,
        totalSubmissions,
        conversionRate: Math.round(conversionRate),
        avgTime
      });

      // Sessions by date
      const sessionsByDate: Record<string, number> = {};
      sessionsData?.forEach(session => {
        const date = format(new Date(session.started_at), 'dd MMM', { locale: fr });
        sessionsByDate[date] = (sessionsByDate[date] || 0) + 1;
      });
      setSessions(Object.entries(sessionsByDate).map(([date, count]) => ({ date, sessions: count })));

      // Traffic sources
      const sourcesCounts: Record<string, number> = {};
      sessionsData?.forEach(session => {
        const source = session.source || 'direct';
        sourcesCounts[source] = (sourcesCounts[source] || 0) + 1;
      });
      setTrafficSources(Object.entries(sourcesCounts).map(([name, value]) => ({ name, value })));

      // Device breakdown
      const deviceCounts: Record<string, { sessions: number; conversions: number }> = {};
      sessionsData?.forEach(session => {
        const device = session.device || 'desktop';
        if (!deviceCounts[device]) {
          deviceCounts[device] = { sessions: 0, conversions: 0 };
        }
        deviceCounts[device].sessions += 1;
        if (session.submitted) {
          deviceCounts[device].conversions += 1;
        }
      });
      setDeviceBreakdown(Object.entries(deviceCounts).map(([device, data]) => ({ device, ...data })));

      setSubmissions(submissionsData || []);
    } catch (error) {
      console.error('Error loading funnel analytics:', error);
      toast({ 
        title: 'Erreur', 
        description: 'Impossible de charger les analytics', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/analytics')}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux analytics
            </Button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              {funnelName || 'Analytics du Funnel'}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Performances détaillées de ce funnel
            </p>
          </div>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KPICard
            title="Total Sessions"
            value={stats.totalSessions}
            icon={<Users className="w-5 h-5" />}
            loading={loading}
          />
          <KPICard
            title="Conversions"
            value={stats.totalSubmissions}
            icon={<TrendingUp className="w-5 h-5" />}
            loading={loading}
          />
          <KPICard
            title="Taux de conversion"
            value={`${stats.conversionRate}%`}
            icon={<BarChart3 className="w-5 h-5" />}
            loading={loading}
          />
          <KPICard
            title="Temps moyen"
            value={`${stats.avgTime}s`}
            icon={<Clock className="w-5 h-5" />}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <SessionsChart data={sessions} loading={loading} />
          <TrafficSourcesChart data={trafficSources} loading={loading} />
        </div>

        <DeviceBreakdownChart data={deviceBreakdown} loading={loading} />

        <SubmissionsTable submissions={submissions} loading={loading} />
      </div>
    </MainLayout>
  );
};

export default FunnelAnalytics;
