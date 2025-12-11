import { QuizConfig, SupportedLanguage, I18nConfig } from '@/types/funnel';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, Globe, Languages } from 'lucide-react';

interface I18nTabProps {
  config: QuizConfig;
  onUpdate: (config: QuizConfig) => void;
}

const LANGUAGES: { code: SupportedLanguage; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const UI_TRANSLATIONS: Record<SupportedLanguage, {
  next: string;
  back: string;
  submit: string;
  required: string;
  emailPlaceholder: string;
  namePlaceholder: string;
  phonePlaceholder: string;
}> = {
  fr: {
    next: 'Continuer',
    back: 'Retour',
    submit: 'Envoyer',
    required: 'Ce champ est requis',
    emailPlaceholder: 'Votre email',
    namePlaceholder: 'Votre nom',
    phonePlaceholder: 'Votre téléphone',
  },
  en: {
    next: 'Continue',
    back: 'Back',
    submit: 'Submit',
    required: 'This field is required',
    emailPlaceholder: 'Your email',
    namePlaceholder: 'Your name',
    phonePlaceholder: 'Your phone',
  },
  es: {
    next: 'Continuar',
    back: 'Volver',
    submit: 'Enviar',
    required: 'Este campo es obligatorio',
    emailPlaceholder: 'Tu email',
    namePlaceholder: 'Tu nombre',
    phonePlaceholder: 'Tu teléfono',
  },
  de: {
    next: 'Weiter',
    back: 'Zurück',
    submit: 'Absenden',
    required: 'Dieses Feld ist erforderlich',
    emailPlaceholder: 'Ihre E-Mail',
    namePlaceholder: 'Ihr Name',
    phonePlaceholder: 'Ihre Telefonnummer',
  },
  pt: {
    next: 'Continuar',
    back: 'Voltar',
    submit: 'Enviar',
    required: 'Este campo é obrigatório',
    emailPlaceholder: 'Seu email',
    namePlaceholder: 'Seu nome',
    phonePlaceholder: 'Seu telefone',
  },
  it: {
    next: 'Continua',
    back: 'Indietro',
    submit: 'Invia',
    required: 'Questo campo è obbligatorio',
    emailPlaceholder: 'La tua email',
    namePlaceholder: 'Il tuo nome',
    phonePlaceholder: 'Il tuo telefono',
  },
  ar: {
    next: 'متابعة',
    back: 'رجوع',
    submit: 'إرسال',
    required: 'هذا الحقل مطلوب',
    emailPlaceholder: 'بريدك الإلكتروني',
    namePlaceholder: 'اسمك',
    phonePlaceholder: 'هاتفك',
  },
};

export function I18nTab({ config, onUpdate }: I18nTabProps) {
  const i18nConfig = config.i18n || {
    enabled: false,
    defaultLanguage: 'fr' as SupportedLanguage,
    availableLanguages: ['fr'] as SupportedLanguage[],
    autoDetect: false,
  };

  const updateI18n = (updates: Partial<I18nConfig>) => {
    onUpdate({
      ...config,
      i18n: {
        ...i18nConfig,
        ...updates,
      },
    });
  };

  const toggleLanguage = (langCode: SupportedLanguage) => {
    const currentLanguages = i18nConfig.availableLanguages || ['fr'];
    let newLanguages: SupportedLanguage[];

    if (currentLanguages.includes(langCode)) {
      // Don't allow removing the last language or the default language
      if (currentLanguages.length === 1 || langCode === i18nConfig.defaultLanguage) {
        return;
      }
      newLanguages = currentLanguages.filter(l => l !== langCode);
    } else {
      newLanguages = [...currentLanguages, langCode];
    }

    updateI18n({ availableLanguages: newLanguages });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="w-4 h-4" />
        <span>Activez le multi-langue pour proposer votre funnel dans plusieurs langues.</span>
      </div>

      {/* Main toggle */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">Multi-langue</CardTitle>
                <CardDescription className="text-xs">Proposer le funnel en plusieurs langues</CardDescription>
              </div>
            </div>
            <Switch
              checked={i18nConfig.enabled}
              onCheckedChange={(enabled) => updateI18n({ enabled })}
            />
          </div>
        </CardHeader>
      </Card>

      {i18nConfig.enabled && (
        <>
          {/* Default language */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Langue par défaut</CardTitle>
              <CardDescription className="text-xs">
                La langue affichée si le navigateur n'est pas détecté
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={i18nConfig.defaultLanguage}
                onValueChange={(value: SupportedLanguage) => updateI18n({ defaultLanguage: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {i18nConfig.availableLanguages?.map((langCode) => {
                    const lang = LANGUAGES.find(l => l.code === langCode);
                    return (
                      <SelectItem key={langCode} value={langCode}>
                        <span className="flex items-center gap-2">
                          <span>{lang?.flag}</span>
                          <span>{lang?.name}</span>
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Available languages */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-indigo-500" />
                <CardTitle className="text-sm">Langues disponibles</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Sélectionnez les langues dans lesquelles votre funnel sera disponible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((lang) => (
                  <div
                    key={lang.code}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      i18nConfig.availableLanguages?.includes(lang.code)
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => toggleLanguage(lang.code)}
                  >
                    <Checkbox
                      checked={i18nConfig.availableLanguages?.includes(lang.code) || false}
                      onCheckedChange={() => toggleLanguage(lang.code)}
                      disabled={lang.code === i18nConfig.defaultLanguage}
                    />
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                    {lang.code === i18nConfig.defaultLanguage && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Défaut
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Auto-detect */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Détection automatique</CardTitle>
                  <CardDescription className="text-xs">
                    Détecter la langue du navigateur de l'utilisateur
                  </CardDescription>
                </div>
                <Switch
                  checked={i18nConfig.autoDetect || false}
                  onCheckedChange={(autoDetect) => updateI18n({ autoDetect })}
                />
              </div>
            </CardHeader>
          </Card>

          {/* Preview translations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Aperçu des traductions UI</CardTitle>
              <CardDescription className="text-xs">
                Ces textes sont automatiquement traduits dans le player
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {i18nConfig.availableLanguages?.map((langCode) => {
                  const lang = LANGUAGES.find(l => l.code === langCode);
                  const translations = UI_TRANSLATIONS[langCode];
                  return (
                    <div key={langCode} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{lang?.flag}</span>
                        <span className="font-medium text-sm">{lang?.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="text-foreground">{translations.next}</span>
                          <span className="block opacity-60">Bouton suivant</span>
                        </div>
                        <div>
                          <span className="text-foreground">{translations.back}</span>
                          <span className="block opacity-60">Bouton retour</span>
                        </div>
                        <div>
                          <span className="text-foreground">{translations.submit}</span>
                          <span className="block opacity-60">Bouton envoyer</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Info box */}
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg p-4">
            <h4 className="font-medium text-indigo-900 dark:text-indigo-100 text-sm mb-2">
              Comment ça fonctionne ?
            </h4>
            <ul className="text-xs text-indigo-800 dark:text-indigo-200 space-y-1">
              <li>• Un sélecteur de langue apparaît dans le player public</li>
              <li>• Les textes UI (boutons, placeholders) sont traduits automatiquement</li>
              <li>• Pour traduire le contenu (titres, descriptions), dupliquez les étapes</li>
              <li>• L'utilisateur peut changer de langue à tout moment</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export { LANGUAGES, UI_TRANSLATIONS };
