import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) console.warn('Supabase URL não encontrada. Verifique VITE_SUPABASE_URL.');
if (!supabaseAnonKey) console.warn('Supabase Anon Key não encontrada. Verifique VITE_SUPABASE_ANON_KEY.');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class DataService {
  static async getProducts(type: 'courses' | 'ebooks') {
    if (!supabaseUrl || !supabaseAnonKey) return [];
    try {
      const { data, error } = await supabase
        .from(type)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error(`Erro ao buscar ${type}:`, e);
      return [];
    }
  }

  static async saveProduct(type: 'courses' | 'ebooks', payload: any) {
    if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase não configurado.');

    const { data, error } = await supabase
      .from(type)
      .insert([payload]);

    if (error) throw error;
    return data;
  }

  static async getProfile(userId: string) {
    if (!supabaseUrl || !supabaseAnonKey) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  }
}
