
import React from 'react';
import { ViewMode, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, language, onLanguageChange }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <aside className="w-20 md:w-64 border-r border-zinc-800 flex flex-col bg-[#050505] z-50">
        <div className="p-6 text-center">
            <h1 className="hidden md:block text-2xl font-serif font-bold accent-gold italic leading-tight">Seduction<br/>Xpert</h1>
            <div className="md:hidden text-2xl font-serif accent-gold font-bold">SX</div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <NavItem icon="fa-house" label={t.dashboard} active={activeView === ViewMode.DASHBOARD} onClick={() => onViewChange(ViewMode.DASHBOARD)} />
          <NavItem icon="fa-comment" label={t.chat} active={activeView === ViewMode.CHAT} onClick={() => onViewChange(ViewMode.CHAT)} />
          <NavItem icon="fa-microphone" label={t.voice} active={activeView === ViewMode.VOICE} onClick={() => onViewChange(ViewMode.VOICE)} />
          <NavItem icon="fa-chess-knight" label={t.scenarios} active={activeView === ViewMode.SCENARIOS} onClick={() => onViewChange(ViewMode.SCENARIOS)} />
          <NavItem icon="fa-graduation-cap" label={t.courses} active={activeView === ViewMode.COURSES} onClick={() => onViewChange(ViewMode.COURSES)} />
          <NavItem icon="fa-book" label={t.ebooks} active={activeView === ViewMode.EBOOKS} onClick={() => onViewChange(ViewMode.EBOOKS)} />
          <NavItem icon="fa-brands fa-youtube" label={t.youtube} active={activeView === ViewMode.YOUTUBE} onClick={() => onViewChange(ViewMode.YOUTUBE)} />
          <NavItem icon="fa-gem" label={t.pricing} active={activeView === ViewMode.PRICING} onClick={() => onViewChange(ViewMode.PRICING)} />
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-4">
            <button 
                onClick={() => onViewChange(ViewMode.ADMIN)}
                className={`w-full flex items-center gap-4 p-2 rounded-lg text-xs font-bold transition-all ${activeView === ViewMode.ADMIN ? 'text-gold bg-gold/10' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
                <i className="fa-solid fa-lock"></i>
                <span className="hidden md:block">ADMIN PANEL</span>
            </button>
            <div className="flex gap-2 justify-center md:justify-start">
                {(['pt', 'en', 'es'] as Language[]).map(l => (
                    <button 
                        key={l}
                        onClick={() => onLanguageChange(l)}
                        className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${language === l ? 'border-gold text-gold bg-gold/10' : 'border-zinc-800 text-zinc-500'}`}
                    >
                        {l.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-3 md:bg-zinc-900 md:p-3 rounded-xl overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gold shrink-0 flex items-center justify-center text-black font-bold">U</div>
                <div className="hidden md:block overflow-hidden text-left">
                    <p className="text-sm font-semibold truncate text-zinc-200 leading-none mb-1">Alfa User</p>
                    <p className="text-[10px] text-gold uppercase tracking-tighter">Premium</p>
                </div>
            </div>
        </div>
      </aside>

      <main className="flex-1 relative flex flex-col overflow-auto bg-[#0a0a0a]">
        {children}
      </main>
    </div>
  );
};

const NavItem: React.FC<{icon: string, label: string, active: boolean, onClick: () => void}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
      active ? 'bg-zinc-800/50 text-white border-l-2 border-gold' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
    }`}
  >
    <i className={`fa-solid ${icon} w-5 text-center`}></i>
    <span className="hidden md:block font-medium text-sm">{label}</span>
  </button>
);

export default Layout;
