import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

const generateMockData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      submissions: Math.floor(Math.random() * 50) + 10,
      views: Math.floor(Math.random() * 200) + 50,
    });
  }
  
  return data;
};

export function PerformanceChart() {
  const [period, setPeriod] = useState<7 | 30 | 90>(30);
  const data = generateMockData(period);

  const handleExport = () => {
    const csv = [
      ['Date', 'Vues', 'Submissions'],
      ...data.map(d => [d.date, d.views, d.submissions])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-${period}j.csv`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Performance ({period} derniers jours)</CardTitle>
          <div className="flex gap-2">
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={period === 7 ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPeriod(7)}
              >
                7j
              </Button>
              <Button
                variant={period === 30 ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPeriod(30)}
              >
                30j
              </Button>
              <Button
                variant={period === 90 ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPeriod(90)}
              >
                90j
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Vues"
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="submissions"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              name="Submissions"
              dot={{ fill: 'hsl(var(--accent))', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}