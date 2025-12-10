import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportData {
  funnelName: string;
  dateRange: string;
  stats: {
    totalSessions: number;
    totalSubmissions: number;
    conversionRate: number;
    avgTime: number;
  };
  stepDropoff?: Array<{
    stepName: string;
    visitors: number;
    dropoffRate: number;
  }>;
  timePerStep?: Array<{
    stepName: string;
    avgTime: number;
  }>;
  submissions?: Array<{
    email: string;
    name?: string;
    createdAt: string;
    score?: number;
  }>;
}

interface ExportPDFButtonProps {
  data: ExportData;
  disabled?: boolean;
}

export function ExportPDFButton({ data, disabled }: ExportPDFButtonProps) {
  const [exporting, setExporting] = useState<'pdf' | 'csv' | null>(null);
  const { toast } = useToast();

  const generatePDFContent = (): string => {
    const { funnelName, dateRange, stats, stepDropoff, timePerStep, submissions } = data;

    let content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Rapport Analytics - ${funnelName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1a1a2e; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #6366f1; }
    .header h1 { font-size: 28px; color: #6366f1; margin-bottom: 8px; }
    .header p { color: #666; font-size: 14px; }
    .section { margin-bottom: 30px; }
    .section h2 { font-size: 18px; color: #1a1a2e; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
    .stat-card { background: #f8fafc; padding: 20px; border-radius: 12px; text-align: center; }
    .stat-value { font-size: 32px; font-weight: 700; color: #6366f1; }
    .stat-label { font-size: 12px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
    th { background: #f8fafc; font-weight: 600; color: #374151; }
    tr:hover { background: #f8fafc; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #999; }
    .highlight { color: #6366f1; font-weight: 600; }
    .warning { color: #f59e0b; }
    .danger { color: #ef4444; }
    .success { color: #10b981; }
    @media print {
      body { padding: 20px; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Rapport Analytics</h1>
    <p>${funnelName} • ${dateRange}</p>
    <p style="margin-top: 8px; font-size: 12px;">Généré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
  </div>

  <div class="section">
    <h2>📈 Métriques clés</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.totalSessions}</div>
        <div class="stat-label">Sessions</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.totalSubmissions}</div>
        <div class="stat-label">Conversions</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.conversionRate}%</div>
        <div class="stat-label">Taux de conversion</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.avgTime}s</div>
        <div class="stat-label">Temps moyen</div>
      </div>
    </div>
  </div>`;

    if (stepDropoff && stepDropoff.length > 0) {
      content += `
  <div class="section">
    <h2>📉 Drop-off par étape</h2>
    <table>
      <thead>
        <tr>
          <th>Étape</th>
          <th>Visiteurs</th>
          <th>Taux d'abandon</th>
        </tr>
      </thead>
      <tbody>`;
      stepDropoff.forEach((step, index) => {
        const dropoffClass = step.dropoffRate > 30 ? 'danger' : step.dropoffRate > 15 ? 'warning' : 'success';
        content += `
        <tr>
          <td><strong>${index + 1}.</strong> ${step.stepName}</td>
          <td>${step.visitors}</td>
          <td class="${dropoffClass}">${step.dropoffRate}%</td>
        </tr>`;
      });
      content += `
      </tbody>
    </table>
  </div>`;
    }

    if (timePerStep && timePerStep.length > 0) {
      content += `
  <div class="section">
    <h2>⏱️ Temps par étape</h2>
    <table>
      <thead>
        <tr>
          <th>Étape</th>
          <th>Temps moyen</th>
        </tr>
      </thead>
      <tbody>`;
      timePerStep.forEach((step, index) => {
        const time = step.avgTime < 60 ? `${Math.round(step.avgTime)}s` : `${Math.floor(step.avgTime / 60)}m ${Math.round(step.avgTime % 60)}s`;
        content += `
        <tr>
          <td><strong>${index + 1}.</strong> ${step.stepName}</td>
          <td>${time}</td>
        </tr>`;
      });
      content += `
      </tbody>
    </table>
  </div>`;
    }

    if (submissions && submissions.length > 0) {
      content += `
  <div class="section">
    <h2>👥 Leads capturés (${submissions.length})</h2>
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Nom</th>
          <th>Date</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>`;
      submissions.slice(0, 50).forEach((sub) => {
        content += `
        <tr>
          <td>${sub.email}</td>
          <td>${sub.name || '-'}</td>
          <td>${new Date(sub.createdAt).toLocaleDateString('fr-FR')}</td>
          <td class="highlight">${sub.score ?? '-'}</td>
        </tr>`;
      });
      if (submissions.length > 50) {
        content += `
        <tr>
          <td colspan="4" style="text-align: center; color: #999;">... et ${submissions.length - 50} autres leads</td>
        </tr>`;
      }
      content += `
      </tbody>
    </table>
  </div>`;
    }

    content += `
  <div class="footer">
    <p>Rapport généré par Nümtema Face • ${window.location.origin}</p>
  </div>
</body>
</html>`;

    return content;
  };

  const exportPDF = async () => {
    setExporting('pdf');
    try {
      const htmlContent = generatePDFContent();
      const printWindow = window.open('', '_blank');

      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for content to load then print
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 250);
        };

        toast({
          title: 'Export PDF',
          description: 'La fenêtre d\'impression s\'est ouverte. Sélectionnez "Enregistrer en PDF".',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le PDF',
        variant: 'destructive',
      });
    } finally {
      setExporting(null);
    }
  };

  const exportCSV = async () => {
    setExporting('csv');
    try {
      const { funnelName, submissions } = data;

      if (!submissions || submissions.length === 0) {
        toast({
          title: 'Aucune donnée',
          description: 'Pas de leads à exporter',
          variant: 'destructive',
        });
        setExporting(null);
        return;
      }

      // Build CSV
      const headers = ['Email', 'Nom', 'Date', 'Score'];
      const rows = submissions.map(sub => [
        sub.email,
        sub.name || '',
        new Date(sub.createdAt).toLocaleDateString('fr-FR'),
        sub.score?.toString() || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Download
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${funnelName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export CSV',
        description: `${submissions.length} leads exportés avec succès`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'exporter en CSV',
        variant: 'destructive',
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || !!exporting}>
          {exporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          <span className="hidden sm:inline">Exporter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportPDF} disabled={!!exporting}>
          <FileText className="w-4 h-4 mr-2" />
          Rapport PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportCSV} disabled={!!exporting}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Leads CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
