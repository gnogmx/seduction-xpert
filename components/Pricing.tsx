
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS, STRIPE_LINKS } from '../constants';

const Pricing: React.FC<{language: Language}> = ({ language }) => {
  const t = TRANSLATIONS[language];
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif font-bold text-white italic tracking-wide">{t.pricing}</h2>
        <p className="text-zinc-400">Escolha o nível da sua transformação.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PlanCard 
          name={t.loverPlan} 
          price="29.90" 
          features={[t.unlimitedConsultant, "Feedback Instantâneo", "Acesso Mobile"]} 
          isHighlight={false}
          subscribeText={t.subscribe}
          checkoutUrl={STRIPE_LINKS.PLANS.LOVER}
        />
        <PlanCard 
          name={t.seductorPlan} 
          price="79.90" 
          features={[t.allCourses, t.unlimitedConsultant, "Sessões de Voz VIP", "Masterclasses Mensais"]} 
          isHighlight={true}
          subscribeText={t.subscribe}
          checkoutUrl={STRIPE_LINKS.PLANS.SEDUCTOR}
        />
      </div>
    </div>
  );
};

const PlanCard = ({ name, price, features, isHighlight, subscribeText, checkoutUrl }: any) => (
  <div className={`p-10 rounded-3xl flex flex-col space-y-8 transition-all hover:scale-105 border ${isHighlight ? 'bg-zinc-900 border-gold shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'bg-[#080808] border-zinc-800'}`}>
    <div className="space-y-2">
      <h3 className={`text-2xl font-bold ${isHighlight ? 'text-gold' : 'text-white'}`}>{name}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">U$ {price}</span>
        <span className="text-zinc-500 text-sm">/mes</span>
      </div>
    </div>
    <ul className="flex-1 space-y-4">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
          <i className="fa-solid fa-check text-gold"></i> {f}
        </li>
      ))}
    </ul>
    <a 
      href={checkoutUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full py-4 rounded-xl font-bold transition-all text-center ${isHighlight ? 'bg-gold text-black hover:bg-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
    >
      {subscribeText}
    </a>
  </div>
);

export default Pricing;
