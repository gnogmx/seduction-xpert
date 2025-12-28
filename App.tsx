
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

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [language, setLanguage] = useState<Language>('pt');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleScenarioStart = (title: string) => {
    setActiveView(ViewMode.CHAT);
  };

  const renderContent = () => {
    switch (activeView) {
      case ViewMode.DASHBOARD: return <Dashboard language={language} />;
      case ViewMode.CHAT: return <ChatRoom language={language} />;
      case ViewMode.VOICE: return <VoiceCoach language={language} />;
      case ViewMode.SCENARIOS: return <Scenarios onStartChat={handleScenarioStart} language={language} />;
      case ViewMode.PRICING: return <Pricing language={language} />;
      case ViewMode.EBOOKS: return <EBooks language={language} />;
      case ViewMode.COURSES: return <Courses language={language} />;
      case ViewMode.YOUTUBE: return <YouTubeFeed language={language} />;
      case ViewMode.ADMIN: return <AdminPanel language={language} />;
      default: return <Dashboard language={language} />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-gold animate-pulse text-2xl font-serif italic">Seduction Xpert...</div>
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
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
