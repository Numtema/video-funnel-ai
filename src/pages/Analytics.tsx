import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { KPICard } from '@/components/analytics/KPICard';
import { SessionsChart } from '@/components/analytics/SessionsChart';
import { TrafficSourcesChart } from '@/components/analytics/TrafficSourcesChart';
import { DeviceBreakdownChart } from '@/components/analytics/DeviceBreakdownChart';
import { SubmissionsTable } from '@/components/analytics/SubmissionsTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Users, TrendingUp, Clock } from 'lucide-react';
import { subDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
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
    if (user) {
      loadAnalytics();
    }
  }, [user, dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const days = parseInt(dateRange);
      const startDate = subDays(new Date(), days).toISOString();

      const { data: funnels } = await supabase
        .from('funnels')
        .select('id')
        .eq('user_id', user!.id);

      const funnelIds = funnels?.map(f => f.id) || [];

      const { data: sessionsData } = await supabase
        .from('analytics_sessions')
        .select('*')
        .in('funnel_id', funnelIds)
        .gte('started_at', startDate);

      const { data: submissionsData } = await supabase
        .from('submissions')
        .select('*, funnels(name)')
        .in('funnel_id', funnelIds)
        .gte('created_at', startDate);

      const totalSessions = sessionsData?.length || 0;
      const totalSubmissions = submissionsData?.length || 0;
      const conversionRate = totalSessions > 0 ? (totalSubmissions / totalSessions) * 100 : 0;

      setStats({
        totalSessions,
        totalSubmissions,
        conversionRate: Math.round(conversionRate),
        avgTime: 0
      });

      const sessionsByDate: Record<string, number> = {};
      sessionsData?.forEach(session => {
        const date = format(new Date(session.started_at), 'dd MMM', { locale: fr });
        sessionsByDate[date] = (sessionsByDate[date] || 0) + 1;
      });
      setSessions(Object.entries(sessionsByDate).map(([date, count]) => ({ date, sessions: count })));

      const sourcesCounts: Record<string, number> = {};
      sessionsData?.forEach(session => {
        const source = session.source || 'direct';
        sourcesCounts[source] = (sourcesCounts[source] || 0) + 1;
      });
      setTrafficSources(Object.entries(sourcesCounts).map(([name, value]) => ({ name, value })));

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
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des performances de vos funnels
          </p>
        </div>

        <div className="flex justify-end">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SessionsChart data={sessions} loading={loading} />
          <TrafficSourcesChart data={trafficSources} loading={loading} />
        </div>

        <DeviceBreakdownChart data={deviceBreakdown} loading={loading} />

        <SubmissionsTable submissions={submissions} loading={loading} />
      </div>
    </MainLayout>
  );
};

export default Analytics;
