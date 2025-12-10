import { useState } from 'react';
import { QuizConfig } from '@/types/funnel';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Zap,
  Webhook,
  Calendar,
  Send,
  CheckCircle2,
  ExternalLink,
  Copy,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IntegrationsTabProps {
  config: QuizConfig;
  funnelId: string;
  onUpdate: (config: QuizConfig) => void;
}

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  docsUrl: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'zapier',
    name: 'Zapier',
    icon: <Zap className="w-5 h-5" />,
    description: 'Connectez à 5000+ apps',
    color: '#FF4A00',
    docsUrl: 'https://zapier.com/apps/webhooks/integrations',
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    icon: <Webhook className="w-5 h-5" />,
    description: 'Automatisations visuelles',
    color: '#6D00CC',
    docsUrl: 'https://www.make.com/en/help/tools/webhooks',
  },
  {
    id: 'n8n',
    name: 'n8n',
    icon: <Send className="w-5 h-5" />,
    description: 'Open-source automation',
    color: '#EA4B71',
    docsUrl: 'https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.webhook/',
  },
];

const CALENDAR_PROVIDERS = [
  { id: 'calendly', name: 'Calendly', placeholder: 'https://calendly.com/votre-nom' },
  { id: 'cal', name: 'Cal.com', placeholder: 'https://cal.com/votre-nom' },
  { id: 'custom', name: 'Autre (iframe)', placeholder: 'https://...' },
];

export function IntegrationsTab({ config, funnelId, onUpdate }: IntegrationsTabProps) {
  const { toast } = useToast();
  const [testingWebhook, setTestingWebhook] = useState(false);

  const webhookUrl = config.tracking?.webhookUrl || '';
  const calendarUrl = config.integrations?.calendar?.url || '';
  const calendarProvider = config.integrations?.calendar?.provider || 'calendly';

  const handleWebhookChange = (url: string) => {
    onUpdate({
      ...config,
      tracking: {
        ...config.tracking,
        webhookUrl: url,
      },
    });
  };

  const handleCalendarChange = (url: string, provider?: string) => {
    onUpdate({
      ...config,
      integrations: {
        ...config.integrations,
        calendar: {
          ...config.integrations?.calendar,
          url,
          provider: provider || config.integrations?.calendar?.provider || 'calendly',
          enabled: !!url,
        },
      },
    });
  };

  const handleCalendarProviderChange = (provider: string) => {
    onUpdate({
      ...config,
      integrations: {
        ...config.integrations,
        calendar: {
          ...config.integrations?.calendar,
          provider,
        },
      },
    });
  };

  const copyWebhookPayload = () => {
    const payload = {
      event: 'lead_captured',
      funnel_id: funnelId,
      timestamp: new Date().toISOString(),
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+33612345678',
        score: 75,
        answers: {
          'question-1': { optionId: 'opt-1', text: 'Option A', score: 3 },
        },
        segment: {
          id: 'seg-1',
          name: 'hot_lead',
          label: 'Lead Chaud',
        },
      },
    };

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast({
      title: 'Copié !',
      description: 'Exemple de payload copié dans le presse-papiers',
    });
  };

  const testWebhook = async () => {
    if (!webhookUrl) return;

    setTestingWebhook(true);
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          event: 'test',
          funnel_id: funnelId,
          timestamp: new Date().toISOString(),
          message: 'Test depuis Nümtema Face',
        }),
      });

      toast({
        title: 'Test envoyé',
        description: 'Vérifiez votre endpoint pour confirmer la réception',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le test. Vérifiez l\'URL.',
        variant: 'destructive',
      });
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="webhooks" className="text-xs sm:text-sm">
            <Webhook className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Webhooks</span>
            <span className="sm:hidden">Hooks</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs sm:text-sm">
            <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Calendrier</span>
            <span className="sm:hidden">Cal</span>
          </TabsTrigger>
        </TabsList>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url" className="text-sm font-medium">
                URL du Webhook
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  onChange={(e) => handleWebhookChange(e.target.value)}
                  placeholder="https://hooks.zapier.com/..."
                  className="flex-1 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testWebhook}
                  disabled={!webhookUrl || testingWebhook}
                  className="shrink-0"
                >
                  {testingWebhook ? '...' : 'Test'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Les données seront envoyées à chaque capture de lead
              </p>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {INTEGRATIONS.map((integration) => (
                <Card
                  key={integration.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => window.open(integration.docsUrl, '_blank')}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: integration.color }}
                      >
                        {integration.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{integration.name}</p>
                        <p className="text-xs text-muted-foreground truncate hidden sm:block">
                          {integration.description}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payload Example */}
            <Card className="bg-muted/50">
              <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Format du payload
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={copyWebhookPayload}>
                    <Copy className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Copier</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <pre className="text-xs bg-background p-2 sm:p-3 rounded-lg overflow-x-auto max-h-48">
{`{
  "event": "lead_captured",
  "funnel_id": "${funnelId}",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "score": 75,
    "segment": { "label": "Lead Chaud" }
  }
}`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Fournisseur</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {CALENDAR_PROVIDERS.map((provider) => (
                  <Button
                    key={provider.id}
                    variant={calendarProvider === provider.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCalendarProviderChange(provider.id)}
                    className="text-xs sm:text-sm"
                  >
                    {provider.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="calendar-url" className="text-sm font-medium">
                URL de réservation
              </Label>
              <Input
                id="calendar-url"
                value={calendarUrl}
                onChange={(e) => handleCalendarChange(e.target.value)}
                placeholder={CALENDAR_PROVIDERS.find(p => p.id === calendarProvider)?.placeholder}
                className="mt-2 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                L'agenda sera intégré dans les étapes CalendarEmbed
              </p>
            </div>

            {calendarUrl && (
              <Card className="border-green-500/50 bg-green-500/5">
                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Calendrier configuré</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {calendarUrl}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
              <h4 className="text-sm font-medium mb-2">Comment utiliser</h4>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Copiez l'URL de votre page Calendly/Cal.com</li>
                <li>Collez-la ci-dessus</li>
                <li>Ajoutez une étape "CalendarEmbed" à votre funnel</li>
                <li>Le calendrier s'affichera automatiquement</li>
              </ol>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
