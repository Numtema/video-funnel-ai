import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SessionsChartProps {
  data: Array<{ date: string; sessions: number }>;
  loading?: boolean;
}

export function SessionsChart({ data, loading }: SessionsChartProps) {
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
      <h3 className="text-lg font-semibold mb-4">Sessions au fil du temps</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="sessions" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
