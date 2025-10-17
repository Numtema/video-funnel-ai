import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { funnelService } from '@/services/funnelService';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react';

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    thumbnail_url: string | null;
    config: any;
  };
  category?: {
    name: string;
    icon: string;
  };
}

export function TemplateCard({ template, category }: TemplateCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const CategoryIcon = category?.icon ? (LucideIcons as any)[category.icon] : null;

  const handleUseTemplate = async () => {
    setLoading(true);
    try {
      const funnel = await funnelService.create({
        name: template.name,
        description: template.description,
        config: template.config,
      });

      toast({
        title: 'Template utilisé',
        description: 'Votre funnel a été créé avec succès',
      });

      navigate(`/funnels/${funnel.id}/edit`);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de créer le funnel',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription className="mt-2">
              {template.description}
            </CardDescription>
          </div>
          {category && CategoryIcon && (
            <CategoryIcon className="h-5 w-5 text-muted-foreground ml-2 flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {category && (
          <Badge variant="secondary">{category.name}</Badge>
        )}
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{template.config?.steps?.length || 0} étapes</span>
        </div>

        <Button 
          onClick={handleUseTemplate} 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Création...' : 'Utiliser ce template'}
        </Button>
      </CardContent>
    </Card>
  );
}
