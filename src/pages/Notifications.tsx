import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Send, 
  Rocket, 
  FileText,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'submission' | 'funnel_published' | 'funnel_created';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Charger les soumissions récentes
      const { data: submissions } = await supabase
        .from('submissions')
        .select('id, created_at, contact_name, contact_email, funnel_id, funnels!inner(name, user_id)')
        .eq('funnels.user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      // Charger les funnels récents
      const { data: funnels } = await supabase
        .from('funnels')
        .select('id, name, created_at, published_at, is_published')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      const allNotifications: Notification[] = [];

      // Ajouter les soumissions
      if (submissions) {
        submissions.forEach((sub: any) => {
          const funnelName = sub.funnels?.name || 'Funnel';
          const contactName = sub.contact_name || sub.contact_email || 'Anonyme';
          allNotifications.push({
            id: `sub-${sub.id}`,
            type: 'submission',
            title: 'Nouveau lead',
            description: `${contactName} a complété "${funnelName}"`,
            timestamp: new Date(sub.created_at),
            read: false,
          });
        });
      }

      // Ajouter les funnels
      if (funnels) {
        funnels.forEach((funnel: any) => {
          // Publication
          if (funnel.is_published && funnel.published_at) {
            const publishedDate = new Date(funnel.published_at);
            const createdDate = new Date(funnel.created_at);
            if (publishedDate > createdDate) {
              allNotifications.push({
                id: `pub-${funnel.id}`,
                type: 'funnel_published',
                title: 'Funnel publié',
                description: `"${funnel.name}" est maintenant en ligne`,
                timestamp: publishedDate,
                read: false,
              });
            }
          }

          // Création
          allNotifications.push({
            id: `create-${funnel.id}`,
            type: 'funnel_created',
            title: 'Funnel créé',
            description: `"${funnel.name}" a été créé`,
            timestamp: new Date(funnel.created_at),
            read: false,
          });
        });
      }

      // Trier par date
      allNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    toast({
      title: 'Notifications marquées comme lues',
      description: 'Toutes les notifications ont été marquées comme lues',
    });
  };

  const clearAll = () => {
    setNotifications([]);
    toast({
      title: 'Notifications supprimées',
      description: 'Toutes les notifications ont été supprimées',
    });
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'submission':
        return <Send className="w-5 h-5" />;
      case 'funnel_published':
        return <Rocket className="w-5 h-5" />;
      case 'funnel_created':
        return <FileText className="w-5 h-5" />;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'submission':
        return 'bg-accent/10 text-accent';
      case 'funnel_published':
        return 'bg-primary/10 text-primary';
      case 'funnel_created':
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8" />
              Notifications
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Historique complet de vos notifications
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="flex-1 sm:flex-none">
              <CheckCheck className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Tout marquer comme lu</span>
              <span className="sm:hidden">Lu</span>
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll} className="flex-1 sm:flex-none">
              <Trash2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Tout effacer</span>
              <span className="sm:hidden">Effacer</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Historique</span>
              {notifications.length > 0 && (
                <Badge variant="secondary">
                  {notifications.filter((n) => !n.read).length} non lues
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Aucune notification</p>
                <p className="text-sm mt-1">
                  Vous serez notifié des nouveaux leads et activités
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.type);
                  const colorClass = getColor(notification.type);

                  return (
                    <div
                      key={notification.id}
                      className={`flex gap-3 p-4 rounded-lg border transition-colors ${
                        notification.read
                          ? 'bg-background'
                          : 'bg-muted/50 border-primary/20'
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
                      >
                        {Icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-semibold">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {notification.description}
                            </p>
                          </div>
                          {!notification.read && (
                            <Badge variant="default" className="flex-shrink-0">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(notification.timestamp, {
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
      </div>
    </MainLayout>
  );
};

export default Notifications;
