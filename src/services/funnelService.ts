import { supabase } from '@/integrations/supabase/client';
import { Funnel, QuizConfig } from '@/types/funnel';

export const funnelService = {
  // List user funnels
  async list(filters?: { search?: string; status?: string }): Promise<Funnel[]> {
    let query = supabase
      .from('funnels')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    if (filters?.status === 'published') {
      query = query.eq('is_published', true);
    } else if (filters?.status === 'draft') {
      query = query.eq('is_published', false);
    } else if (filters?.status === 'inactive') {
      query = query.eq('is_active', false);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as Funnel[];
  },

  // Get single funnel
  async getById(id: string): Promise<Funnel> {
    const { data, error } = await supabase
      .from('funnels')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as unknown as Funnel;
  },

  // Get by share token (public)
  async getByShareToken(token: string): Promise<Funnel> {
    const { data, error } = await supabase
      .from('funnels')
      .select('*')
      .eq('share_token', token)
      .eq('is_published', true)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Funnel not found');
    
    // Increment views
    await supabase.rpc('increment_funnel_views', { funnel_id: data.id });
    
    return data as unknown as Funnel;
  },

  // Create funnel
  async create(data: { name: string; description?: string; config: QuizConfig }): Promise<Funnel> {
    const share_token = generateShareToken();
    
    const { data: funnel, error } = await supabase
      .from('funnels')
      .insert([{
        name: data.name,
        description: data.description || null,
        config: data.config as any,
        share_token
      } as any])
      .select()
      .single();
    
    if (error) throw error;
    return funnel as unknown as Funnel;
  },

  // Update funnel
  async update(id: string, updates: Partial<Funnel>): Promise<Funnel> {
    const updateData: any = { ...updates, updated_at: new Date().toISOString() };
    
    // Convert config to proper format if present
    if (updateData.config) {
      updateData.config = updateData.config as any;
    }
    
    const { data: funnel, error } = await supabase
      .from('funnels')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return funnel as unknown as Funnel;
  },

  // Delete (soft)
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('funnels')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Duplicate
  async duplicate(id: string): Promise<Funnel> {
    const original = await this.getById(id);
    
    return this.create({
      name: `${original.name} (copie)`,
      description: original.description,
      config: original.config,
    });
  },

  // Publish
  async publish(id: string): Promise<void> {
    const { error } = await supabase
      .from('funnels')
      .update({
        is_published: true,
        published_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Unpublish
  async unpublish(id: string): Promise<void> {
    const { error } = await supabase
      .from('funnels')
      .update({ is_published: false })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Toggle active
  async toggleActive(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('funnels')
      .update({ is_active: isActive })
      .eq('id', id);
    
    if (error) throw error;
  }
};

function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

