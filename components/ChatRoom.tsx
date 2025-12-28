
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/gemini';
import { Message, Language } from '../types';
import { AVATARS, TRANSLATIONS } from '../constants';

const ChatRoom: React.FC<{language: Language}> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: language === 'pt' ? 'Olá. Como posso ajudar você hoje? Você pode me enviar uma foto do ambiente ou da pessoa para eu sugerir a melhor abordagem.' : language === 'en' ? 'Hello. How can I help you today? You can send me a photo of the environment or person so I can suggest the best approach.' : 'Hola. ¿Cómo puedo ayudarte hoy? Puedes enviarme una foto del ambiente o de la persona para sugerir la mejor acción.',
          timestamp: new Date()
        }
    ]);
    setHistory([]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: input, 
      image: selectedImage || undefined,
      timestamp: new Date() 
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const currentInput = input;
    const currentImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);

    try {
      const response = await GeminiService.generateMultimodalResponse(language, history, currentInput || (language === 'pt' ? "Analise esta imagem e me dê dicas." : "Analyze this image and give me tips."), currentImage || undefined);
      
      const modelText = response.text || 'Error';
      
      // Update local message list
      setMessages(prev => [...prev, { 
        id: (Date.now()+1).toString(), 
        role: 'model', 
        text: modelText, 
        timestamp: new Date() 
      }]);

      // Update AI history
      const userParts: any[] = [{ text: currentInput || (language === 'pt' ? "Analise esta imagem." : "Analyze this image.") }];
      if (currentImage) {
        userParts.push({ inlineData: { mimeType: 'image/jpeg', data: currentImage.split(',')[1] } });
      }

      setHistory(prev => [
        ...prev,
        { role: 'user', parts: userParts },
        { role: 'model', parts: [{ text: modelText }] }
      ]);

    } catch (error) { 
      console.error(error); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="relative">
                <img src={AVATARS[2]} className="w-10 h-10 rounded-full border border-gold object-cover" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div>
                <h2 className="font-bold text-white">Seduction Xpert</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.premium}</p>
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[85%] space-y-3 ${
                m.role === 'user' 
                ? 'bg-zinc-800 text-white rounded-tr-none' 
                : 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-tl-none'
            }`}>
              {m.image && (
                <img src={m.image} alt="Sent" className="max-w-full rounded-lg border border-white/10 shadow-lg" />
              )}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
              <div className="text-[9px] opacity-40 text-right">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-zinc-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto space-y-4">
          {selectedImage && (
            <div className="relative inline-block group">
              <img src={selectedImage} className="h-24 w-24 object-cover rounded-xl border-2 border-gold shadow-lg" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-700 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 bg-zinc-900 border border-zinc-800 text-gold rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-all shrink-0"
                title="Subir Foto"
            >
              <i className="fa-solid fa-camera"></i>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            <div className="flex-1 relative">
                <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={language === 'pt' ? "Diga algo ou envie uma foto..." : "Say something or send a photo..."}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-all"
                />
            </div>

            <button 
                onClick={handleSend} 
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className="w-12 h-12 bg-gold text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 shrink-0"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
