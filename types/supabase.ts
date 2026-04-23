export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: Database['public']['Enums']['app_role'];
          avatar_url: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: Database['public']['Enums']['app_role'];
          avatar_url?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: Database['public']['Enums']['app_role'];
          avatar_url?: string | null;
          created_at?: string | null;
        };
      };
      patients: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          email: string | null;
          age: number | null;
          gender: Database['public']['Enums']['gender_type'] | null;
          address: string | null;
          area: string | null;
          city: string | null;
          diagnosis: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          status: Database['public']['Enums']['patient_status'];
          source_lead_id: string | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone?: string | null;
          email?: string | null;
          age?: number | null;
          gender?: Database['public']['Enums']['gender_type'] | null;
          address?: string | null;
          area?: string | null;
          city?: string | null;
          diagnosis?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          status?: Database['public']['Enums']['patient_status'];
          source_lead_id?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          email?: string | null;
          age?: number | null;
          gender?: Database['public']['Enums']['gender_type'] | null;
          address?: string | null;
          area?: string | null;
          city?: string | null;
          diagnosis?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          status?: Database['public']['Enums']['patient_status'];
          source_lead_id?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
      };
      staff: {
        Row: {
          id: string;
          profile_id: string | null;
          full_name: string;
          phone: string | null;
          email: string | null;
          role: Database['public']['Enums']['staff_role'] | null;
          skills: string[] | null;
          experience_years: number | null;
          availability: Json | null;
          area_coverage: string[] | null;
          is_active: boolean | null;
          joined_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          full_name: string;
          phone?: string | null;
          email?: string | null;
          role?: Database['public']['Enums']['staff_role'] | null;
          skills?: string[] | null;
          experience_years?: number | null;
          availability?: Json | null;
          area_coverage?: string[] | null;
          is_active?: boolean | null;
          joined_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          full_name?: string;
          phone?: string | null;
          email?: string | null;
          role?: Database['public']['Enums']['staff_role'] | null;
          skills?: string[] | null;
          experience_years?: number | null;
          availability?: Json | null;
          area_coverage?: string[] | null;
          is_active?: boolean | null;
          joined_at?: string | null;
          created_at?: string | null;
        };
      };
      leads: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string | null;
          service_interest: string | null;
          source: Database['public']['Enums']['lead_source'] | null;
          status: Database['public']['Enums']['lead_status'] | null;
          assigned_to: string | null;
          notes: string | null;
          next_follow_up: string | null;
          converted_at: string | null;
          patient_id: string | null;
          lost_reason: string | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          email?: string | null;
          service_interest?: string | null;
          source?: Database['public']['Enums']['lead_source'] | null;
          status?: Database['public']['Enums']['lead_status'] | null;
          assigned_to?: string | null;
          notes?: string | null;
          next_follow_up?: string | null;
          converted_at?: string | null;
          patient_id?: string | null;
          lost_reason?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          service_interest?: string | null;
          source?: Database['public']['Enums']['lead_source'] | null;
          status?: Database['public']['Enums']['lead_status'] | null;
          assigned_to?: string | null;
          notes?: string | null;
          next_follow_up?: string | null;
          converted_at?: string | null;
          patient_id?: string | null;
          lost_reason?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
      };
      cases: {
        Row: {
          id: string;
          patient_id: string;
          title: string;
          type: Database['public']['Enums']['case_type'] | null;
          priority: Database['public']['Enums']['case_priority'] | null;
          status: Database['public']['Enums']['case_status'] | null;
          assigned_to: string | null;
          notes: string | null;
          resolution_notes: string | null;
          opened_at: string | null;
          resolved_at: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          patient_id: string;
          title: string;
          type?: Database['public']['Enums']['case_type'] | null;
          priority?: Database['public']['Enums']['case_priority'] | null;
          status?: Database['public']['Enums']['case_status'] | null;
          assigned_to?: string | null;
          notes?: string | null;
          resolution_notes?: string | null;
          opened_at?: string | null;
          resolved_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          patient_id?: string;
          title?: string;
          type?: Database['public']['Enums']['case_type'] | null;
          priority?: Database['public']['Enums']['case_priority'] | null;
          status?: Database['public']['Enums']['case_status'] | null;
          assigned_to?: string | null;
          notes?: string | null;
          resolution_notes?: string | null;
          opened_at?: string | null;
          resolved_at?: string | null;
          created_by?: string | null;
        };
      };
      care_plans: {
        Row: {
          id: string;
          patient_id: string;
          case_id: string | null;
          services: string[] | null;
          frequency: string | null;
          duration_weeks: number | null;
          special_instructions: string | null;
          is_active: boolean | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          patient_id: string;
          case_id?: string | null;
          services?: string[] | null;
          frequency?: string | null;
          duration_weeks?: number | null;
          special_instructions?: string | null;
          is_active?: boolean | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          patient_id?: string;
          case_id?: string | null;
          services?: string[] | null;
          frequency?: string | null;
          duration_weeks?: number | null;
          special_instructions?: string | null;
          is_active?: boolean | null;
          created_by?: string | null;
          created_at?: string | null;
        };
      };
      schedules: {
        Row: {
          id: string;
          patient_id: string;
          staff_id: string;
          care_plan_id: string | null;
          scheduled_at: string;
          duration_minutes: number | null;
          service_type: string | null;
          status: Database['public']['Enums']['schedule_status'] | null;
          notes: string | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          patient_id: string;
          staff_id: string;
          care_plan_id?: string | null;
          scheduled_at: string;
          duration_minutes?: number | null;
          service_type?: string | null;
          status?: Database['public']['Enums']['schedule_status'] | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          patient_id?: string;
          staff_id?: string;
          care_plan_id?: string | null;
          scheduled_at?: string;
          duration_minutes?: number | null;
          service_type?: string | null;
          status?: Database['public']['Enums']['schedule_status'] | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
      };
      visits: {
        Row: {
          id: string;
          schedule_id: string | null;
          patient_id: string;
          staff_id: string;
          checked_in_at: string | null;
          checked_out_at: string | null;
          visit_notes: string | null;
          vitals: Json | null;
          status: Database['public']['Enums']['visit_status'] | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          schedule_id?: string | null;
          patient_id: string;
          staff_id: string;
          checked_in_at?: string | null;
          checked_out_at?: string | null;
          visit_notes?: string | null;
          vitals?: Json | null;
          status?: Database['public']['Enums']['visit_status'] | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          schedule_id?: string | null;
          patient_id?: string;
          staff_id?: string;
          checked_in_at?: string | null;
          checked_out_at?: string | null;
          visit_notes?: string | null;
          vitals?: Json | null;
          status?: Database['public']['Enums']['visit_status'] | null;
          created_at?: string | null;
        };
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          patient_id: string;
          visit_ids: string[] | null;
          line_items: Json;
          subtotal: number;
          gst_rate: number | null;
          gst_amount: number | null;
          total_amount: number;
          status: Database['public']['Enums']['invoice_status'] | null;
          due_date: string | null;
          issued_at: string | null;
          care_manager: string | null;
          payment_reference: string | null;
          payment_method: string | null;
          payment_date: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          invoice_number: string;
          patient_id: string;
          visit_ids?: string[] | null;
          line_items: Json;
          subtotal: number;
          gst_rate?: number | null;
          gst_amount?: number | null;
          total_amount: number;
          status?: Database['public']['Enums']['invoice_status'] | null;
          due_date?: string | null;
          issued_at?: string | null;
          care_manager?: string | null;
          payment_reference?: string | null;
          payment_method?: string | null;
          payment_date?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          invoice_number?: string;
          patient_id?: string;
          visit_ids?: string[] | null;
          line_items?: Json;
          subtotal?: number;
          gst_rate?: number | null;
          gst_amount?: number | null;
          total_amount?: number;
          status?: Database['public']['Enums']['invoice_status'] | null;
          due_date?: string | null;
          issued_at?: string | null;
          care_manager?: string | null;
          payment_reference?: string | null;
          payment_method?: string | null;
          payment_date?: string | null;
          created_by?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          invoice_id: string;
          patient_id: string;
          amount: number;
          method: Database['public']['Enums']['payment_method'] | null;
          reference_number: string | null;
          paid_at: string | null;
          notes: string | null;
          recorded_by: string | null;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          patient_id: string;
          amount: number;
          method?: Database['public']['Enums']['payment_method'] | null;
          reference_number?: string | null;
          paid_at?: string | null;
          notes?: string | null;
          recorded_by?: string | null;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          patient_id?: string;
          amount?: number;
          method?: Database['public']['Enums']['payment_method'] | null;
          reference_number?: string | null;
          paid_at?: string | null;
          notes?: string | null;
          recorded_by?: string | null;
        };
      };
      lead_activities: {
        Row: {
          id: string;
          lead_id: string;
          type: Database['public']['Enums']['lead_activity_type'] | null;
          notes: string | null;
          next_follow_up: string | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          lead_id: string;
          type?: Database['public']['Enums']['lead_activity_type'] | null;
          notes?: string | null;
          next_follow_up?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          lead_id?: string;
          type?: Database['public']['Enums']['lead_activity_type'] | null;
          notes?: string | null;
          next_follow_up?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
      };
      case_notes: {
        Row: {
          id: string;
          case_id: string;
          note: string;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          case_id: string;
          note: string;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          case_id?: string;
          note?: string;
          created_by?: string | null;
          created_at?: string | null;
        };
      };
    };
    Enums: {
      app_role: 'admin' | 'coordinator' | 'nurse' | 'billing' | 'viewer';
      gender_type: 'male' | 'female' | 'other';
      patient_status: 'active' | 'inactive' | 'discharged';
      staff_role: 'nurse' | 'physiotherapist' | 'caregiver' | 'coordinator' | 'doctor';
      lead_source: 'website' | 'instagram' | 'referral' | 'walk-in' | 'whatsapp' | 'google' | 'other';
      lead_status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'converted' | 'lost';
      case_type: 'clinical' | 'complaint' | 'follow-up' | 'emergency' | 'escalation' | 'general';
      case_priority: 'low' | 'normal' | 'high' | 'urgent';
      case_status: 'open' | 'in-progress' | 'resolved' | 'closed';
      schedule_status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
      visit_status: 'pending' | 'checked-in' | 'completed' | 'cancelled';
      invoice_status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
      payment_method: 'upi' | 'cash' | 'bank_transfer' | 'cheque' | 'card';
      lead_activity_type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'note';
    };
  };
};
