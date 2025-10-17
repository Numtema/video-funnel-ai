import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DeviceBreakdownChartProps {
  data: Array<{ device: string; sessions: number; conversions: number }>;
  loading?: boolean;
}

export function DeviceBreakdownChart({ data, loading }: DeviceBreakdownChartProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-4 bg-muted rounded w-48 mb-4"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Répartition par appareil</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="device" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sessions" fill="hsl(var(--primary))" />
          <Bar dataKey="conversions" fill="hsl(var(--success))" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
