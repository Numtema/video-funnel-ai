import { useAuth } from '@/context/AuthContext';
import { Sparkles, Sun, Moon, Cloud } from 'lucide-react';

export function WelcomeBanner() {
  const { user, profile } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Bonjour', icon: Sun };
    if (hour < 18) return { text: 'Bon après-midi', icon: Sun };
    return { text: 'Bonsoir', icon: Moon };
  };

  const tips = [
    "💡 Utilisez l'IA pour générer vos images de funnel rapidement",
    "🎯 Un bon funnel commence par une question claire",
    "📊 Activez le scoring pour qualifier vos leads automatiquement",
    "🎨 Personnalisez les couleurs pour matcher votre marque",
    "🚀 Publiez votre funnel pour commencer à collecter des leads",
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const isNewUser = profile && 
    new Date().getTime() - new Date(profile.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/5 p-8 border border-primary/20">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <GreetingIcon className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            {greeting.text}, {profile?.full_name || user?.email?.split('@')[0]} !
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Créez des funnels engageants et convertissez vos visiteurs en clients
        </p>

        <div className="flex items-start gap-2 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
          <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Conseil du jour</p>
            <p className="text-sm text-muted-foreground mt-1">{randomTip}</p>
          </div>
        </div>

        {isNewUser && (
          <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <h3 className="font-semibold text-accent mb-2">🎉 Bienvenue dans Nümtema Face !</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✅ Compte créé</li>
              <li className="opacity-50">⏳ Créer votre premier funnel</li>
              <li className="opacity-50">⏳ Générer du contenu avec l'IA</li>
              <li className="opacity-50">⏳ Publier et partager</li>
            </ul>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
    </div>
  );
}