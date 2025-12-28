
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChatRoom from './components/ChatRoom';
import VoiceCoach from './components/VoiceCoach';
import Scenarios from './components/Scenarios';
import Pricing from './components/Pricing';
import EBooks from './components/EBooks';
import Courses from './components/Courses';
import YouTubeFeed from './components/YouTubeFeed';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';
import { supabase } from './services/supabase';
import { ViewMode, Language } from './types';
import { ADMIN_EMAILS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [language, setLanguage] = useState<Language>('pt');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const initSession = async () => {
      const getSafeEnv = (key: string) => {
        try { return (typeof process !== 'undefined' && process.env) ? process.env[key] : null; } 
        catch { return null; }
      };

      const apiKey = getSafeEnv('API_KEY');
      const supabaseKey = getSafeEnv('SUPABASE_ANON_KEY');

      if (!apiKey || !supabaseKey) {
        console.error("ERRO: Variáveis de ambiente ausentes!");
        setErrorStatus(`Faltando: ${!apiKey ? '[API_KEY] ' : ''}${!supabaseKey ? '[SUPABASE_ANON_KEY]' : ''}`);
      }

      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(currentSession);
      } catch (err: any) {
        console.error("Erro Supabase:", err);
        setErrorStatus("Falha na conexão com Supabase. Verifique suas chaves.");
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  if (loading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-12 h-12 bg-gold/10 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h1 className="text-gold text-4xl font-serif italic tracking-widest animate-pulse mb-2">Seduction Xpert</h1>
        <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-bold">Elite Social Consulting</p>
        
        {errorStatus && (
          <div className="mt-12 p-4 bg-red-950/20 border border-red-500/30 rounded-xl max-w-xs">
            <p className="text-red-500 text-[10px] font-bold uppercase mb-1">Erro de Configuração</p>
            <p className="text-zinc-400 text-xs leading-tight">{errorStatus}</p>
            <p className="text-zinc-500 text-[9px] mt-3 italic">Configure as Environment Variables no Vercel.</p>
          </div>
        )}
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <Layout 
      activeView={activeView} 
      onViewChange={setActiveView} 
      language={language} 
      onLanguageChange={setLanguage}
      userEmail={session.user.email}
    >
      {isAdmin && activeView === ViewMode.DASHBOARD && (
        <div className="fixed top-6 right-6 z-[100] animate-bounce">
          <div className="bg-gold text-black text-[10px] font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
            <i className="fa-solid fa-crown"></i> ADMIN LOGADO
          </div>
        </div>
      )}
      
      {activeView === ViewMode.DASHBOARD && <Dashboard language={language} />}
      {activeView === ViewMode.CHAT && <ChatRoom language={language} />}
      {activeView === ViewMode.VOICE && <VoiceCoach language={language} />}
      {activeView === ViewMode.SCENARIOS && <Scenarios onStartChat={() => setActiveView(ViewMode.CHAT)} language={language} />}
      {activeView === ViewMode.PRICING && <Pricing language={language} />}
      {activeView === ViewMode.EBOOKS && <EBooks language={language} />}
      {activeView === ViewMode.COURSES && <Courses language={language} />}
      {activeView === ViewMode.YOUTUBE && <YouTubeFeed language={language} />}
      {activeView === ViewMode.ADMIN && <AdminPanel language={language} />}
    </Layout>
  );
};

export default App;
