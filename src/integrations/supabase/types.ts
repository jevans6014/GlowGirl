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
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string | null
          read_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
          read_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
          read_at?: string | null
        }
        Relationships: []
      }
      event_inquiries: {
        Row: {
          created_at: string
          email: string
          event_date: string | null
          event_type: string | null
          guests: number | null
          id: string
          message: string | null
          name: string
          phone: string | null
          read_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_date?: string | null
          event_type?: string | null
          guests?: number | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          read_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_date?: string | null
          event_type?: string | null
          guests?: number | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          read_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          category: string
          description: string | null
          base_price: number
          image_url: string | null
          in_stock: boolean
          featured: boolean
          sort_order: number
          stripe_price_id: string | null
          customizable: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category: string
          description?: string | null
          base_price: number
          image_url?: string | null
          in_stock?: boolean
          featured?: boolean
          sort_order?: number
          stripe_price_id?: string | null
          customizable?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category?: string
          description?: string | null
          base_price?: number
          image_url?: string | null
          in_stock?: boolean
          featured?: boolean
          sort_order?: number
          stripe_price_id?: string | null
          customizable?: boolean
          created_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          id: string
          product_id: string | null
          label: string
          price_modifier: number
          stripe_price_id: string | null
          in_stock: boolean
        }
        Insert: {
          id?: string
          product_id?: string | null
          label: string
          price_modifier?: number
          stripe_price_id?: string | null
          in_stock?: boolean
        }
        Update: {
          id?: string
          product_id?: string | null
          label?: string
          price_modifier?: number
          stripe_price_id?: string | null
          in_stock?: boolean
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          stripe_session_id: string | null
          stripe_payment_intent_id: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          status: string
          subtotal: number | null
          total: number | null
          shipping_address: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          status?: string
          subtotal?: number | null
          total?: number | null
          shipping_address?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          status?: string
          subtotal?: number | null
          total?: number | null
          shipping_address?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          product_name: string
          variant_label: string | null
          quantity: number
          unit_price: number
          customization_text: string | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name: string
          variant_label?: string | null
          quantity?: number
          unit_price: number
          customization_text?: string | null
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name?: string
          variant_label?: string | null
          quantity?: number
          unit_price?: number
          customization_text?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          service: string
          preferred_date: string | null
          preferred_time: string | null
          party_size: number
          chain_preference: string | null
          charm_preference: string | null
          message: string | null
          status: string
          deposit_paid: boolean
          stripe_session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          service: string
          preferred_date?: string | null
          preferred_time?: string | null
          party_size?: number
          chain_preference?: string | null
          charm_preference?: string | null
          message?: string | null
          status?: string
          deposit_paid?: boolean
          stripe_session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          service?: string
          preferred_date?: string | null
          preferred_time?: string | null
          party_size?: number
          chain_preference?: string | null
          charm_preference?: string | null
          message?: string | null
          status?: string
          deposit_paid?: boolean
          stripe_session_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const