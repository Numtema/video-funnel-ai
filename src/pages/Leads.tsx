import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Download, 
  Mail, 
  Phone, 
  Calendar,
  Filter,
  UserCheck,
  Users,
  TrendingUp,
  Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Lead {
  id: string;
  funnel_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  score: number;
  status: 'nouveau' | 'contacté' | 'converti';
  created_at: string;
  device?: string;
  answers?: Record<string, any>;
  funnels: {
    name: string;
  };
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [funnelFilter, setFunnelFilter] = useState('all');
  const [funnels, setFunnels] = useState<Array<{ id: string; name: string }>>([]);
  const { toast } = useToast();

  const loadLeads = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Loading leads with filters:', { statusFilter, funnelFilter, search });
      
      let query = supabase
        .from('submissions')
        .select('*, funnels!inner(name)')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (funnelFilter !== 'all') {
        query = query.eq('funnel_id', funnelFilter);
      }

      if (search) {
        query = query.or(`contact_name.ilike.%${search}%,contact_email.ilike.%${search}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Error loading leads:', error);
        throw error;
      }
      
      console.log('✅ Loaded leads:', data?.length || 0);
      setLeads(data as unknown as Lead[]);
    } catch (error: any) {
      console.error('❌ Load leads exception:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFunnels = async () => {
    const { data } = await supabase
      .from('funnels')
      .select('id, name')
      .is('deleted_at', null)
      .order('name');
    
    if (data) setFunnels(data);
  };

  useEffect(() => {
    loadFunnels();
  }, []);

  useEffect(() => {
    loadLeads();
  }, [search, statusFilter, funnelFilter]);

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      toast({ title: 'Statut mis à jour' });
      loadLeads();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Nom', 'Email', 'Téléphone', 'Funnel', 'Score', 'Statut'];
    const rows = leads.map(lead => [
      new Date(lead.created_at).toLocaleDateString('fr-FR'),
      lead.contact_name || '',
      lead.contact_email || '',
      lead.contact_phone || '',
      lead.funnels?.name || '',
      lead.score || 0,
      lead.status
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({ title: 'Export réussi', description: `${leads.length} leads exportés` });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      nouveau: { className: 'bg-blue-500', label: 'Nouveau' },
      contacté: { className: 'bg-yellow-500', label: 'Contacté' },
      converti: { className: 'bg-green-500', label: 'Converti' }
    };
    const variant = variants[status as keyof typeof variants] || variants.nouveau;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  // Test submission function
  const testSubmission = async () => {
    try {
      const { error } = await supabase.from('submissions').insert({
        funnel_id: funnels[0]?.id || 'test-funnel-id',
        session_id: `test_web_${Date.now()}`,
        contact_name: 'Test Web User',
        contact_email: `test${Date.now()}@example.com`,
        contact_phone: '+33600000000',
        subscribed: false,
        answers: { test: 'from web interface' },
        score: 75,
        status: 'nouveau'
      });

      if (error) throw error;

      toast({
        title: '✅ Test réussi',
        description: 'Soumission de test créée avec succès',
      });
      
      loadLeads();
    } catch (error: any) {
      console.error('Test submission error:', error);
      toast({
        title: '❌ Erreur de test',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const stats = {
    total: leads.length,
    nouveau: leads.filter(l => l.status === 'nouveau').length,
    contacté: leads.filter(l => l.status === 'contacté').length,
    converti: leads.filter(l => l.status === 'converti').length,
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Gestion des Leads</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              {stats.total} leads au total
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={testSubmission} variant="outline" size="lg">
              🧪 Tester
            </Button>
            <Button onClick={exportToCSV} size="lg" disabled={leads.length === 0}>
              <Download className="mr-2 h-5 w-5" />
              Exporter CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
              <Badge className="bg-blue-500">{stats.nouveau}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nouveau}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contactés</CardTitle>
              <Badge className="bg-yellow-500">{stats.contacté}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contacté}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Convertis</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.converti}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="nouveau">Nouveau</SelectItem>
                    <SelectItem value="contacté">Contacté</SelectItem>
                    <SelectItem value="converti">Converti</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={funnelFilter} onValueChange={setFunnelFilter}>
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue placeholder="Funnel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les funnels</SelectItem>
                    {funnels.map(funnel => (
                      <SelectItem key={funnel.id} value={funnel.id}>
                        {funnel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Funnel</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Aucun lead trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lead.contact_name || 'N/A'}</div>
                            {lead.contact_email && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {lead.contact_email}
                              </div>
                            )}
                            {lead.contact_phone && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {lead.contact_phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{lead.funnels?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{lead.score || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={lead.status}
                            onValueChange={(value) => updateLeadStatus(lead.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              {getStatusBadge(lead.status)}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nouveau">Nouveau</SelectItem>
                              <SelectItem value="contacté">Contacté</SelectItem>
                              <SelectItem value="converti">Converti</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Détails du lead - {lead.contact_name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-semibold mb-2">Informations de contact</h3>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Email:</strong> {lead.contact_email}</p>
                                      {lead.contact_phone && <p><strong>Téléphone:</strong> {lead.contact_phone}</p>}
                                      <p><strong>Score:</strong> {lead.score}</p>
                                      {lead.device && <p><strong>Appareil:</strong> {lead.device}</p>}
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold mb-2">Réponses du funnel</h3>
                                    <div className="space-y-3">
                                      {lead.answers && Object.entries(lead.answers).map(([stepId, answer]: [string, any]) => (
                                        <div key={stepId} className="border rounded-lg p-3 bg-muted/50">
                                          <p className="text-sm font-medium mb-1">Étape: {stepId}</p>
                                          <div className="text-sm">
                                            {typeof answer === 'object' && answer !== null ? (
                                              <div className="space-y-1">
                                                {answer.text && <p><strong>Réponse:</strong> {answer.text}</p>}
                                                {answer.value !== undefined && <p><strong>Valeur:</strong> {String(answer.value)}</p>}
                                                {answer.score !== undefined && <p><strong>Points:</strong> {answer.score}</p>}
                                                {answer.label && <p><strong>Choix:</strong> {answer.label}</p>}
                                              </div>
                                            ) : (
                                              <p>{String(answer)}</p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                      {(!lead.answers || Object.keys(lead.answers).length === 0) && (
                                        <p className="text-sm text-muted-foreground">Aucune réponse enregistrée</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {lead.contact_email && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(`mailto:${lead.contact_email}`)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                            {lead.contact_phone && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(`tel:${lead.contact_phone}`)}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Leads;
