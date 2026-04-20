export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string | null
          role: 'user' | 'admin' | 'reseller'
          credits: number
          reseller_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name?: string | null
          role?: 'user' | 'admin' | 'reseller'
          credits?: number
          reseller_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string | null
          role?: 'user' | 'admin' | 'reseller'
          credits?: number
          reseller_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      licenses: {
        Row: {
          id: string
          key: string
          user_id: string | null
          type: 'basic' | 'pro' | 'enterprise'
          duration_days: number
          activated_at: string | null
          expires_at: string | null
          machine_id: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          user_id?: string | null
          type: 'basic' | 'pro' | 'enterprise'
          duration_days: number
          activated_at?: string | null
          expires_at?: string | null
          machine_id?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          user_id?: string | null
          type?: 'basic' | 'pro' | 'enterprise'
          duration_days?: number
          activated_at?: string | null
          expires_at?: string | null
          machine_id?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      operations: {
        Row: {
          id: string
          user_id: string | null
          operation_type: string
          device_model: string | null
          device_serial: string | null
          status: string
          credits_used: number
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          operation_type: string
          device_model?: string | null
          device_serial?: string | null
          status?: string
          credits_used?: number
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          operation_type?: string
          device_model?: string | null
          device_serial?: string | null
          status?: string
          credits_used?: number
          metadata?: Json
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string | null
          amount: number
          currency: string
          payment_method: string
          phone: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          provider_ref: string | null
          credits_added: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          amount: number
          currency?: string
          payment_method: string
          phone?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          provider_ref?: string | null
          credits_added?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          amount?: number
          currency?: string
          payment_method?: string
          phone?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          provider_ref?: string | null
          credits_added?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string | null
          type: 'credit_purchase' | 'credit_use' | 'refund' | 'transfer'
          amount: number
          description: string | null
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: 'credit_purchase' | 'credit_use' | 'refund' | 'transfer'
          amount: number
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: 'credit_purchase' | 'credit_use' | 'refund' | 'transfer'
          amount?: number
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
      }
      mdm_files: {
        Row: {
          id: string
          name: string
          description: string | null
          file_url: string
          file_size: number | null
          version: string | null
          category: string | null
          is_active: boolean
          downloads: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          file_url: string
          file_size?: number | null
          version?: string | null
          category?: string | null
          is_active?: boolean
          downloads?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          file_url?: string
          file_size?: number | null
          version?: string | null
          category?: string | null
          is_active?: boolean
          downloads?: number
          created_at?: string
        }
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
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never
