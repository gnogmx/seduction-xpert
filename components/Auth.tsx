
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Verifique seu e-mail para confirmar o cadastro!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-10 rounded-3xl space-y-8 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-white italic accent-gold">Seduction Xpert</h1>
          <p className="text-zinc-500 text-sm mt-2">{isSignUp ? 'Crie sua conta de elite' : 'Acesse seu painel de mestre'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 mb-2 block">E-mail</label>
            <input 
              type="email" 
              required
              className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm focus:border-gold outline-none text-white transition-all"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 mb-2 block">Senha</label>
            <input 
              type="password" 
              required
              className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm focus:border-gold outline-none text-white transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-gold text-black py-4 rounded-xl font-bold hover:bg-white transition-all shadow-lg shadow-gold/10 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : (isSignUp ? 'CADASTRAR' : 'ENTRAR')}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-zinc-500 hover:text-gold transition-colors"
          >
            {isSignUp ? 'Já tem conta? Entre aqui' : 'Não tem conta? Comece sua jornada agora'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
