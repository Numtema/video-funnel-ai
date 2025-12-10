import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Sparkles, Target, ClipboardList, Video, Rocket, Eye, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CreateFunnelModal from '@/components/funnels/CreateFunnelModal';
import { FUNNEL_TEMPLATES, TEMPLATE_CATEGORIES, FunnelTemplate } from '@/data/funnelTemplates';
import { funnelService } from '@/services/funnelService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Target,
  ClipboardList,
  Video,
  Rocket,
};

export default function Templates() {
  const [filteredTemplates, setFilteredTemplates] = useState<FunnelTemplate[]>(FUNNEL_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<FunnelTemplate | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    filterTemplates();
  }, [selectedCategory, searchQuery]);

  const filterTemplates = () => {
    let filtered = FUNNEL_TEMPLATES;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category.toLowerCase() === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleUseTemplate = async (template: FunnelTemplate) => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Connectez-vous pour utiliser ce template',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setLoadingTemplate(template.id);
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
      setLoadingTemplate(null);
      setPreviewTemplate(null);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const Icon = CATEGORY_ICONS[iconName];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  return (
    <MainLayout>
      <div className="space-y-8 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Templates de Funnels</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Démarrez rapidement avec nos templates professionnels pré-configurés
            </p>
          </div>
          <Button
            onClick={() => setCreateModalOpen(true)}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Créer avec l'IA
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {TEMPLATE_CATEGORIES.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span className="flex items-center gap-2">
                    {getCategoryIcon(cat.icon)}
                    {cat.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun template trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map(template => (
              <Card
                key={template.id}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50"
              >
                {/* Preview Banner */}
                <div
                  className="h-32 relative overflow-hidden"
                  style={{ backgroundColor: template.color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getCategoryIcon(template.categoryIcon) && (
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {CATEGORY_ICONS[template.categoryIcon] &&
                          <span className="text-white">
                            {(() => {
                              const Icon = CATEGORY_ICONS[template.categoryIcon];
                              return <Icon className="h-8 w-8" />;
                            })()}
                          </span>
                        }
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {template.config.steps.length} étapes
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{template.name}</CardTitle>
                      <Badge variant="outline" className="mt-2">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-2 min-h-[40px]">
                    {template.description}
                  </CardDescription>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {template.config.scoring?.enabled && (
                      <Badge variant="secondary" className="text-xs">
                        Scoring
                      </Badge>
                    )}
                    {template.config.scoring?.segments && (
                      <Badge variant="secondary" className="text-xs">
                        Segments
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Aperçu
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleUseTemplate(template)}
                      disabled={loadingTemplate === template.id}
                    >
                      {loadingTemplate === template.id ? (
                        'Création...'
                      ) : (
                        <>
                          <Layers className="h-4 w-4 mr-1" />
                          Utiliser
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {previewTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: previewTemplate.color }}
                  >
                    {CATEGORY_ICONS[previewTemplate.categoryIcon] && (
                      <span className="text-white">
                        {(() => {
                          const Icon = CATEGORY_ICONS[previewTemplate.categoryIcon];
                          return <Icon className="h-5 w-5" />;
                        })()}
                      </span>
                    )}
                  </div>
                  {previewTemplate.name}
                </DialogTitle>
                <DialogDescription>
                  {previewTemplate.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Steps Preview */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Structure du funnel ({previewTemplate.config.steps.length} étapes)
                  </h4>
                  <div className="space-y-2">
                    {previewTemplate.config.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ backgroundColor: previewTemplate.color }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{step.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {step.type.replace('_', ' ')}
                            {step.options && ` • ${step.options.length} options`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scoring Preview */}
                {previewTemplate.config.scoring?.enabled && previewTemplate.config.scoring.segments && (
                  <div>
                    <h4 className="font-semibold mb-3">Segments de scoring</h4>
                    <div className="flex gap-2 flex-wrap">
                      {previewTemplate.config.scoring.segments.map(segment => (
                        <Badge
                          key={segment.id}
                          style={{ backgroundColor: segment.color, color: '#fff' }}
                        >
                          {segment.label} ({segment.minScore}-{segment.maxScore} pts)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Theme Preview */}
                <div>
                  <h4 className="font-semibold mb-3">Thème</h4>
                  <div className="flex gap-2">
                    {Object.entries(previewTemplate.config.theme.colors).map(([key, color]) => (
                      <div key={key} className="text-center">
                        <div
                          className="w-10 h-10 rounded-lg border shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-xs text-muted-foreground mt-1 capitalize">{key}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleUseTemplate(previewTemplate)}
                  disabled={loadingTemplate === previewTemplate.id}
                >
                  {loadingTemplate === previewTemplate.id ? (
                    'Création en cours...'
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Utiliser ce template
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <CreateFunnelModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </MainLayout>
  );
}
