import { QuizConfig } from '@/types/funnel';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FunnelSettingsProps {
  config: QuizConfig;
  onUpdate: (config: QuizConfig) => void;
}

export function FunnelSettings({ config, onUpdate }: FunnelSettingsProps) {
  const [openSections, setOpenSections] = useState<string[]>(['scoring']);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleScoringToggle = (enabled: boolean) => {
    onUpdate({
      ...config,
      scoring: {
        ...config.scoring,
        enabled,
        threshold: config.scoring?.threshold || 50,
      },
    });
  };

  const handleThresholdChange = (threshold: number) => {
    if (!config.scoring) return;
    
    onUpdate({
      ...config,
      scoring: {
        ...config.scoring,
        threshold,
      },
    });
  };

  return (
    <div className="p-6 space-y-4 border-t">
      <h3 className="font-semibold">Paramètres du Funnel</h3>

      {/* Scoring Section */}
      <Collapsible
        open={openSections.includes('scoring')}
        onOpenChange={() => toggleSection('scoring')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted rounded-lg">
          <span className="font-medium text-sm">Scoring</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes('scoring') ? 'rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="scoring-enabled">Activer le scoring</Label>
            <Switch
              id="scoring-enabled"
              checked={config.scoring?.enabled || false}
              onCheckedChange={handleScoringToggle}
            />
          </div>

          {config.scoring?.enabled && (
            <div>
              <Label htmlFor="scoring-threshold">
                Seuil de qualification ({config.scoring.threshold || 50}%)
              </Label>
              <input
                type="range"
                id="scoring-threshold"
                min="0"
                max="100"
                value={config.scoring.threshold || 50}
                onChange={(e) => handleThresholdChange(parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Tracking Section */}
      <Collapsible
        open={openSections.includes('tracking')}
        onOpenChange={() => toggleSection('tracking')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted rounded-lg">
          <span className="font-medium text-sm">Tracking</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes('tracking') ? 'rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-4">
          <div>
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              value={config.tracking?.webhookUrl || ''}
              onChange={(e) =>
                onUpdate({
                  ...config,
                  tracking: {
                    ...config.tracking,
                    webhookUrl: e.target.value,
                  },
                })
              }
              placeholder="https://..."
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recevez les submissions en temps réel
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* WhatsApp Section */}
      <Collapsible
        open={openSections.includes('whatsapp')}
        onOpenChange={() => toggleSection('whatsapp')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted rounded-lg">
          <span className="font-medium text-sm">WhatsApp Marketing</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes('whatsapp') ? 'rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="whatsapp-enabled">Activer WhatsApp</Label>
            <Switch
              id="whatsapp-enabled"
              checked={config.whatsapp?.enabled || false}
              onCheckedChange={(enabled) =>
                onUpdate({
                  ...config,
                  whatsapp: {
                    ...config.whatsapp,
                    enabled,
                  },
                })
              }
            />
          </div>

          {config.whatsapp?.enabled && (
            <>
              <div>
                <Label htmlFor="whatsapp-phone">Numéro WhatsApp</Label>
                <Input
                  id="whatsapp-phone"
                  value={config.whatsapp.phoneNumber || ''}
                  onChange={(e) =>
                    onUpdate({
                      ...config,
                      whatsapp: {
                        ...config.whatsapp,
                        phoneNumber: e.target.value,
                      },
                    })
                  }
                  placeholder="33612345678"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format international sans + (ex: 33612345678)
                </p>
              </div>
              <div>
                <Label htmlFor="whatsapp-message">Message pré-rempli</Label>
                <Input
                  id="whatsapp-message"
                  value={config.whatsapp.message || ''}
                  onChange={(e) =>
                    onUpdate({
                      ...config,
                      whatsapp: {
                        ...config.whatsapp,
                        message: e.target.value,
                      },
                    })
                  }
                  placeholder="Bonjour, je suis intéressé(e) par..."
                  className="mt-2"
                />
              </div>
            </>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Branding Section */}
      <Collapsible
        open={openSections.includes('branding')}
        onOpenChange={() => toggleSection('branding')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted rounded-lg">
          <span className="font-medium text-sm">Personnalisation</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes('branding') ? 'rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <div>
            <Label htmlFor="logo">Logo de l'entreprise (URL)</Label>
            <Input
              id="logo"
              value={config.theme.logo || ''}
              onChange={(e) =>
                onUpdate({
                  ...config,
                  theme: {
                    ...config.theme,
                    logo: e.target.value,
                  },
                })
              }
              placeholder="https://..."
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Le logo s'affichera en haut du funnel
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Social Links Section */}
      <Collapsible
        open={openSections.includes('social')}
        onOpenChange={() => toggleSection('social')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted rounded-lg">
          <span className="font-medium text-sm">Réseaux Sociaux</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes('social') ? 'rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={config.socialLinks?.facebook || ''}
              onChange={(e) =>
                onUpdate({
                  ...config,
                  socialLinks: {
                    ...config.socialLinks,
                    facebook: e.target.value,
                  },
                })
              }
              placeholder="https://facebook.com/..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={config.socialLinks?.instagram || ''}
              onChange={(e) =>
                onUpdate({
                  ...config,
                  socialLinks: {
                    ...config.socialLinks,
                    instagram: e.target.value,
                  },
                })
              }
              placeholder="https://instagram.com/..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={config.socialLinks?.linkedin || ''}
              onChange={(e) =>
                onUpdate({
                  ...config,
                  socialLinks: {
                    ...config.socialLinks,
                    linkedin: e.target.value,
                  },
                })
              }
              placeholder="https://linkedin.com/..."
              className="mt-1"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}