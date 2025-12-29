
import React from 'react';
import { AVATARS, TRANSLATIONS } from '../constants';
import { Language } from '../types';

const Dashboard: React.FC<{language: Language}> = ({ language }) => {
  const t = TRANSLATIONS[language];
  return (
    <div className="p-8 space-y-12">
      <section className="relative h-64 md:h-80 rounded-3xl overflow-hidden group">
        <img src={AVATARS[3]} alt="Social" className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 italic">{t.heroTitle}</h2>
          <p className="text-zinc-300 max-w-xl">{t.heroSubtitle}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon="fa-bullseye" label="Missões" value="12" color="text-blue-400" />
        <StatCard icon="fa-star" label="Carisma" value="Elite" color="text-gold" />
        <StatCard icon="fa-heart-pulse" label="Progresso" value="84%" color="text-green-400" />
      </div>

      <section className="space-y-6">
        <h3 className="text-2xl font-serif font-bold accent-gold">{t.dailyTips}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <TipCard
       title={language === 'pt' ? "Contato Visual" : language === 'en' ? "Eye Contact" : "Contacto Visual"}
       content={language === 'pt' ? "Mantenha o contato por 3 segundos." : language === 'en' ? "Hold eye contact for 3 seconds." : "Mantén contacto visual por 3 segundos."}
/>

<TipCard
  title={language === 'pt' ? "Tom de Voz" : language === 'en' ? "Voice Tone" : "Tono de Voz"}
  content={language === 'pt' ? "Fale pausadamente e com calma." : language === 'en' ? "Speak slowly and calmly." : "Habla despacio y con calma."}
/>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl hover:border-gold/30 transition-all">
    <div className={`text-2xl mb-2 ${color}`}><i className={`fa-solid ${icon}`}></i></div>
    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const TipCard = ({ title, content }: any) => (
  <div className="bg-[#111] p-6 rounded-2xl border border-zinc-800">
    <h5 className="font-bold text-gold mb-2"><i className="fa-solid fa-lightbulb mr-2"></i>{title}</h5>
    <p className="text-zinc-400 text-sm leading-relaxed">{content}</p>
  </div>
);

export default Dashboard;
