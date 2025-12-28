
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL } from '../constants';

// Nota: Em produção, estas chaves devem vir de variáveis de ambiente seguras.
// Como estamos configurando o deploy, assumimos que o cliente será inicializado com a Anon Key.
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''; 
export const supabase = createClient(SUPABASE_URL, supabaseKey);

export class DataService {
  static async getProducts(type: 'courses' | 'ebooks') {
    const { data, error } = await supabase
      .from(type)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  static async saveProduct(type: 'courses' | 'ebooks', payload: any) {
    const { data, error } = await supabase
      .from(type)
      .insert([payload]);
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
