import { QuizConfig, FacebookPixelConfig, GoogleAnalyticsConfig, TikTokPixelConfig } from '@/types/funnel';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, Facebook, BarChart3, Music2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TrackingPixelsTabProps {
  config: QuizConfig;
  onUpdate: (config: QuizConfig) => void;
}

export function TrackingPixelsTab({ config, onUpdate }: TrackingPixelsTabProps) {
  const trackingPixels = config.trackingPixels || {};

  const updateFacebookPixel = (updates: Partial<FacebookPixelConfig>) => {
    onUpdate({
      ...config,
      trackingPixels: {
        ...trackingPixels,
        facebookPixel: {
          enabled: trackingPixels.facebookPixel?.enabled || false,
          ...trackingPixels.facebookPixel,
          ...updates,
        },
      },
    });
  };

  const updateGoogleAnalytics = (updates: Partial<GoogleAnalyticsConfig>) => {
    onUpdate({
      ...config,
      trackingPixels: {
        ...trackingPixels,
        googleAnalytics: {
          enabled: trackingPixels.googleAnalytics?.enabled || false,
          ...trackingPixels.googleAnalytics,
          ...updates,
        },
      },
    });
  };

  const updateTikTokPixel = (updates: Partial<TikTokPixelConfig>) => {
    onUpdate({
      ...config,
      trackingPixels: {
        ...trackingPixels,
        tiktokPixel: {
          enabled: trackingPixels.tiktokPixel?.enabled || false,
          ...trackingPixels.tiktokPixel,
          ...updates,
        },
      },
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4" />
          <span>Les pixels de tracking permettent de suivre les conversions et optimiser vos campagnes publicitaires.</span>
        </div>

        {/* Facebook Pixel */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Facebook Pixel</CardTitle>
                  <CardDescription className="text-xs">Meta Ads & Instagram</CardDescription>
                </div>
              </div>
              <Switch
                checked={trackingPixels.facebookPixel?.enabled || false}
                onCheckedChange={(enabled) => updateFacebookPixel({ enabled })}
              />
            </div>
          </CardHeader>
          {trackingPixels.facebookPixel?.enabled && (
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fb-pixel-id">Pixel ID</Label>
                <Input
                  id="fb-pixel-id"
                  value={trackingPixels.facebookPixel?.pixelId || ''}
                  onChange={(e) => updateFacebookPixel({ pixelId: e.target.value })}
                  placeholder="123456789012345"
                  className="mt-1 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Trouvez votre Pixel ID dans Meta Business Suite &gt; Événements &gt; Pixels
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Événements à tracker</Label>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">PageView</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Déclenché à chaque visite du funnel</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch
                    checked={trackingPixels.facebookPixel?.trackPageView !== false}
                    onCheckedChange={(trackPageView) => updateFacebookPixel({ trackPageView })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Lead</span>
                    <Badge variant="outline" className="text-xs">Recommandé</Badge>
                  </div>
                  <Switch
                    checked={trackingPixels.facebookPixel?.trackLead !== false}
                    onCheckedChange={(trackLead) => updateFacebookPixel({ trackLead })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">CompleteRegistration</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Déclenché à la fin du funnel</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch
                    checked={trackingPixels.facebookPixel?.trackCompleteRegistration || false}
                    onCheckedChange={(trackCompleteRegistration) => updateFacebookPixel({ trackCompleteRegistration })}
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Google Analytics 4 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Google Analytics 4</CardTitle>
                  <CardDescription className="text-xs">GA4 & Google Ads</CardDescription>
                </div>
              </div>
              <Switch
                checked={trackingPixels.googleAnalytics?.enabled || false}
                onCheckedChange={(enabled) => updateGoogleAnalytics({ enabled })}
              />
            </div>
          </CardHeader>
          {trackingPixels.googleAnalytics?.enabled && (
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ga-measurement-id">Measurement ID</Label>
                <Input
                  id="ga-measurement-id"
                  value={trackingPixels.googleAnalytics?.measurementId || ''}
                  onChange={(e) => updateGoogleAnalytics({ measurementId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="mt-1 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format GA4 : G-XXXXXXXXXX (trouvez-le dans Admin &gt; Flux de données)
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Événements à tracker</Label>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">page_view</span>
                    <Badge variant="outline" className="text-xs">Auto</Badge>
                  </div>
                  <Switch
                    checked={trackingPixels.googleAnalytics?.trackPageView !== false}
                    onCheckedChange={(trackPageView) => updateGoogleAnalytics({ trackPageView })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">form_submit</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Déclenché lors de la soumission du formulaire</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch
                    checked={trackingPixels.googleAnalytics?.trackFormSubmit !== false}
                    onCheckedChange={(trackFormSubmit) => updateGoogleAnalytics({ trackFormSubmit })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">funnel_step</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tracker chaque changement d'étape</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch
                    checked={trackingPixels.googleAnalytics?.trackStepChange || false}
                    onCheckedChange={(trackStepChange) => updateGoogleAnalytics({ trackStepChange })}
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* TikTok Pixel */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">TikTok Pixel</CardTitle>
                  <CardDescription className="text-xs">TikTok Ads</CardDescription>
                </div>
              </div>
              <Switch
                checked={trackingPixels.tiktokPixel?.enabled || false}
                onCheckedChange={(enabled) => updateTikTokPixel({ enabled })}
              />
            </div>
          </CardHeader>
          {trackingPixels.tiktokPixel?.enabled && (
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tiktok-pixel-id">Pixel ID</Label>
                <Input
                  id="tiktok-pixel-id"
                  value={trackingPixels.tiktokPixel?.pixelId || ''}
                  onChange={(e) => updateTikTokPixel({ pixelId: e.target.value })}
                  placeholder="CXXXXXXXXXXXXXXXXX"
                  className="mt-1 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Trouvez votre Pixel ID dans TikTok Ads Manager &gt; Événements
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-2">
            Comment ça fonctionne ?
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Les scripts de tracking sont injectés automatiquement dans le player public</li>
            <li>• Les événements sont déclenchés selon vos paramètres (PageView, Lead, etc.)</li>
            <li>• Compatible RGPD : les pixels ne sont chargés qu'après consentement utilisateur</li>
            <li>• Vérifiez les événements dans les outils de debug de chaque plateforme</li>
          </ul>
        </div>
      </div>
    </TooltipProvider>
  );
}
