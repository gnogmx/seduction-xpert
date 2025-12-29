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

// ✅ Em Vite, o frontend só lê import.meta.env.VITE_*
const ENV = (import.meta as any).env || {};
const MISSING_ENV: string[] = [];
if (!ENV.VITE_SUPABASE_URL) MISSING_ENV.push('VITE_SUPABASE_URL');
if (!ENV.VITE_SUPABASE_ANON_KEY) MISSING_ENV.push('VITE_SUPABASE_ANON_KEY');

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [language, setLanguage] = useState<Language>('pt');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) console.error("Erro ao buscar sessão:", error.message);
        setSession(currentSession);
      } catch (err: any) {
        console.error("Falha crítica no Supabase:", err);
        setErrorStatus("Falha na conexão com o Supabase. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel e faça Redeploy.");
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Splash
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 rounded-full border-2 border-zinc-700 animate-pulse mb-6" />
        <h1 className="text-4xl font-serif italic text-zinc-300 mb-2">Seduction Xpert</h1>
        <p className="text-zinc-500 tracking-widest text-xs mb-8">ELITE SOCIAL CONSULTING</p>

        {MISSING_ENV.length > 0 ? (
          <div className="bg-red-950/30 border border-red-800 text-red-200 px-6 py-4 rounded-xl max-w-md">
            <div className="font-bold mb-1">ERRO DE CONFIGURAÇÃO</div>
            <div className="text-sm">Faltando: [{MISSING_ENV.join(' ')}]</div>
            <div className="text-xs text-red-200/70 mt-2">
              No Vercel: Settings → Environment Variables → (All Environments) → Redeploy.
            </div>
          </div>
        ) : errorStatus ? (
          <div className="bg-red-950/30 border border-red-800 text-red-200 px-6 py-4 rounded-xl max-w-md">
            <div className="font-bold mb-1">ERRO</div>
            <div className="text-sm">{errorStatus}</div>
          </div>
        ) : null}
      </div>
    );
  }

  // Auth gate
  if (!session) {
    return <Auth language={language} onLanguageChange={setLanguage} />;
  }

  const userEmail = session?.user?.email || '';
  const isAdmin = ADMIN_EMAILS.includes(userEmail);

  // Route guard do Admin
  const safeActiveView =
    activeView === ViewMode.ADMIN && !isAdmin ? ViewMode.DASHBOARD : activeView;

  return (
    <Layout
  activeView={safeActiveView}
  onViewChange={setActiveView}
  language={language}
  onLanguageChange={setLanguage}
  userEmail={userEmail}
>
  {safeActiveView === ViewMode.DASHBOARD && <Dashboard language={language} />}
  {safeActiveView === ViewMode.CHAT && <ChatRoom language={language} session={session} />}
  {safeActiveView === ViewMode.VOICE && <VoiceCoach language={language} />}
  {safeActiveView === ViewMode.SCENARIOS && <Scenarios language={language} session={session} />}
  {safeActiveView === ViewMode.COURSES && <Courses language={language} />}
  {safeActiveView === ViewMode.EBOOKS && <EBooks language={language} />}
  {safeActiveView === ViewMode.YOUTUBE && <YouTubeFeed language={language} />}
  {safeActiveView === ViewMode.PRICING && <Pricing language={language} />}
  {safeActiveView === ViewMode.ADMIN && isAdmin && <AdminPanel language={language} />}
</Layout>
  );
};

export default App;
