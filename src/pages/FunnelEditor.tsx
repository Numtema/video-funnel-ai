import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { funnelService } from '@/services/funnelService';
import { Funnel, QuizConfig, QuizStep, StepType } from '@/types/funnel';
import { Save, Eye, Share2, MoreVertical, ArrowLeft } from 'lucide-react';
import { StepNavigator } from '@/components/editor/StepNavigator';
import { StepEditor } from '@/components/editor/StepEditor';
import { PreviewPane } from '@/components/editor/PreviewPane';
import { FunnelSettings } from '@/components/editor/FunnelSettings';

export default function FunnelEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (id) {
      loadFunnel();
    }
  }, [id]);

  const loadFunnel = async () => {
    try {
      const data = await funnelService.getById(id!);
      setFunnel(data);
      setConfig(data.config);
      
      if (data.config.steps.length > 0 && !selectedStepId) {
        setSelectedStepId(data.config.steps[0].id);
      }
    } catch (error) {
      console.error('Error loading funnel:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le funnel',
        variant: 'destructive',
      });
      navigate('/funnels');
    }
  };

  const handleSave = async () => {
    if (!config || !id) return;

    setIsSaving(true);
    try {
      await funnelService.update(id, { config });
      setHasUnsavedChanges(false);
      toast({
        title: 'Sauvegardé',
        description: 'Vos modifications ont été enregistrées',
      });
    } catch (error) {
      console.error('Error saving funnel:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le funnel',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateConfig = (newConfig: QuizConfig) => {
    setConfig(newConfig);
    setHasUnsavedChanges(true);
  };

  const handleAddStep = (type: StepType) => {
    if (!config) return;

    const newStep: QuizStep = {
      id: `step-${Date.now()}`,
      type,
      title: getDefaultTitle(type),
      description: '',
      media: { type: 'none', url: '' },
      ...(type === StepType.Question && {
        options: []
      }),
      ...(type === StepType.LeadCapture && {
        fields: ['name', 'email']
      }),
    };

    const newConfig = {
      ...config,
      steps: [...config.steps, newStep]
    };

    handleUpdateConfig(newConfig);
    setSelectedStepId(newStep.id);
  };

  const handleDeleteStep = (stepId: string) => {
    if (!config) return;

    const newConfig = {
      ...config,
      steps: config.steps.filter(s => s.id !== stepId)
    };

    handleUpdateConfig(newConfig);
    
    if (selectedStepId === stepId && newConfig.steps.length > 0) {
      setSelectedStepId(newConfig.steps[0].id);
    }
  };

  const handleUpdateStep = (updatedStep: QuizStep) => {
    if (!config) return;

    const newConfig = {
      ...config,
      steps: config.steps.map(s => s.id === updatedStep.id ? updatedStep : s)
    };

    handleUpdateConfig(newConfig);
  };

  const handleReorderSteps = (steps: QuizStep[]) => {
    if (!config) return;

    handleUpdateConfig({
      ...config,
      steps
    });
  };

  const handlePreview = () => {
    if (!funnel) return;
    window.open(`/f/${funnel.share_token}`, '_blank');
  };

  const handleShare = async () => {
    if (!funnel) return;

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

  const getDefaultTitle = (type: StepType): string => {
    const titles = {
      [StepType.Welcome]: 'Bienvenue',
      [StepType.Question]: 'Question',
      [StepType.Message]: 'Message',
      [StepType.LeadCapture]: 'Vos Coordonnées',
      [StepType.CalendarEmbed]: 'Planifier un Rendez-vous',
    };
    return titles[type];
  };

  const selectedStep = config?.steps.find(s => s.id === selectedStepId);

  if (!funnel || !config) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Action Bar */}
      <div className="h-16 border-b bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/funnels')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{funnel.name}</h1>
            {hasUnsavedChanges && (
              <p className="text-xs text-muted-foreground">Modifications non sauvegardées</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>

          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 3 Columns Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Step Navigator */}
        <div className="w-72 border-r bg-card overflow-y-auto">
          <StepNavigator
            steps={config.steps}
            selectedStepId={selectedStepId}
            onSelectStep={setSelectedStepId}
            onAddStep={handleAddStep}
            onDeleteStep={handleDeleteStep}
            onReorder={handleReorderSteps}
          />
        </div>

        {/* Center: Step Editor */}
        <div className="flex-1 overflow-y-auto">
          {selectedStep ? (
            <StepEditor
              step={selectedStep}
              onUpdate={handleUpdateStep}
              onDelete={() => handleDeleteStep(selectedStep.id)}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="mb-2">Aucune étape sélectionnée</p>
                <p className="text-sm">Créez une nouvelle étape pour commencer</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview & Settings */}
        <div className="w-96 border-l bg-card overflow-y-auto">
          <PreviewPane
            step={selectedStep}
            theme={config.theme}
          />
          
          <FunnelSettings
            config={config}
            onUpdate={handleUpdateConfig}
          />
        </div>
      </div>
    </div>
  );
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}

function getSource(): string {
  return document.referrer || 'direct';
}

async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}