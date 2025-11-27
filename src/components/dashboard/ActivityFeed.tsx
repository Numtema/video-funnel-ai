import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Send, 
  Rocket,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Activity {
  id: string;
  type: 'funnel_created' | 'submission' | 'funnel_published';
  title: string;
  description: string;
  timestamp: Date;
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'funnel_created':
      return FileText;
    case 'submission':
      return Send;
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
    case 'funnel_published':
      return 'bg-primary/10 text-primary';
  }
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadActivities();
  }, [user]);

  // Setup realtime subscription for automatic updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('activity-feed-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'submissions',
        },
        () => {
          console.log('🔄 New submission detected, refreshing activity feed');
          loadActivities();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'funnels',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('🔄 Funnel update detected, refreshing activity feed');
          loadActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadActivities = async () => {
    if (!user) return;

    try {
      // Charger les soumissions récentes
      const { data: submissions } = await supabase
        .from('submissions')
        .select('id, created_at, contact_name, funnel_id, funnels(name)')
        .order('created_at', { ascending: false })
        .limit(3);

      // Charger les funnels créés récemment
      const { data: funnels } = await supabase
        .from('funnels')
        .select('id, name, created_at, published_at, is_published')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const allActivities: Activity[] = [];

      // Ajouter les soumissions
      if (submissions) {
        submissions.forEach(sub => {
          const funnelName = (sub.funnels as any)?.name || 'Funnel';
          allActivities.push({
            id: `sub-${sub.id}`,
            type: 'submission',
            title: 'Nouvelle soumission',
            description: `${sub.contact_name || 'Un utilisateur'} a complété le funnel "${funnelName}"`,
            timestamp: new Date(sub.created_at!)
          });
        });
      }

      // Ajouter les funnels
      if (funnels) {
        funnels.forEach(funnel => {
          // Ajouter publication si publié récemment
          if (funnel.is_published && funnel.published_at) {
            const publishedDate = new Date(funnel.published_at);
            const createdDate = new Date(funnel.created_at!);
            if (publishedDate > createdDate) {
              allActivities.push({
                id: `pub-${funnel.id}`,
                type: 'funnel_published',
                title: 'Funnel publié',
                description: `"${funnel.name}" est maintenant en ligne`,
                timestamp: publishedDate
              });
            }
          }

          // Ajouter création
          allActivities.push({
            id: `create-${funnel.id}`,
            type: 'funnel_created',
            title: 'Funnel créé',
            description: `Nouveau funnel "${funnel.name}"`,
            timestamp: new Date(funnel.created_at!)
          });
        });
      }

      // Trier par date et limiter à 5
      allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setActivities(allActivities.slice(0, 5));
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucune activité récente</p>
            <p className="text-sm mt-1">Créez votre premier funnel pour commencer</p>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
