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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      business_profiles: {
        Row: {
          city: string
          created_at: string
          deals_count: number
          description: string
          district: string | null
          founded_year: number | null
          id: string
          logo_url: string | null
          name: string
          rating: number
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          city?: string
          created_at?: string
          deals_count?: number
          description?: string
          district?: string | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          name: string
          rating?: number
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          city?: string
          created_at?: string
          deals_count?: number
          description?: string
          district?: string | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          rating?: number
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      fraud_flags: {
        Row: {
          created_at: string
          flag_group: string
          fraud_score: number
          id: string
          listing_id: string
          reasons: string[]
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          flag_group?: string
          fraud_score?: number
          id?: string
          listing_id: string
          reasons?: string[]
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          flag_group?: string
          fraud_score?: number
          id?: string
          listing_id?: string
          reasons?: string[]
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_flags_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_metrics: {
        Row: {
          active_listings: number
          active_users: number
          city: string
          created_at: string
          id: string
          new_listings: number
          new_users: number
          revenue_kopecks: number
          snapshot_date: string
          top_purchases: number
          total_contacts: number
          total_listings: number
          total_users: number
          total_views: number
          up_purchases: number
          vip_purchases: number
        }
        Insert: {
          active_listings?: number
          active_users?: number
          city?: string
          created_at?: string
          id?: string
          new_listings?: number
          new_users?: number
          revenue_kopecks?: number
          snapshot_date: string
          top_purchases?: number
          total_contacts?: number
          total_listings?: number
          total_users?: number
          total_views?: number
          up_purchases?: number
          vip_purchases?: number
        }
        Update: {
          active_listings?: number
          active_users?: number
          city?: string
          created_at?: string
          id?: string
          new_listings?: number
          new_users?: number
          revenue_kopecks?: number
          snapshot_date?: string
          top_purchases?: number
          total_contacts?: number
          total_listings?: number
          total_users?: number
          total_views?: number
          up_purchases?: number
          vip_purchases?: number
        }
        Relationships: []
      }
      growth_recommendations: {
        Row: {
          action_data: Json | null
          created_at: string
          description: string
          generated_at: string
          id: string
          is_applied: boolean
          is_dismissed: boolean
          priority: Database["public"]["Enums"]["recommendation_priority"]
          title: string
          type: Database["public"]["Enums"]["recommendation_type"]
        }
        Insert: {
          action_data?: Json | null
          created_at?: string
          description: string
          generated_at?: string
          id?: string
          is_applied?: boolean
          is_dismissed?: boolean
          priority?: Database["public"]["Enums"]["recommendation_priority"]
          title: string
          type: Database["public"]["Enums"]["recommendation_type"]
        }
        Update: {
          action_data?: Json | null
          created_at?: string
          description?: string
          generated_at?: string
          id?: string
          is_applied?: boolean
          is_dismissed?: boolean
          priority?: Database["public"]["Enums"]["recommendation_priority"]
          title?: string
          type?: Database["public"]["Enums"]["recommendation_type"]
        }
        Relationships: []
      }
      import_jobs: {
        Row: {
          category: string | null
          city: string | null
          created_at: string
          created_by: string | null
          error_log: Json | null
          failed_rows: number
          finished_at: string | null
          id: string
          payload: Json | null
          processed_rows: number
          source: Database["public"]["Enums"]["import_source"]
          started_at: string | null
          status: Database["public"]["Enums"]["import_job_status"]
          total_rows: number
        }
        Insert: {
          category?: string | null
          city?: string | null
          created_at?: string
          created_by?: string | null
          error_log?: Json | null
          failed_rows?: number
          finished_at?: string | null
          id?: string
          payload?: Json | null
          processed_rows?: number
          source: Database["public"]["Enums"]["import_source"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["import_job_status"]
          total_rows?: number
        }
        Update: {
          category?: string | null
          city?: string | null
          created_at?: string
          created_by?: string | null
          error_log?: Json | null
          failed_rows?: number
          finished_at?: string | null
          id?: string
          payload?: Json | null
          processed_rows?: number
          source?: Database["public"]["Enums"]["import_source"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["import_job_status"]
          total_rows?: number
        }
        Relationships: []
      }
      listings: {
        Row: {
          author_id: string | null
          author_name: string
          author_type: string
          category_id: string
          city: string
          created_at: string
          currency: string
          description: string
          district: string | null
          id: string
          moderation_score: number | null
          phone: string | null
          photos: string[]
          pinned: boolean
          price: number
          promotion_expires_at: string | null
          promotion_type: string | null
          risk_level: string | null
          status: string
          title: string
          updated_at: string
          urgent: boolean
          views: number
          vip: boolean
        }
        Insert: {
          author_id?: string | null
          author_name?: string
          author_type?: string
          category_id: string
          city?: string
          created_at?: string
          currency?: string
          description?: string
          district?: string | null
          id?: string
          moderation_score?: number | null
          phone?: string | null
          photos?: string[]
          pinned?: boolean
          price?: number
          promotion_expires_at?: string | null
          promotion_type?: string | null
          risk_level?: string | null
          status?: string
          title: string
          updated_at?: string
          urgent?: boolean
          views?: number
          vip?: boolean
        }
        Update: {
          author_id?: string | null
          author_name?: string
          author_type?: string
          category_id?: string
          city?: string
          created_at?: string
          currency?: string
          description?: string
          district?: string | null
          id?: string
          moderation_score?: number | null
          phone?: string | null
          photos?: string[]
          pinned?: boolean
          price?: number
          promotion_expires_at?: string | null
          promotion_type?: string | null
          risk_level?: string | null
          status?: string
          title?: string
          updated_at?: string
          urgent?: boolean
          views?: number
          vip?: boolean
        }
        Relationships: []
      }
      moderation_queue: {
        Row: {
          ai_reasons: string[]
          ai_risk: string | null
          ai_score: number | null
          created_at: string
          id: string
          listing_id: string
          notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          ai_reasons?: string[]
          ai_risk?: string | null
          ai_score?: number | null
          created_at?: string
          id?: string
          listing_id: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          ai_reasons?: string[]
          ai_risk?: string | null
          ai_score?: number | null
          created_at?: string
          id?: string
          listing_id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_queue_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications_queue: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          error: string | null
          id: string
          payload: Json
          scheduled_at: string
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          subject: string | null
          template: string
          user_id: string | null
        }
        Insert: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          error?: string | null
          id?: string
          payload?: Json
          scheduled_at?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          subject?: string | null
          template: string
          user_id?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          error?: string | null
          id?: string
          payload?: Json
          scheduled_at?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          subject?: string | null
          template?: string
          user_id?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string
          reward_type: string | null
          rewarded_at: string | null
          status: Database["public"]["Enums"]["referral_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id: string
          reward_type?: string | null
          rewarded_at?: string | null
          status?: Database["public"]["Enums"]["referral_status"]
        }
        Update: {
          created_at?: string
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string
          reward_type?: string | null
          rewarded_at?: string | null
          status?: Database["public"]["Enums"]["referral_status"]
        }
        Relationships: []
      }
      seed_templates: {
        Row: {
          attributes: Json | null
          category: string
          created_at: string
          description_pattern: string
          id: string
          is_active: boolean
          price_max: number | null
          price_min: number | null
          title_pattern: string
        }
        Insert: {
          attributes?: Json | null
          category: string
          created_at?: string
          description_pattern: string
          id?: string
          is_active?: boolean
          price_max?: number | null
          price_min?: number | null
          title_pattern: string
        }
        Update: {
          attributes?: Json | null
          category?: string
          created_at?: string
          description_pattern?: string
          id?: string
          is_active?: boolean
          price_max?: number | null
          price_min?: number | null
          title_pattern?: string
        }
        Relationships: []
      }
      user_bonuses: {
        Row: {
          bonus_type: Database["public"]["Enums"]["bonus_type"]
          created_at: string
          expires_at: string | null
          id: string
          source: string | null
          status: Database["public"]["Enums"]["bonus_status"]
          used_at: string | null
          user_id: string
        }
        Insert: {
          bonus_type: Database["public"]["Enums"]["bonus_type"]
          created_at?: string
          expires_at?: string | null
          id?: string
          source?: string | null
          status?: Database["public"]["Enums"]["bonus_status"]
          used_at?: string | null
          user_id: string
        }
        Update: {
          bonus_type?: Database["public"]["Enums"]["bonus_type"]
          created_at?: string
          expires_at?: string | null
          id?: string
          source?: string | null
          status?: Database["public"]["Enums"]["bonus_status"]
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "moderator" | "user"
      bonus_status: "available" | "used" | "expired"
      bonus_type:
        | "free_vip"
        | "free_top"
        | "free_up"
        | "free_urgent"
        | "signup_bonus"
        | "referral_bonus"
      import_job_status: "pending" | "processing" | "completed" | "failed"
      import_source: "csv" | "api" | "manual" | "ai_generated"
      notification_channel: "email" | "push" | "in_app"
      notification_status: "pending" | "sent" | "failed" | "cancelled"
      recommendation_priority: "low" | "medium" | "high" | "critical"
      recommendation_type:
        | "city_launch"
        | "category_growth"
        | "ad_placement"
        | "pricing"
        | "reactivation"
        | "other"
      referral_status: "pending" | "qualified" | "rewarded" | "expired"
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
      app_role: ["super_admin", "admin", "moderator", "user"],
      bonus_status: ["available", "used", "expired"],
      bonus_type: [
        "free_vip",
        "free_top",
        "free_up",
        "free_urgent",
        "signup_bonus",
        "referral_bonus",
      ],
      import_job_status: ["pending", "processing", "completed", "failed"],
      import_source: ["csv", "api", "manual", "ai_generated"],
      notification_channel: ["email", "push", "in_app"],
      notification_status: ["pending", "sent", "failed", "cancelled"],
      recommendation_priority: ["low", "medium", "high", "critical"],
      recommendation_type: [
        "city_launch",
        "category_growth",
        "ad_placement",
        "pricing",
        "reactivation",
        "other",
      ],
      referral_status: ["pending", "qualified", "rewarded", "expired"],
    },
  },
} as const
