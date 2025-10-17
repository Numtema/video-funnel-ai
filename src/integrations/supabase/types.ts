export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_sessions: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          device: string | null
          funnel_id: string
          id: string
          ip_address: unknown | null
          score: number | null
          source: string | null
          started_at: string
          steps: Json
          submitted: boolean | null
          user_agent: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          device?: string | null
          funnel_id: string
          id: string
          ip_address?: unknown | null
          score?: number | null
          source?: string | null
          started_at: string
          steps?: Json
          submitted?: boolean | null
          user_agent?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          device?: string | null
          funnel_id?: string
          id?: string
          ip_address?: unknown | null
          score?: number | null
          source?: string | null
          started_at?: string
          steps?: Json
          submitted?: boolean | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_sessions_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_templates: {
        Row: {
          category_id: string | null
          config: Json
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          config?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          config?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funnel_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      funnels: {
        Row: {
          config: Json
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_published: boolean | null
          name: string
          published_at: string | null
          share_token: string
          total_submissions: number | null
          total_views: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          name: string
          published_at?: string | null
          share_token: string
          total_submissions?: number | null
          total_views?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          name?: string
          published_at?: string | null
          share_token?: string
          total_submissions?: number | null
          total_views?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          ai_generated: boolean | null
          ai_model: string | null
          ai_prompt: string | null
          ai_provider: string | null
          created_at: string | null
          duration_seconds: number | null
          funnel_id: string | null
          id: string
          size_bytes: number | null
          thumbnail_url: string | null
          type: string
          url: string
          user_id: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          ai_model?: string | null
          ai_prompt?: string | null
          ai_provider?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          funnel_id?: string | null
          id?: string
          size_bytes?: number | null
          thumbnail_url?: string | null
          type: string
          url: string
          user_id?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          ai_model?: string | null
          ai_prompt?: string | null
          ai_provider?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          funnel_id?: string | null
          id?: string
          size_bytes?: number | null
          thumbnail_url?: string | null
          type?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ai_count_reset_at: string | null
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          current_month_ai_count: number | null
          full_name: string | null
          id: string
          max_ai_generations_monthly: number | null
          max_funnels: number | null
          phone: string | null
          plan: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_end_date: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          ai_count_reset_at?: string | null
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          current_month_ai_count?: number | null
          full_name?: string | null
          id: string
          max_ai_generations_monthly?: number | null
          max_funnels?: number | null
          phone?: string | null
          plan?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_count_reset_at?: string | null
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          current_month_ai_count?: number | null
          full_name?: string | null
          id?: string
          max_ai_generations_monthly?: number | null
          max_funnels?: number | null
          phone?: string | null
          plan?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          ai_analysis: Json | null
          answers: Json
          completion_time_seconds: number | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          device: string | null
          funnel_id: string
          id: string
          ip_address: unknown | null
          score: number | null
          session_id: string
          source: string | null
          subscribed: boolean | null
          user_agent: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          answers?: Json
          completion_time_seconds?: number | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          device?: string | null
          funnel_id: string
          id?: string
          ip_address?: unknown | null
          score?: number | null
          session_id: string
          source?: string | null
          subscribed?: boolean | null
          user_agent?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          answers?: Json
          completion_time_seconds?: number | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          device?: string | null
          funnel_id?: string
          id?: string
          ip_address?: unknown | null
          score?: number | null
          session_id?: string
          source?: string | null
          subscribed?: boolean | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
        ]
      }
      template_categories: {
        Row: {
          created_at: string | null
          display_order: number
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          icon: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          funnel_id: string | null
          id: string
          last_retry_at: string | null
          max_retries: number | null
          payload: Json
          response_body: string | null
          response_status: number | null
          retry_count: number | null
          submission_id: string | null
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          funnel_id?: string | null
          id?: string
          last_retry_at?: string | null
          max_retries?: number | null
          payload: Json
          response_body?: string | null
          response_status?: number | null
          retry_count?: number | null
          submission_id?: string | null
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          funnel_id?: string | null
          id?: string
          last_retry_at?: string | null
          max_retries?: number | null
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          retry_count?: number | null
          submission_id?: string | null
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_events_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_ai_usage: {
        Args: { _user_id: string }
        Returns: undefined
      }
      increment_funnel_submissions: {
        Args: { funnel_id: string }
        Returns: undefined
      }
      increment_funnel_views: {
        Args: { funnel_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
