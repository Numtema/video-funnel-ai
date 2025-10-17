import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowRight, MoreVertical, Edit, BarChart3, Share2, Copy } from 'lucide-react';
import { funnelService } from '@/services/funnelService';
import { Funnel } from '@/types/funnel';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function RecentFunnelsTable() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadFunnels();
  }, []);

  const loadFunnels = async () => {
    try {
      const data = await funnelService.list();
      setFunnels(data.slice(0, 5)); // Only show 5 most recent
    } catch (error) {
      console.error('Error loading funnels:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (funnel: Funnel) => {
    if (!funnel.is_active) {
      return <Badge variant="secondary">Inactif</Badge>;
    }
    if (funnel.is_published) {
      return <Badge className="bg-success text-success-foreground">Publié</Badge>;
    }
    return <Badge variant="outline">Brouillon</Badge>;
  };

  const getConversionRate = (funnel: Funnel) => {
    if (funnel.total_views === 0) return '0%';
    return ((funnel.total_submissions / funnel.total_views) * 100).toFixed(1) + '%';
  };

  const handleCopyLink = async (funnel: Funnel) => {
    const shareUrl = `${window.location.origin}/f/${funnel.share_token}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Lien copié',
        description: 'Le lien de partage a été copié dans le presse-papiers',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le lien',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funnels récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Chargement...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (funnels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funnels récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun funnel créé pour le moment</p>
            <Button
              className="mt-4"
              onClick={() => navigate('/funnels')}
            >
              Créer mon premier funnel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Funnels récents</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/funnels')}
          >
            Voir tous
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Vues</TableHead>
              <TableHead className="text-right">Conversions</TableHead>
              <TableHead className="text-right">Taux</TableHead>
              <TableHead>Modifié</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funnels.map((funnel) => (
              <TableRow key={funnel.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{funnel.name}</TableCell>
                <TableCell>{getStatusBadge(funnel)}</TableCell>
                <TableCell className="text-right">{funnel.total_views}</TableCell>
                <TableCell className="text-right">{funnel.total_submissions}</TableCell>
                <TableCell className="text-right font-medium">
                  {getConversionRate(funnel)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(funnel.updated_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/funnels/${funnel.id}/edit`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Éditer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/analytics?funnel=${funnel.id}`)}>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyLink(funnel)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Copier le lien
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}