
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS, YOUTUBE_CHANNEL_URL } from '../constants';

const YouTubeFeed: React.FC<{language: Language}> = ({ language }) => {
  const t = TRANSLATIONS[language];
  
  const featuredVideos = [
    { id: '1', title: 'Como abordar em qualquer lugar', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800' },
    { id: '2', title: 'Linguagem corporal Alpha', duration: '08:20', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800' },
    { id: '3', title: '3 Erros Fatais no 1º Encontro', duration: '15:10', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className="p-8 space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-red-600/10 border border-red-600/30 p-8 rounded-3xl">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl">
                <i className="fa-brands fa-youtube"></i>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">Seduction Xpert Channel</h2>
                <p className="text-zinc-400">Inscreva-se para dicas diárias gratuitas.</p>
            </div>
        </div>
        <a 
            href={YOUTUBE_CHANNEL_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
        >
            <i className="fa-brands fa-youtube"></i> SE INSCREVER
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredVideos.map(video => (
          <div key={video.id} className="group cursor-pointer">
            <div className="relative h-48 rounded-2xl overflow-hidden mb-4 border border-zinc-800">
                <img src={video.thumbnail} className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
                        <i className="fa-solid fa-play"></i>
                    </div>
                </div>
                <span className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 text-[10px] font-bold rounded">{video.duration}</span>
            </div>
            <h3 className="font-bold text-zinc-200 group-hover:text-red-500 transition-colors">{video.title}</h3>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 text-center space-y-4">
        <h4 className="text-xl font-bold text-gold">Quer acesso a conteúdos sem censura?</h4>
        <p className="text-zinc-400 max-w-lg mx-auto">No YouTube damos as dicas, nos nossos planos damos o passo a passo completo e consultoria personalizada.</p>
        <button className="px-6 py-2 border border-gold/30 text-gold rounded-full text-sm font-bold hover:bg-gold hover:text-black transition-all">
            VER PLANOS VIP
        </button>
      </div>
    </div>
  );
};

export default YouTubeFeed;
