
import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, INITIAL_COURSES } from '../constants';
import { DataService } from '../services/supabase';

const Courses: React.FC<{language: Language}> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await DataService.getProducts('courses');
        setCourses(data.length > 0 ? data : INITIAL_COURSES);
      } catch (e) {
        setCourses(INITIAL_COURSES);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 gap-4">
        <div>
          <h2 className="text-4xl font-serif font-bold text-white italic">{t.courses}</h2>
          <p className="text-zinc-400 mt-2">Acesso exclusivo para membros do Plano Seductor.</p>
        </div>
        <div className="flex items-center gap-2 text-gold text-sm font-bold bg-gold/5 px-4 py-2 rounded-full border border-gold/20">
          <i className="fa-solid fa-crown"></i> {t.premium}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div key={course.id} className="group relative bg-[#080808] border border-zinc-800 rounded-3xl overflow-hidden hover:border-gold/50 transition-all duration-500 flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title[language] || course.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${course.isLocked ? 'grayscale' : ''}`} 
                />
                {course.isLocked && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-[2px]">
                    <i className="fa-solid fa-lock text-3xl text-gold mb-2"></i>
                    <span className="text-xs font-bold uppercase tracking-widest text-gold">{t.locked}</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/80 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full text-zinc-300 border border-white/10">
                    {course.modules} {t.modules}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col space-y-6">
                <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">{course.title[language] || course.title}</h3>
                
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gold h-full w-[10%] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                </div>
                
                <a 
                  href={course.isLocked ? '#' : (course.stripe_url || '#')}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    course.isLocked 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-gold text-black hover:bg-white hover:scale-[1.02] shadow-lg shadow-gold/5 text-center'
                  }`}
                >
                  {course.isLocked ? t.locked : t.startTraining}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
