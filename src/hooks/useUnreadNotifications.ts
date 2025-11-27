import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUnreadNotifications = (userId: string | undefined) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const loadUnreadCount = async () => {
      // Get last read timestamp from localStorage
      const lastRead = localStorage.getItem(`notifications_last_read_${userId}`);
      const lastReadDate = lastRead ? new Date(lastRead) : new Date(0);

      // Count submissions created after last read
      const { count: submissionsCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('funnel_id', userId)
        .gt('created_at', lastReadDate.toISOString());

      // Count funnels created after last read
      const { count: funnelsCount } = await supabase
        .from('funnels')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gt('created_at', lastReadDate.toISOString());

      setUnreadCount((submissionsCount || 0) + (funnelsCount || 0));
    };

    loadUnreadCount();

    // Listen for new notifications
    const channel = supabase
      .channel('unread-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'submissions',
        },
        () => {
          setUnreadCount(prev => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'funnels',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAsRead = () => {
    if (!userId) return;
    localStorage.setItem(`notifications_last_read_${userId}`, new Date().toISOString());
    setUnreadCount(0);
  };

  return { unreadCount, markAsRead };
};
