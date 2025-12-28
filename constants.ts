
import { Scenario, EBook, Language, Course } from './types';

export const SYSTEM_INSTRUCTION = (lang: Language) => `
Você é o "Seduction Xpert", um consultor de elite, carismático e sofisticado.
Idioma atual: ${lang === 'pt' ? 'Português do Brasil' : lang === 'en' ? 'English' : 'Español'}.
Responda SEMPRE no idioma: ${lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}.

Diretrizes:
- Você é um mestre em psicologia social e carisma.
- Ajude homens a superarem a timidez com dicas práticas de abordagem, conversa e linguagem corporal.
- Responda de forma elegante, curta e direta.
- Ao analisar fotos, foque em: ambiente, linguagem corporal sugerida e "abridores" de conversa adequados ao contexto.
`;

// LISTA DE ADMINISTRADORES AUTORIZADOS
export const ADMIN_EMAILS = [
  'fernando@gnog.com.mx',
  'admin@seductionxpert.com'
];

export const YOUTUBE_CHANNEL_URL = "https://youtube.com/@seductionxpert";
export const SUPABASE_URL = "https://snjkiotgyagmyhratyqo.supabase.co";

export const STRIPE_LINKS = {
  PLANS: {
    LOVER: "https://buy.stripe.com/cNi6oIgz33lr1Yoc6E6Ri0c",
    SEDUCTOR: "https://buy.stripe.com/5kQcN682x4pvauU3A86Ri0d"
  },
  PRODUCTS: {
    PRICE_4_99: "https://buy.stripe.com/00w28sdmRaNTcD29Yw6Ri0g",
    PRICE_9_90: "https://buy.stripe.com/3cI9AUciNf4946w9Yw6Ri0f",
    PRICE_19_90: "https://buy.stripe.com/28EcN6beJ4pvgTi6Mk6Ri0e"
  }
};

export const TRANSLATIONS = {
  pt: {
    dashboard: "Dashboard",
    chat: "Chat Privado",
    voice: "Voice Coach",
    scenarios: "Cenários",
    pricing: "Planos",
    ebooks: "E-Books",
    courses: "Cursos VIP",
    youtube: "YouTube",
    admin: "Painel ADM",
    premium: "Premium",
    free: "Grátis",
    buyNow: "Comprar Agora",
    subscribe: "Assinar",
    loverPlan: "Plano Lover",
    seductorPlan: "Plano Seductor",
    unlimitedConsultant: "Consultoria Ilimitada",
    allCourses: "Cursos 100% Liberados",
    heroTitle: "A Conquista Começa de Dentro.",
    heroSubtitle: "Transforme sua timidez em poder social.",
    dailyTips: "Dicas do Consultor",
    startTraining: "Começar Treino",
    locked: "Bloqueado",
    modules: "Módulos",
    addProduct: "Adicionar Produto",
    manageCatalog: "Gerenciar Catálogo",
    selectPrice: "Selecionar Preço Stripe"
  },
  en: {
    dashboard: "Dashboard",
    chat: "Private Chat",
    voice: "Voice Coach",
    scenarios: "Scenarios",
    pricing: "Plans",
    ebooks: "E-Books",
    courses: "VIP Courses",
    youtube: "YouTube",
    admin: "Admin Panel",
    premium: "Premium",
    free: "Free",
    buyNow: "Buy Now",
    subscribe: "Subscribe",
    loverPlan: "Lover Plan",
    seductorPlan: "Seductor Plan",
    unlimitedConsultant: "Unlimited Consulting",
    allCourses: "100% Courses Access",
    heroTitle: "Conquest Starts Within.",
    heroSubtitle: "Transform your shyness into social power.",
    dailyTips: "Daily Tips",
    startTraining: "Start Training",
    locked: "Locked",
    modules: "Modules",
    addProduct: "Add Product",
    manageCatalog: "Manage Catalog",
    selectPrice: "Select Stripe Price"
  },
  es: {
    dashboard: "Dashboard",
    chat: "Chat Privado",
    voice: "Coach de Voz",
    scenarios: "Escenarios",
    pricing: "Planes",
    ebooks: "E-Books",
    courses: "Cursos VIP",
    youtube: "YouTube",
    admin: "Panel ADM",
    premium: "Premium",
    free: "Gratis",
    buyNow: "Comprar Ahora",
    subscribe: "Suscribirse",
    loverPlan: "Plan Lover",
    seductorPlan: "Plan Seductor",
    unlimitedConsultant: "Consultoría Ilimitada",
    allCourses: "Cursos 100% Liberados",
    heroTitle: "La Conquista Empieza Desde Dentro.",
    heroSubtitle: "Transforma tu timidez en poder social.",
    dailyTips: "Consejos Diarios",
    startTraining: "Empezar Entrenamiento",
    locked: "Bloqueado",
    modules: "Módulos",
    addProduct: "Añadir Produto",
    manageCatalog: "Gestionar Catálogo",
    selectPrice: "Seleccionar Precio Stripe"
  }
};

export const AVATARS = [
  'https://images.lucidapp.io/lucid-white-label/679b3695-1774-4b44-9844-42f567b55f19/f3310860-6ef1-42e3-95c5-475a894a7374.png',
  'https://images.lucidapp.io/lucid-white-label/679b3695-1774-4b44-9844-42f567b55f19/80862083-d949-41b4-bc8c-0255c276f571.png',
  'https://images.lucidapp.io/lucid-white-label/679b3695-1774-4b44-9844-42f567b55f19/f9bc4894-37f2-43f1-9457-3f33069c9b19.png',
  'https://images.lucidapp.io/lucid-white-label/679b3695-1774-4b44-9844-42f567b55f19/d1f8934b-b0b2-4d40-b472-13cf809b4566.png',
  'https://images.lucidapp.io/lucid-white-label/679b3695-1774-4b44-9844-42f567b55f19/7e9999f8-bca7-4c40-9a29-0ec8c3f5877c.png'
];

export const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: '1',
    title: { pt: 'O Café Moderno', en: 'The Modern Cafe', es: 'El Café Moderno' },
    description: { pt: 'Ela está lendo um livro. Como abordar?', en: 'She is reading. How to approach?', es: 'Ella está leyendo. ¿Cómo acercarse?' },
    difficulty: 'Easy',
    icon: 'fa-coffee',
    isPremium: false
  },
  {
    id: '2',
    title: { pt: 'Festa VIP', en: 'VIP Party', es: 'Fiesta VIP' },
    description: { pt: 'Ambiente exclusivo. Como se destacar?', en: 'Exclusive environment. How to stand out?', es: 'Ambiente exclusivo. ¿Cómo destacar?' },
    difficulty: 'Medium',
    icon: 'fa-glass-cheers',
    isPremium: true
  }
];

export const SCENARIOS = INITIAL_SCENARIOS;

export const INITIAL_EBOOKS: EBook[] = [
  {
    id: 'eb1',
    title: { pt: 'A Bíblia da Confiança', en: 'The Confidence Bible', es: 'La Biblia de la Confianza' },
    description: { pt: 'Domine sua mente e vença a timidez.', en: 'Master your mind and beat shyness.', es: 'Domina tu mente y vence la timidez.' },
    price: 'U$ 19.90',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: { pt: 'Mestria Social 1.0', en: 'Social Mastery 1.0', es: 'Maestría Social 1.0' },
    modules: 12,
    duration: '6h',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400',
    isLocked: false
  }
];

export const EBOOKS = INITIAL_EBOOKS;
export const COURSES = INITIAL_COURSES;
