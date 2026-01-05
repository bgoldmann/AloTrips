export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      offers: {
        Row: {
          id: string;
          provider: string;
          vertical: string;
          title: string;
          subtitle: string;
          base_price: number;
          taxes_fees: number;
          total_price: number;
          currency: string;
          rating: number;
          review_count: number;
          image: string;
          stops: number | null;
          duration: string | null;
          layover_minutes: number | null;
          baggage_included: boolean | null;
          carryon_included: boolean | null;
          flight_number: string | null;
          departure_time: string | null;
          arrival_time: string | null;
          stars: number | null;
          amenities: string[] | null;
          car_type: string | null;
          transmission: string | null;
          passengers: number | null;
          mileage_limit: string | null;
          refundable: boolean;
          epc: number;
          is_cheapest: boolean | null;
          is_best_value: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider: string;
          vertical: string;
          title: string;
          subtitle: string;
          base_price: number;
          taxes_fees: number;
          total_price: number;
          currency?: string;
          rating: number;
          review_count: number;
          image: string;
          stops?: number | null;
          duration?: string | null;
          layover_minutes?: number | null;
          baggage_included?: boolean | null;
          carryon_included?: boolean | null;
          flight_number?: string | null;
          departure_time?: string | null;
          arrival_time?: string | null;
          stars?: number | null;
          amenities?: string[] | null;
          car_type?: string | null;
          transmission?: string | null;
          passengers?: number | null;
          mileage_limit?: string | null;
          refundable: boolean;
          epc: number;
          is_cheapest?: boolean | null;
          is_best_value?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider?: string;
          vertical?: string;
          title?: string;
          subtitle?: string;
          base_price?: number;
          taxes_fees?: number;
          total_price?: number;
          currency?: string;
          rating?: number;
          review_count?: number;
          image?: string;
          stops?: number | null;
          duration?: string | null;
          layover_minutes?: number | null;
          baggage_included?: boolean | null;
          carryon_included?: boolean | null;
          flight_number?: string | null;
          departure_time?: string | null;
          arrival_time?: string | null;
          stars?: number | null;
          amenities?: string[] | null;
          car_type?: string | null;
          transmission?: string | null;
          passengers?: number | null;
          mileage_limit?: string | null;
          refundable?: boolean;
          epc?: number;
          is_cheapest?: boolean | null;
          is_best_value?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          avatar: string | null;
          home_airport: string | null;
          currency_preference: string;
          member_since: string;
          tier: string;
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          avatar?: string | null;
          home_airport?: string | null;
          currency_preference?: string;
          member_since?: string;
          tier?: string;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          avatar?: string | null;
          home_airport?: string | null;
          currency_preference?: string;
          member_since?: string;
          tier?: string;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string | null;
          date: string;
          item_title: string;
          type: string;
          status: string;
          amount: number;
          currency: string;
          provider: string;
          customer_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          date: string;
          item_title: string;
          type: string;
          status: string;
          amount: number;
          currency?: string;
          provider: string;
          customer_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          date?: string;
          item_title?: string;
          type?: string;
          status?: string;
          amount?: number;
          currency?: string;
          provider?: string;
          customer_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

