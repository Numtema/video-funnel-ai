import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TrafficSourcesChartProps {
  data: Array<{ name: string; value: number }>;
  loading?: boolean;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(142, 71%, 65%)',
  'hsl(0, 18%, 67%)'
];

export function TrafficSourcesChart({ data, loading }: TrafficSourcesChartProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-4 bg-muted rounded w-48 mb-4"></div>
        <div className="h-64 bg-muted rounded-full animate-pulse mx-auto" style={{ width: 256 }}></div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Sources de trafic</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="hsl(var(--primary))"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
