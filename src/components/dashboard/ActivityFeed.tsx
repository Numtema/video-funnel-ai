import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Image as ImageIcon, 
  Send, 
  Rocket,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'funnel_created' | 'submission' | 'media_generated' | 'funnel_published';
  title: string;
  description: string;
  timestamp: Date;
}

const generateMockActivities = (): Activity[] => {
  const now = new Date();
  
  return [
    {
      id: '1',
      type: 'submission',
      title: 'Nouvelle soumission',
      description: 'John Doe a complété le funnel "Formation Marketing"',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      type: 'media_generated',
      title: 'Image générée par IA',
      description: 'Image créée pour "Quiz Produit"',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'funnel_published',
      title: 'Funnel publié',
      description: '"Lead Magnet Coach" est maintenant en ligne',
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      type: 'funnel_created',
      title: 'Funnel créé',
      description: 'Nouveau funnel "Diagnostic Gratuit"',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '5',
      type: 'submission',
      title: 'Nouvelle soumission',
      description: 'Marie Martin a complété le funnel "Quiz Produit"',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
  ];
};

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'funnel_created':
      return FileText;
    case 'submission':
      return Send;
    case 'media_generated':
      return ImageIcon;
    case 'funnel_published':
      return Rocket;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'funnel_created':
      return 'bg-primary/10 text-primary';
    case 'submission':
      return 'bg-accent/10 text-accent';
    case 'media_generated':
      return 'bg-success/10 text-success';
    case 'funnel_published':
      return 'bg-primary/10 text-primary';
  }
};

export function ActivityFeed() {
  const activities = generateMockActivities();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <div
                key={activity.id}
                className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}