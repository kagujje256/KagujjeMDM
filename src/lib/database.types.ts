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
          name: string | null
          role: string
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: string
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: string
          credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      operations: {
        Row: {
          id: string
          user_id: string
          operation_type: string
          device_model: string | null
          status: string
          credits_used: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          operation_type: string
          device_model?: string | null
          status?: string
          credits_used?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          operation_type?: string
          device_model?: string | null
          status?: string
          credits_used?: number
          created_at?: string
        }
      }
      licenses: {
        Row: {
          id: string
          user_id: string
          license_key: string
          plan: string
          credits_included: number
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          license_key: string
          plan: string
          credits_included: number
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          license_key?: string
          plan?: string
          credits_included?: number
          expires_at?: string
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          payment_method: string
          status: string
          reference: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency: string
          payment_method: string
          status?: string
          reference?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          payment_method?: string
          status?: string
          reference?: string | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
