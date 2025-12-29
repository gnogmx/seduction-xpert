import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  // Vite (browser)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return String(import.meta.env[key] ?? '');
    }
  } catch {}

  // Fallback (SSR / tools)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return String(process.env[key] ?? '');
    }
  } catch {}

  return '';
};

const supabaseUrl =
  getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL');

const supabaseAnonKey =
  getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO: Variáveis de ambiente ausentes!', {
    hasUrl: Boolean(supabaseUrl),
    hasAnonKey: Boolean(supabaseAnonKey),
  });
}

// IMPORTANT: NÃO use placeholder key. Se estiver vazio, o app deve acusar erro.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class DataService {
  static async getProducts(type: 'courses' | 'ebooks') {
    const { data, error } = await supabase
      .from(type)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async saveProduct(type: 'courses' | 'ebooks', payload: any) {
    const { data, error } = await supabase
      .from(type)
      .insert([payload])
      .select('*');

    if (error) throw error;
    return data;
  }

  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  }
}
