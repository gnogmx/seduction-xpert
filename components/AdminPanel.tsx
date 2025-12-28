
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, EBOOKS, COURSES, STRIPE_LINKS } from '../constants';
import { DataService } from '../services/supabase';

const AdminPanel: React.FC<{language: Language}> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'courses' | 'ebooks'>('courses');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [stripeLink, setStripeLink] = useState(STRIPE_LINKS.PRODUCTS.PRICE_9_90);

  const handleSave = async () => {
    if (!title || !image) return alert('Preencha os campos!');
    setIsSaving(true);
    try {
      await DataService.saveProduct(activeTab, {
        title: { pt: title, en: title, es: title },
        image,
        stripe_url: stripeLink,
        price: activeTab === 'ebooks' ? 'U$ 9.90' : undefined,
        modules: activeTab === 'courses' ? 10 : undefined
      });
      alert('Produto salvo no Supabase com sucesso!');
      setShowAddForm(false);
      setTitle('');
      setImage('');
    } catch (e: any) {
      alert('Erro ao salvar: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">{t.admin}</h2>
            <p className="text-zinc-500 text-sm">Controle de Inventário e Infoprodutos</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-gold text-black font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2"
        >
            <i className={`fa-solid ${showAddForm ? 'fa-xmark' : 'fa-plus'}`}></i> 
            {showAddForm ? 'Fechar' : t.addProduct}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-gold/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-gold mb-6">{t.addProduct}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-2 block">Título do Produto</label>
                <input 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-gold outline-none text-white" 
                  placeholder="Ex: Manual do Alfa" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-2 block">URL da Imagem de Capa</label>
                <input 
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-gold outline-none text-white" 
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-2 block">{t.selectPrice}</label>
                <select 
                  value={stripeLink}
                  onChange={e => setStripeLink(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-gold outline-none text-white"
                >
                  <option value={STRIPE_LINKS.PRODUCTS.PRICE_4_99}>Checkout Stripe - U$ 4.99</option>
                  <option value={STRIPE_LINKS.PRODUCTS.PRICE_9_90}>Checkout Stripe - U$ 9.90</option>
                  <option value={STRIPE_LINKS.PRODUCTS.PRICE_19_90}>Checkout Stripe - U$ 19.90</option>
                </select>
              </div>
              <div className="flex items-end h-full pb-1">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-gold transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : 'Salvar no Supabase'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button 
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-zinc-800 text-gold' : 'text-zinc-600 hover:text-zinc-400'}`}
        >
            Cursos
        </button>
        <button 
            onClick={() => setActiveTab('ebooks')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'ebooks' ? 'bg-zinc-800 text-gold' : 'text-zinc-600 hover:text-zinc-400'}`}
        >
            E-Books
        </button>
      </div>

      <div className="bg-[#080808] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-900/50 border-b border-zinc-800">
                <tr className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                    <th className="px-6 py-5">Preview</th>
                    <th className="px-6 py-5">Título</th>
                    <th className="px-6 py-5">Preço / Módulos</th>
                    <th className="px-6 py-5 text-right">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
                {(activeTab === 'courses' ? COURSES : EBOOKS).map((item: any) => (
                    <tr key={item.id} className="hover:bg-zinc-900/20 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-800 group-hover:border-gold/50 transition-all">
                                <img src={item.image} className="w-full h-full object-cover" />
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <p className="font-bold text-white text-sm">{item.title[language]}</p>
                            <p className="text-[10px] text-zinc-600 uppercase mt-1">UUID: {item.id}</p>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-gold">
                                  {activeTab === 'courses' ? `${item.modules} Módulos` : item.price}
                              </span>
                              <span className="text-[9px] text-zinc-600 truncate max-w-[150px]">Link Stripe Ativo</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-3">
                                <button className="w-9 h-9 bg-zinc-800/50 rounded-lg flex items-center justify-center text-zinc-400 hover:text-gold hover:bg-zinc-800 transition-all">
                                    <i className="fa-solid fa-pen-to-square text-sm"></i>
                                </button>
                                <button className="w-9 h-9 bg-zinc-800/50 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-zinc-800 transition-all">
                                    <i className="fa-solid fa-trash-can text-sm"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
