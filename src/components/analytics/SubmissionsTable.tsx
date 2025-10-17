import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Search } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Submission {
  id: string;
  created_at: string;
  contact_name: string | null;
  contact_email: string | null;
  score: number | null;
  device: string | null;
  funnel?: { name: string };
}

interface SubmissionsTableProps {
  submissions: Submission[];
  loading?: boolean;
}

export function SubmissionsTable({ submissions, loading }: SubmissionsTableProps) {
  const [search, setSearch] = useState('');

  const filteredSubmissions = submissions.filter(sub => 
    sub.contact_email?.toLowerCase().includes(search.toLowerCase()) ||
    sub.contact_name?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Date', 'Funnel', 'Nom', 'Email', 'Score', 'Appareil'];
    const rows = filteredSubmissions.map(sub => [
      format(new Date(sub.created_at), 'dd/MM/yyyy HH:mm', { locale: fr }),
      sub.funnel?.name || 'N/A',
      sub.contact_name || 'N/A',
      sub.contact_email || 'N/A',
      sub.score?.toString() || 'N/A',
      sub.device || 'N/A'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-8 bg-muted rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Soumissions</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Funnel</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Appareil</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucune soumission trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    {format(new Date(sub.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>{sub.funnel?.name || '-'}</TableCell>
                  <TableCell>{sub.contact_name || '-'}</TableCell>
                  <TableCell>{sub.contact_email || '-'}</TableCell>
                  <TableCell>
                    {sub.score !== null ? (
                      <Badge variant={sub.score >= 50 ? 'default' : 'secondary'}>
                        {sub.score}
                      </Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="capitalize">{sub.device || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
