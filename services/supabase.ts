
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '../constants.ts';

// Acesso seguro ao process.env para evitar ReferenceError
const getEnv = (key: string) => {
  try {
    return (typeof process !== 'undefined' && process.env) ? process.env[key] : '';
  } catch (e) {
    return '';
  }
};

const supabaseKey = getEnv('SUPABASE_ANON_KEY');

if (!supabaseKey) {
  console.warn('Supabase Anon Key não encontrada. Verifique as variáveis de ambiente.');
}

export const supabase = createClient(SUPABASE_URL, supabaseKey || 'placeholder-key');

export class DataService {
  static async getProducts(type: 'courses' | 'ebooks') {
    if (!supabaseKey) return [];
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
    if (!supabaseKey) throw new Error('Supabase não configurado.');
    const { data, error } = await supabase
      .from(type)
      .insert([payload]);
    if (error) throw error;
    return data;
  }

  static async getProfile(userId: string) {
    if (!supabaseKey) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  }
}
