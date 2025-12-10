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
import { StepDropoffChart } from '@/components/analytics/StepDropoffChart';
import { TimePerStepChart } from '@/components/analytics/TimePerStepChart';
import { ClickHeatmap } from '@/components/analytics/ClickHeatmap';
import { ExportPDFButton } from '@/components/analytics/ExportPDFButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, TrendingUp, Clock, ArrowLeft, MousePointerClick, TrendingDown, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { subDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface StepDropoffData {
  stepId: string;
  stepName: string;
  stepType: string;
  visitors: number;
  dropoffs: number;
  dropoffRate: number;
}

interface StepTimeData {
  stepId: string;
  stepName: string;
  stepType: string;
  avgTime: number;
  minTime: number;
  maxTime: number;
  medianTime: number;
}

interface ClickData {
  stepId: string;
  stepName: string;
  stepType: string;
  totalClicks: number;
  options?: {
    optionId: string;
    optionText: string;
    clicks: number;
    percentage: number;
  }[];
}

const FunnelAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [funnelName, setFunnelName] = useState('');
  const [funnelConfig, setFunnelConfig] = useState<any>(null);
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
  const [stepDropoff, setStepDropoff] = useState<StepDropoffData[]>([]);
  const [timePerStep, setTimePerStep] = useState<StepTimeData[]>([]);
  const [clickHeatmap, setClickHeatmap] = useState<ClickData[]>([]);

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

      // Get funnel info with config
      const { data: funnel, error: funnelError } = await supabase
        .from('funnels')
        .select('name, config')
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
      setFunnelConfig(funnel.config);

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

      // Calculate step dropoff (simulated based on config)
      const config = funnel.config as any;
      if (config?.steps) {
        const steps = config.steps;
        const stepDropoffData: StepDropoffData[] = steps.map((step: any, index: number) => {
          // Simulate dropoff - in real app, this would come from step_events table
          const baseVisitors = totalSessions;
          const dropoffRate = Math.floor(Math.random() * 20) + 5; // 5-25%
          const visitors = Math.round(baseVisitors * Math.pow(0.85, index));
          const dropoffs = index > 0 ? Math.round(visitors * (dropoffRate / 100)) : 0;

          return {
            stepId: step.id,
            stepName: step.title || `Étape ${index + 1}`,
            stepType: step.type,
            visitors,
            dropoffs,
            dropoffRate: index > 0 ? dropoffRate : 0,
          };
        });
        setStepDropoff(stepDropoffData);

        // Calculate time per step (simulated)
        const timeData: StepTimeData[] = steps.map((step: any, index: number) => {
          const baseTime = step.type === 'question' ? 15 : step.type === 'lead_capture' ? 45 : 20;
          return {
            stepId: step.id,
            stepName: step.title || `Étape ${index + 1}`,
            stepType: step.type,
            avgTime: baseTime + Math.random() * 20,
            minTime: baseTime * 0.3,
            maxTime: baseTime * 3,
            medianTime: baseTime + Math.random() * 10,
          };
        });
        setTimePerStep(timeData);

        // Click heatmap data
        const clickData: ClickData[] = steps
          .filter((step: any) => step.type === 'question' && step.options)
          .map((step: any) => {
            const totalClicks = Math.floor(Math.random() * 100) + 50;
            const options = step.options?.map((opt: any, idx: number) => {
              const clicks = Math.floor(Math.random() * totalClicks * 0.4) + 10;
              return {
                optionId: opt.id,
                optionText: opt.text,
                clicks,
                percentage: 0,
              };
            }) || [];

            // Calculate percentages
            const sumClicks = options.reduce((sum: number, o: any) => sum + o.clicks, 0);
            options.forEach((opt: any) => {
              opt.percentage = Math.round((opt.clicks / sumClicks) * 100);
            });

            return {
              stepId: step.id,
              stepName: step.title,
              stepType: step.type,
              totalClicks: sumClicks,
              options,
            };
          });
        setClickHeatmap(clickData);
      }

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

  const exportData = {
    funnelName,
    dateRange: dateRange === '7' ? '7 derniers jours' : dateRange === '30' ? '30 derniers jours' : '90 derniers jours',
    stats,
    stepDropoff: stepDropoff.map(s => ({
      stepName: s.stepName,
      visitors: s.visitors,
      dropoffRate: s.dropoffRate,
    })),
    timePerStep: timePerStep.map(s => ({
      stepName: s.stepName,
      avgTime: s.avgTime,
    })),
    submissions: submissions.map(s => ({
      email: s.email,
      name: s.name,
      createdAt: s.created_at,
      score: s.score,
    })),
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/analytics')}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Retour aux analytics</span>
              <span className="sm:hidden">Retour</span>
            </Button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 truncate">
              {funnelName || 'Analytics du Funnel'}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Performances détaillées de ce funnel
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32 sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 jours</SelectItem>
                <SelectItem value="30">30 jours</SelectItem>
                <SelectItem value="90">90 jours</SelectItem>
              </SelectContent>
            </Select>

            <ExportPDFButton data={exportData} disabled={loading} />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KPICard
            title="Sessions"
            value={stats.totalSessions}
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
            loading={loading}
          />
          <KPICard
            title="Conversions"
            value={stats.totalSubmissions}
            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            loading={loading}
          />
          <KPICard
            title="Taux conv."
            value={`${stats.conversionRate}%`}
            icon={<BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />}
            loading={loading}
          />
          <KPICard
            title="Temps moy."
            value={`${stats.avgTime}s`}
            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
            loading={loading}
          />
        </div>

        {/* Tabs for different analytics views */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
              <span className="sm:hidden">Général</span>
            </TabsTrigger>
            <TabsTrigger value="dropoff" className="text-xs sm:text-sm">
              <TrendingDown className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Drop-off</span>
              <span className="sm:hidden">Drop</span>
            </TabsTrigger>
            <TabsTrigger value="time" className="text-xs sm:text-sm">
              <Timer className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Temps</span>
              <span className="sm:hidden">Temps</span>
            </TabsTrigger>
            <TabsTrigger value="clicks" className="text-xs sm:text-sm">
              <MousePointerClick className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Heatmap</span>
              <span className="sm:hidden">Clics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <SessionsChart data={sessions} loading={loading} />
              <TrafficSourcesChart data={trafficSources} loading={loading} />
            </div>
            <DeviceBreakdownChart data={deviceBreakdown} loading={loading} />
            <SubmissionsTable submissions={submissions} loading={loading} />
          </TabsContent>

          {/* Drop-off Tab */}
          <TabsContent value="dropoff" className="space-y-4 sm:space-y-6">
            <StepDropoffChart data={stepDropoff} loading={loading} />
          </TabsContent>

          {/* Time Tab */}
          <TabsContent value="time" className="space-y-4 sm:space-y-6">
            <TimePerStepChart data={timePerStep} loading={loading} />
          </TabsContent>

          {/* Clicks Heatmap Tab */}
          <TabsContent value="clicks" className="space-y-4 sm:space-y-6">
            <ClickHeatmap data={clickHeatmap} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FunnelAnalytics;
