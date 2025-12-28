
import React from 'react';
import { SCENARIOS, TRANSLATIONS } from '../constants';
import { Language, ViewMode } from '../types';

interface ScenariosProps {
  onStartChat: (scenarioTitle: string) => void;
  language: Language;
}

const Scenarios: React.FC<ScenariosProps> = ({ onStartChat, language }) => {
  const t = TRANSLATIONS[language];
  return (
    <div className="p-8">
      <div className="mb-12">
        <h2 className="text-3xl font-serif font-bold accent-gold mb-2 italic">{t.scenarios}</h2>
        <p className="text-zinc-400">Pratique situações do mundo real em um ambiente seguro.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SCENARIOS.map(scenario => (
          <div 
            key={scenario.id} 
            className="group bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 hover:border-gold/50 transition-all duration-300 relative"
          >
            {scenario.isPremium && (
                <div className="absolute top-4 right-4 text-[10px] bg-gold/20 text-gold px-2 py-1 rounded font-bold">
                    <i className="fa-solid fa-crown mr-1"></i> {t.premium}
                </div>
            )}
            
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-gold text-2xl group-hover:scale-110 transition-transform">
                <i className={`fa-solid ${scenario.icon}`}></i>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                scenario.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                scenario.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {scenario.difficulty}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors">{scenario.title[language]}</h3>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">{scenario.description[language]}</p>
            
            <button 
              onClick={() => onStartChat(scenario.title[language])}
              className={`w-full py-3 font-bold rounded-xl transition-all ${
                  scenario.isPremium 
                  ? 'bg-zinc-800 text-gold border border-gold/30 hover:bg-gold hover:text-black' 
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {t.startTraining}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scenarios;
