import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface Submission {
  id: string;
  contact_name: string;
  contact_email: string;
  funnel_id: string;
  score: number | null;
  created_at: string;
  funnel?: {
    name: string;
  };
}

export const useRealtimeLeads = (userId: string | undefined) => {
  const { toast } = useToast();
  const { play } = useNotificationSound();
  const [newLeadCount, setNewLeadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    console.log('🔴 Setting up realtime subscription for leads');

    const channel = supabase
      .channel('submissions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'submissions',
        },
        async (payload: RealtimePostgresChangesPayload<Submission>) => {
          console.log('🔴 New submission received:', payload);
          
          const newSubmission = payload.new as Submission;

          // Fetch funnel details to get the name and verify ownership
          const { data: funnel } = await supabase
            .from('funnels')
            .select('name, user_id')
            .eq('id', newSubmission.funnel_id)
            .single();

          // Only show notification if this funnel belongs to the current user
          if (funnel && funnel.user_id === userId) {
            const contactName = newSubmission.contact_name || newSubmission.contact_email || 'Anonyme';
            const funnelName = funnel.name || 'Funnel';

            // Play notification sound
            play();

            toast({
              title: '🎉 Nouveau lead !',
              description: `${contactName} vient de compléter "${funnelName}"${newSubmission.score ? ` (Score: ${newSubmission.score}/100)` : ''}`,
              duration: 5000,
            });

            setNewLeadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔴 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, toast]);

  const resetNewLeadCount = () => setNewLeadCount(0);

  return { newLeadCount, resetNewLeadCount };
};
