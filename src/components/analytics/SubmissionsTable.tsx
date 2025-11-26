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
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold">Soumissions</h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Button variant="outline" onClick={exportCSV} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            <span className="sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap hidden md:table-cell">Funnel</TableHead>
              <TableHead className="whitespace-nowrap">Contact</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap hidden sm:table-cell">Score</TableHead>
              <TableHead className="whitespace-nowrap hidden lg:table-cell">Appareil</TableHead>
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
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(sub.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{sub.funnel?.name || '-'}</TableCell>
                  <TableCell className="whitespace-nowrap">{sub.contact_name || '-'}</TableCell>
                  <TableCell className="whitespace-nowrap">{sub.contact_email || '-'}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {sub.score !== null ? (
                      <Badge variant={sub.score >= 50 ? 'default' : 'secondary'}>
                        {sub.score}
                      </Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="capitalize hidden lg:table-cell">{sub.device || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
