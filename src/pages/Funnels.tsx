import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { funnelService } from '@/services/funnelService';
import { Funnel } from '@/types/funnel';
import MainLayout from '@/components/layout/MainLayout';
import CreateFunnelModal from '@/components/funnels/CreateFunnelModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  PlusCircle,
  Search,
  Video,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Share2,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Grid3x3,
  List
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Funnels = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadFunnels = async () => {
    try {
      setLoading(true);
      const data = await funnelService.list({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setFunnels(data);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunnels();
  }, [search, statusFilter]);

  const handleEdit = (id: string) => {
    navigate(`/funnels/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce funnel ?')) return;
    
    try {
      await funnelService.delete(id);
      toast({ title: "Funnel supprimé" });
      loadFunnels();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await funnelService.duplicate(id);
      toast({ title: "Funnel dupliqué" });
      loadFunnels();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (funnel: Funnel) => {
    try {
      if (funnel.is_published) {
        await funnelService.unpublish(funnel.id);
        toast({ title: "Funnel dépublié" });
      } else {
        await funnelService.publish(funnel.id);
        toast({ title: "Funnel publié" });
      }
      loadFunnels();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = (shareToken: string) => {
    const url = `${window.location.origin}/f/${shareToken}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Lien copié !" });
  };

  const getStatusBadge = (funnel: Funnel) => {
    if (!funnel.is_active) return <Badge variant="secondary">Inactif</Badge>;
    if (funnel.is_published) return <Badge className="bg-success">Publié</Badge>;
    return <Badge variant="outline">Brouillon</Badge>;
  };

  const getConversionRate = (funnel: Funnel) => {
    if (funnel.total_views === 0) return '0%';
    return `${Math.round((funnel.total_submissions / funnel.total_views) * 100)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Mes Funnels</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              {funnels.length} / {profile?.max_funnels || 3} funnels utilisés
            </p>
          </div>
          <Button size="lg" onClick={() => setCreateModalOpen(true)} className="shadow-elegant w-full sm:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nouveau Funnel
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un funnel..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="published">Publiés</SelectItem>
                    <SelectItem value="draft">Brouillons</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funnels Grid/List */}
        {funnels.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Video className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Aucun funnel trouvé</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {search ? 'Essayez une autre recherche' : 'Créez votre premier funnel pour commencer'}
              </p>
              {!search && (
                <Button size="lg" onClick={() => setCreateModalOpen(true)} className="shadow-elegant">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Créer mon premier funnel
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">{/* ... keep existing grid code ... */}
            {funnels.map((funnel) => (
              <Card key={funnel.id} className="hover:shadow-elegant transition-smooth group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{funnel.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {funnel.description || 'Aucune description'}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/funnels/${funnel.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Éditer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/f/${funnel.share_token}`, '_blank')}>
                          <Eye className="mr-2 h-4 w-4" />
                          Prévisualiser
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/analytics/${funnel.id}`)}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyLink(funnel.share_token)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Copier le lien
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(funnel.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleTogglePublish(funnel)}>
                          {funnel.is_published ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Dépublier
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Publier
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(funnel.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2">{getStatusBadge(funnel)}</div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{funnel.total_views}</div>
                      <div className="text-xs text-muted-foreground">Vues</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">{funnel.total_submissions}</div>
                      <div className="text-xs text-muted-foreground">Conversions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success">{getConversionRate(funnel)}</div>
                      <div className="text-xs text-muted-foreground">Taux</div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Modifié {new Date(funnel.updated_at).toLocaleDateString('fr-FR')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {funnels.map((funnel) => (
                  <div key={funnel.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-muted/50 transition-colors gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold truncate">{funnel.name}</h3>
                        {getStatusBadge(funnel)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {funnel.description || 'Aucune description'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 sm:ml-4">
                      <div className="flex gap-4 sm:gap-8">
                        <div className="text-center">
                          <div className="font-semibold text-sm sm:text-base">{funnel.total_views}</div>
                          <div className="text-xs text-muted-foreground">Vues</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-sm sm:text-base">{funnel.total_submissions}</div>
                          <div className="text-xs text-muted-foreground">Conv.</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-sm sm:text-base">{getConversionRate(funnel)}</div>
                          <div className="text-xs text-muted-foreground">Taux</div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/funnels/${funnel.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Éditer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`/f/${funnel.share_token}`, '_blank')}>
                            <Eye className="mr-2 h-4 w-4" />
                            Prévisualiser
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyLink(funnel.share_token)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Copier le lien
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(funnel.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(funnel.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <CreateFunnelModal 
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
        />
      </div>
    </MainLayout>
  );
};

export default Funnels;
