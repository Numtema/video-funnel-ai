import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuizConfig } from '@/types/funnel';

interface RedirectSettingsProps {
  config: QuizConfig;
  onChange: (updates: Partial<QuizConfig>) => void;
}

export function RedirectSettings({ config, onChange }: RedirectSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="redirectType">Redirection après complétion</Label>
        <Select
          value={config.redirectType || 'none'}
          onValueChange={(value) => onChange({ redirectType: value as any })}
        >
          <SelectTrigger id="redirectType">
            <SelectValue placeholder="Aucune redirection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune redirection</SelectItem>
            <SelectItem value="website">Site web</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="messenger">Facebook Messenger</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Rediriger l'utilisateur vers une URL après avoir complété le funnel
        </p>
      </div>

      {config.redirectType && config.redirectType !== 'none' && (
        <div className="space-y-2">
          <Label htmlFor="redirectUrl">
            {config.redirectType === 'whatsapp' && 'Numéro WhatsApp'}
            {config.redirectType === 'messenger' && 'Nom d\'utilisateur Messenger'}
            {config.redirectType === 'website' && 'URL du site web'}
          </Label>
          <Input
            id="redirectUrl"
            value={config.redirectUrl || ''}
            onChange={(e) => onChange({ redirectUrl: e.target.value })}
            placeholder={
              config.redirectType === 'whatsapp' 
                ? '+33612345678' 
                : config.redirectType === 'messenger'
                  ? 'VotrePageFacebook'
                  : 'https://example.com'
            }
          />
          {config.redirectType === 'whatsapp' && (
            <p className="text-xs text-muted-foreground">
              Format international avec indicatif pays (ex: +33612345678)
            </p>
          )}
          {config.redirectType === 'messenger' && (
            <p className="text-xs text-muted-foreground">
              Nom d'utilisateur de votre page Facebook (ex: VotrePageFacebook)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
