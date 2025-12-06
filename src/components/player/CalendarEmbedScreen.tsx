import { QuizStep, ThemeConfig } from '@/types/funnel';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';
import DOMPurify from 'dompurify';

interface CalendarEmbedScreenProps {
  step: QuizStep;
  theme: ThemeConfig;
  onNext: () => void;
}

// Whitelist of allowed iframe sources for calendar embeds
const ALLOWED_IFRAME_HOSTS = [
  'calendly.com',
  'cal.com',
  'calendar.google.com',
  'outlook.office365.com',
  'outlook.live.com',
  'acuityscheduling.com',
  'hubspot.com',
  'calendarhero.com',
  'tidycal.com',
  'savvycal.com',
  'zcal.co'
];

function sanitizeEmbedCode(embedCode: string): string {
  // Configure DOMPurify to allow iframes but restrict their sources
  const sanitized = DOMPurify.sanitize(embedCode, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'loading', 'referrerpolicy'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
  });

  // Create a temporary element to parse and validate iframes
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = sanitized;

  // Validate and filter iframe sources
  const iframes = tempDiv.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    const src = iframe.getAttribute('src');
    if (src) {
      try {
        const url = new URL(src);
        const isAllowed = ALLOWED_IFRAME_HOSTS.some(host => 
          url.hostname === host || url.hostname.endsWith(`.${host}`)
        );
        if (!isAllowed) {
          console.warn(`Blocked iframe from non-whitelisted source: ${url.hostname}`);
          iframe.remove();
        }
      } catch {
        // Invalid URL, remove the iframe
        iframe.remove();
      }
    } else {
      // No src attribute, remove the iframe
      iframe.remove();
    }
  });

  return tempDiv.innerHTML;
}

export function CalendarEmbedScreen({ step }: CalendarEmbedScreenProps) {
  // Check if embedCode is a YouTube URL
  const isYouTube = step.embedCode && isYouTubeUrl(step.embedCode);
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(step.embedCode || '') : null;

  // Sanitize embed code if present and not YouTube
  const sanitizedEmbedCode = step.embedCode && !isYouTube 
    ? sanitizeEmbedCode(step.embedCode) 
    : null;

  return (
    <div className="space-y-6 p-8 rounded-lg bg-card/50 backdrop-blur max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">{step.title}</h2>
        {step.description && (
          <p className="text-muted-foreground mt-2">{step.description}</p>
        )}
      </div>

      {step.embedCode ? (
        youtubeEmbedUrl ? (
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-background shadow-lg">
            <iframe
              src={youtubeEmbedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : sanitizedEmbedCode ? (
          <div 
            className="w-full min-h-[700px] rounded-lg overflow-hidden bg-background shadow-lg"
            dangerouslySetInnerHTML={{ __html: sanitizedEmbedCode }}
          />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Code d'intégration non autorisé</p>
            <p className="text-sm mt-2">Seuls les calendriers de sources approuvées sont acceptés (Calendly, Cal.com, Google Calendar, etc.)</p>
          </div>
        )
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Aucun calendrier configuré</p>
          <p className="text-sm mt-2">Ajoutez votre code d'intégration Calendly dans l'éditeur</p>
        </div>
      )}
    </div>
  );
}
