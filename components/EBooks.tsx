
import React from 'react';
import { Language } from '../types';
import { EBOOKS, TRANSLATIONS, STRIPE_LINKS } from '../constants';

const EBooks: React.FC<{language: Language}> = ({ language }) => {
  const t = TRANSLATIONS[language];
  
  // Mapeamento de exemplo para os links fornecidos
  const getCheckoutLink = (price: string) => {
    if (price.includes('19.90')) return STRIPE_LINKS.PRODUCTS.PRICE_19_90;
    if (price.includes('9.90')) return STRIPE_LINKS.PRODUCTS.PRICE_9_90;
    return STRIPE_LINKS.PRODUCTS.PRICE_4_99;
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white italic">{t.ebooks}</h2>
          <p className="text-zinc-500">Conhecimento profundo em formato digital.</p>
        </div>
        <i className="fa-solid fa-book-open text-4xl text-gold/20"></i>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {EBOOKS.map(eb => (
          <div key={eb.id} className="group bg-[#080808] border border-zinc-800 rounded-2xl overflow-hidden hover:border-gold/50 transition-all flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img src={eb.image} alt={eb.title[language]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-gold border border-gold/20">DIGITAL</div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <h3 className="text-xl font-bold group-hover:text-gold transition-colors">{eb.title[language]}</h3>
              <p className="text-zinc-500 text-sm line-clamp-2">{eb.description[language]}</p>
              <div className="flex items-center justify-between pt-4 mt-auto">
                <span className="text-gold font-bold">{eb.price}</span>
                <a 
                  href={getCheckoutLink(eb.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-zinc-800 text-xs font-bold rounded-lg hover:bg-gold hover:text-black transition-all"
                >
                  {t.buyNow}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EBooks;
