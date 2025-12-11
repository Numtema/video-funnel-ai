import { useState, useCallback, useEffect } from 'react';
import { SupportedLanguage, I18nConfig } from '@/types/funnel';

interface UITranslations {
  next: string;
  back: string;
  submit: string;
  required: string;
  emailPlaceholder: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  loading: string;
  error: string;
  success: string;
  poweredBy: string;
}

const UI_TRANSLATIONS: Record<SupportedLanguage, UITranslations> = {
  fr: {
    next: 'Continuer',
    back: 'Retour',
    submit: 'Envoyer',
    required: 'Ce champ est requis',
    emailPlaceholder: 'Votre email',
    namePlaceholder: 'Votre nom',
    phonePlaceholder: 'Votre téléphone',
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    success: 'Merci !',
    poweredBy: 'Propulsé par',
  },
  en: {
    next: 'Continue',
    back: 'Back',
    submit: 'Submit',
    required: 'This field is required',
    emailPlaceholder: 'Your email',
    namePlaceholder: 'Your name',
    phonePlaceholder: 'Your phone',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Thank you!',
    poweredBy: 'Powered by',
  },
  es: {
    next: 'Continuar',
    back: 'Volver',
    submit: 'Enviar',
    required: 'Este campo es obligatorio',
    emailPlaceholder: 'Tu email',
    namePlaceholder: 'Tu nombre',
    phonePlaceholder: 'Tu teléfono',
    loading: 'Cargando...',
    error: 'Ocurrió un error',
    success: '¡Gracias!',
    poweredBy: 'Desarrollado por',
  },
  de: {
    next: 'Weiter',
    back: 'Zurück',
    submit: 'Absenden',
    required: 'Dieses Feld ist erforderlich',
    emailPlaceholder: 'Ihre E-Mail',
    namePlaceholder: 'Ihr Name',
    phonePlaceholder: 'Ihre Telefonnummer',
    loading: 'Laden...',
    error: 'Ein Fehler ist aufgetreten',
    success: 'Danke!',
    poweredBy: 'Unterstützt von',
  },
  pt: {
    next: 'Continuar',
    back: 'Voltar',
    submit: 'Enviar',
    required: 'Este campo é obrigatório',
    emailPlaceholder: 'Seu email',
    namePlaceholder: 'Seu nome',
    phonePlaceholder: 'Seu telefone',
    loading: 'Carregando...',
    error: 'Ocorreu um erro',
    success: 'Obrigado!',
    poweredBy: 'Desenvolvido por',
  },
  it: {
    next: 'Continua',
    back: 'Indietro',
    submit: 'Invia',
    required: 'Questo campo è obbligatorio',
    emailPlaceholder: 'La tua email',
    namePlaceholder: 'Il tuo nome',
    phonePlaceholder: 'Il tuo telefono',
    loading: 'Caricamento...',
    error: 'Si è verificato un errore',
    success: 'Grazie!',
    poweredBy: 'Realizzato da',
  },
  ar: {
    next: 'متابعة',
    back: 'رجوع',
    submit: 'إرسال',
    required: 'هذا الحقل مطلوب',
    emailPlaceholder: 'بريدك الإلكتروني',
    namePlaceholder: 'اسمك',
    phonePlaceholder: 'هاتفك',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'شكراً!',
    poweredBy: 'مدعوم من',
  },
};

const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  pt: '🇵🇹',
  it: '🇮🇹',
  ar: '🇸🇦',
};

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  pt: 'Português',
  it: 'Italiano',
  ar: 'العربية',
};

interface UseI18nOptions {
  i18nConfig?: I18nConfig;
}

function detectBrowserLanguage(): SupportedLanguage {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supportedLanguages: SupportedLanguage[] = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ar'];

  if (supportedLanguages.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }

  return 'fr'; // Default fallback
}

export function useI18n({ i18nConfig }: UseI18nOptions) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    if (!i18nConfig?.enabled) return 'fr';

    // Try to auto-detect from browser if enabled
    if (i18nConfig.autoDetect) {
      const detected = detectBrowserLanguage();
      if (i18nConfig.availableLanguages?.includes(detected)) {
        return detected;
      }
    }

    return i18nConfig.defaultLanguage || 'fr';
  });

  // Update language when config changes
  useEffect(() => {
    if (!i18nConfig?.enabled) {
      setCurrentLanguage('fr');
      return;
    }

    if (i18nConfig.autoDetect) {
      const detected = detectBrowserLanguage();
      if (i18nConfig.availableLanguages?.includes(detected)) {
        setCurrentLanguage(detected);
        return;
      }
    }

    if (!i18nConfig.availableLanguages?.includes(currentLanguage)) {
      setCurrentLanguage(i18nConfig.defaultLanguage || 'fr');
    }
  }, [i18nConfig]);

  const changeLanguage = useCallback((lang: SupportedLanguage) => {
    if (i18nConfig?.availableLanguages?.includes(lang)) {
      setCurrentLanguage(lang);
    }
  }, [i18nConfig]);

  const t = useCallback((key: keyof UITranslations): string => {
    return UI_TRANSLATIONS[currentLanguage]?.[key] || UI_TRANSLATIONS.fr[key];
  }, [currentLanguage]);

  const isRTL = currentLanguage === 'ar';

  const availableLanguages = i18nConfig?.enabled
    ? (i18nConfig.availableLanguages || ['fr']).map(code => ({
        code,
        name: LANGUAGE_NAMES[code],
        flag: LANGUAGE_FLAGS[code],
      }))
    : [];

  const showLanguageSelector = i18nConfig?.enabled && availableLanguages.length > 1;

  return {
    currentLanguage,
    changeLanguage,
    t,
    isRTL,
    availableLanguages,
    showLanguageSelector,
  };
}

export { UI_TRANSLATIONS, LANGUAGE_FLAGS, LANGUAGE_NAMES };
