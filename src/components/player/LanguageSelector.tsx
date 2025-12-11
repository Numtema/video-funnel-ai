import { SupportedLanguage } from '@/types/funnel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  availableLanguages: { code: SupportedLanguage; name: string; flag: string }[];
  onChangeLanguage: (lang: SupportedLanguage) => void;
  compact?: boolean;
}

export function LanguageSelector({
  currentLanguage,
  availableLanguages,
  onChangeLanguage,
  compact = false,
}: LanguageSelectorProps) {
  const currentLang = availableLanguages.find(l => l.code === currentLanguage);

  if (availableLanguages.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? 'sm' : 'default'}
          className="backdrop-blur-sm bg-background/50 gap-2"
        >
          <Globe className="w-4 h-4" />
          {!compact && (
            <>
              <span className="text-lg">{currentLang?.flag}</span>
              <span className="hidden sm:inline">{currentLang?.name}</span>
            </>
          )}
          {compact && <span className="text-lg">{currentLang?.flag}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onChangeLanguage(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              lang.code === currentLanguage ? 'bg-muted' : ''
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            {lang.code === currentLanguage && (
              <span className="w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
