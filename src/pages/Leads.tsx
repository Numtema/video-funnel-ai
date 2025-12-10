import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
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
  Eye,
  Tag,
  Plus,
  X
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  tags?: string[];
  funnels: {
    name: string;
  };
}

// Predefined avatar/tag colors for lead segmentation
const TAG_COLORS: Record<string, string> = {
  'Chaud': 'bg-red-500 text-white',
  'Tiède': 'bg-orange-500 text-white',
  'Froid': 'bg-blue-500 text-white',
  'VIP': 'bg-purple-500 text-white',
  'Qualifié': 'bg-green-500 text-white',
  'À rappeler': 'bg-yellow-500 text-black',
  'Intéressé': 'bg-teal-500 text-white',
  'Premium': 'bg-pink-500 text-white',
};

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [funnelFilter, setFunnelFilter] = useState('all');
  const [funnels, setFunnels] = useState<Array<{ id: string; name: string }>>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadLeads = async () => {
    try {
      setLoading(true);
      
      // Get current user to ensure data isolation
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }
      
      console.log('🔍 Loading leads with filters:', { statusFilter, funnelFilter, search });
      
      // RLS handles filtering, but we add explicit user_id filter for clarity and performance
      let query = supabase
        .from('submissions')
        .select('*, funnels!inner(name, user_id)')
        .eq('funnels.user_id', user.id)
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
    // Get current user to ensure data isolation
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase
      .from('funnels')
      .select('id, name')
      .eq('user_id', user.id)
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

  // Setup realtime subscription for automatic lead updates
  useEffect(() => {
    if (!user) return;

    console.log('🔴 Setting up realtime subscription for leads page');

    const channel = supabase
      .channel('leads-page-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
        },
        async (payload) => {
          console.log('🔄 Lead update detected:', payload);
          
          // Verify the submission belongs to the current user's funnels
          if (payload.new) {
            const { data: funnel } = await supabase
              .from('funnels')
              .select('user_id')
              .eq('id', (payload.new as any).funnel_id)
              .single();
            
            if (funnel && funnel.user_id === user.id) {
              loadLeads();
            }
          } else {
            loadLeads();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔴 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user, search, statusFilter, funnelFilter]);

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

  // Tag management functions
  const getLeadTags = (lead: Lead): string[] => {
    // Tags can come from ai_analysis or from a tags field in answers
    const aiTags = (lead.answers as any)?.tags || [];
    return Array.isArray(aiTags) ? aiTags : [];
  };

  const updateLeadTags = async (leadId: string, tags: string[]) => {
    try {
      // Get existing answers
      const lead = leads.find(l => l.id === leadId);
      const currentAnswers = lead?.answers || {};
      
      const { error } = await supabase
        .from('submissions')
        .update({ 
          answers: { ...currentAnswers, tags }
        })
        .eq('id', leadId);

      if (error) throw error;

      // Update local state
      setLeads(prev => prev.map(l => 
        l.id === leadId ? { ...l, answers: { ...l.answers, tags } } : l
      ));

      toast({ title: 'Tags mis à jour' });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const addTagToLead = (leadId: string, tag: string) => {
    const lead = leads.find(l => l.id === leadId);
    const currentTags = getLeadTags(lead!);
    if (!currentTags.includes(tag)) {
      updateLeadTags(leadId, [...currentTags, tag]);
    }
  };

  const removeTagFromLead = (leadId: string, tag: string) => {
    const lead = leads.find(l => l.id === leadId);
    const currentTags = getLeadTags(lead!);
    updateLeadTags(leadId, currentTags.filter(t => t !== tag));
  };

  // Tag component for display
  const LeadTagsDisplay = ({ lead }: { lead: Lead }) => {
    const tags = getLeadTags(lead);
    const availableTags = Object.keys(TAG_COLORS);
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-auto p-1 flex flex-wrap gap-1 max-w-[200px] justify-start">
            {tags.length > 0 ? (
              tags.map(tag => (
                <Badge 
                  key={tag} 
                  className={`${TAG_COLORS[tag] || 'bg-gray-500 text-white'} text-xs`}
                >
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Ajouter
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <div className="space-y-2">
            <p className="text-sm font-medium">Tags Avatar</p>
            <div className="flex flex-wrap gap-1">
              {availableTags.map(tag => {
                const isActive = tags.includes(tag);
                return (
                  <Button
                    key={tag}
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    className={`h-7 text-xs ${isActive ? TAG_COLORS[tag] : ''}`}
                    onClick={() => isActive ? removeTagFromLead(lead.id, tag) : addTagToLead(lead.id, tag)}
                  >
                    {tag}
                    {isActive && <X className="h-3 w-3 ml-1" />}
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
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
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testSubmission} variant="outline" size="sm" className="hidden sm:flex">
              Test
            </Button>
            <Button onClick={exportToCSV} size="sm" disabled={leads.length === 0} className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Exporter CSV</span>
              <span className="sm:hidden">Export</span>
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
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Funnel</TableHead>
                    <TableHead className="hidden lg:table-cell">Score</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Aucun lead trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="whitespace-nowrap hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{new Date(lead.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="min-w-0">
                            <div className="font-medium truncate max-w-[150px] sm:max-w-none">{lead.contact_name || 'N/A'}</div>
                            <div className="sm:hidden text-xs text-muted-foreground">
                              {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                            </div>
                            {lead.contact_email && (
                              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{lead.contact_email}</span>
                              </div>
                            )}
                            {lead.contact_phone && (
                              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                {lead.contact_phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="truncate max-w-[120px] block">{lead.funnels?.name || 'N/A'}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline">{lead.score || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <LeadTagsDisplay lead={lead} />
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
