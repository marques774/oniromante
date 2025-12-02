import React, { useEffect, useState } from 'react';
import { DailyInsights, Mood, SleepQuality, UserStatus } from '../types';
import { fetchDailyInsights } from '../services/geminiService';
import { SparklesIcon, MoonIcon, SmileIcon, BedIcon, RefreshIcon, SunIcon } from './Icons';

interface DailyDashboardProps {
  userStatus: UserStatus;
  onUpdateStatus: (status: Partial<UserStatus>) => void;
}

const DailyDashboard: React.FC<DailyDashboardProps> = ({ userStatus, onUpdateStatus }) => {
  const [insights, setInsights] = useState<DailyInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [sleepText, setSleepText] = useState(userStatus.sleepNotes || '');

  useEffect(() => {
    // Check localStorage for today's insights to avoid spamming API
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(`oniromante_insights_${today}`);
    
    if (stored) {
      setInsights(JSON.parse(stored));
    } else {
      loadInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    const data = await fetchDailyInsights();
    if (data) {
      setInsights(data);
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`oniromante_insights_${today}`, JSON.stringify(data));
    }
    setLoading(false);
  };

  const handleSleepTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setSleepText(text);
    onUpdateStatus({ sleepNotes: text });
  };

  const moods = [
    { value: Mood.Amazing, label: 'Incrível', emoji: '🤩' },
    { value: Mood.Good, label: 'Bem', emoji: '🙂' },
    { value: Mood.Neutral, label: 'Normal', emoji: '😐' },
    { value: Mood.Bad, label: 'Mal', emoji: '😔' },
    { value: Mood.Awful, label: 'Péssimo', emoji: '😫' },
  ];

  const sleepQualities = [
    { value: SleepQuality.Excellent, label: 'Revigorante', emoji: '🛌' },
    { value: SleepQuality.Good, label: 'Bom', emoji: '😴' },
    { value: SleepQuality.Fair, label: 'Regular', emoji: '😑' },
    { value: SleepQuality.Poor, label: 'Ruim', emoji: '🥱' },
    { value: SleepQuality.Terrible, label: 'Insônia', emoji: '🧟' },
  ];

  return (
    <div className="p-6 space-y-8 pb-24 md:pb-6 max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <SparklesIcon className="text-yellow-400" /> 
          <span>Portal do Dia</span>
        </h1>
        <p className="text-mystic-200">Alinhe suas energias e entenda seu interior.</p>
      </header>

      {/* Daily Insights Section */}
      <section className="grid md:grid-cols-2 gap-4">
        {/* Motivation Card */}
        <div className="glass-panel p-6 rounded-2xl md:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <SunIcon className="w-24 h-24" />
          </div>
          <h2 className="text-xl font-semibold text-mystic-100 mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-indigo-400" /> Mensagem do Universo
          </h2>
          {loading ? (
             <div className="animate-pulse space-y-2">
               <div className="h-4 bg-mystic-700 rounded w-3/4"></div>
               <div className="h-4 bg-mystic-700 rounded w-1/2"></div>
             </div>
          ) : insights ? (
            <blockquote className="text-xl italic text-white font-medium border-l-4 border-indigo-500 pl-4 py-2">
              "{insights.motivation}"
            </blockquote>
          ) : (
            <button onClick={loadInsights} className="text-indigo-300 flex items-center gap-2 hover:text-white transition-colors">
              <RefreshIcon className="w-4 h-4" /> Revelar mensagem
            </button>
          )}
        </div>

        {/* Lucky Items */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <h2 className="text-lg font-semibold text-mystic-200 mb-4">Sorte do Dia</h2>
          {loading ? (
            <div className="animate-pulse h-16 bg-mystic-700 rounded"></div>
          ) : insights ? (
            <div className="flex items-center justify-around">
               <div className="text-center">
                 <span className="block text-4xl font-bold text-yellow-400">{insights.luckyNumber}</span>
                 <span className="text-xs text-mystic-300 uppercase tracking-wider">Número</span>
               </div>
               <div className="w-px h-12 bg-mystic-700"></div>
               <div className="text-center">
                 <span className="block text-xl font-bold text-white mb-1" style={{ color: insights.luckyColor.includes('Dourado') ? '#FACC15' : undefined }}>{insights.luckyColor}</span>
                 <span className="text-xs text-mystic-300 uppercase tracking-wider">Cor</span>
               </div>
            </div>
          ) : null}
        </div>

         {/* Word of Day */}
         <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-mystic-200 mb-4">Palavra Mágica</h2>
          {loading ? (
             <div className="animate-pulse space-y-2">
                <div className="h-6 bg-mystic-700 rounded w-1/2"></div>
                <div className="h-12 bg-mystic-700 rounded w-full"></div>
             </div>
          ) : insights ? (
            <div>
              <p className="text-2xl font-bold text-indigo-300 mb-1 capitalize">{insights.wordOfDay}</p>
              <p className="text-sm text-mystic-100 opacity-90 leading-relaxed">{insights.wordMeaning}</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Trackers Section */}
      <section className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Mood Tracker */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
          <h2 className="text-xl font-semibold text-mystic-100 mb-6 flex items-center gap-2">
            <SmileIcon className="w-5 h-5 text-pink-400" /> Humor do Dia
          </h2>
          <div className="flex justify-between gap-2 mb-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => onUpdateStatus({ mood: m.value })}
                className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-300 flex-1 ${
                  userStatus.mood === m.value 
                    ? 'bg-pink-500/30 ring-2 ring-pink-500 scale-105' 
                    : 'hover:bg-mystic-700/50 opacity-60 hover:opacity-100'
                }`}
              >
                <span className="text-2xl filter drop-shadow-lg">{m.emoji}</span>
                <span className="text-[10px] md:text-xs font-medium truncate w-full text-center">{m.label}</span>
              </button>
            ))}
          </div>
          {userStatus.mood && (
            <div className="mt-4 text-center text-sm text-pink-200 animate-fade-in bg-pink-900/20 p-2 rounded-lg border border-pink-500/10">
              Humor registrado. O universo acolhe seu sentimento.
            </div>
          )}
        </div>

        {/* Sleep Tracker */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
          <h2 className="text-xl font-semibold text-mystic-100 mb-6 flex items-center gap-2">
            <BedIcon className="w-5 h-5 text-blue-400" /> Registro de Sono
          </h2>
           <div className="flex justify-between gap-2 mb-6">
            {sleepQualities.map((s) => (
              <button
                key={s.value}
                onClick={() => onUpdateStatus({ sleep: s.value })}
                className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-300 flex-1 ${
                  userStatus.sleep === s.value 
                    ? 'bg-blue-500/30 ring-2 ring-blue-500 scale-105' 
                    : 'hover:bg-mystic-700/50 opacity-60 hover:opacity-100'
                }`}
              >
                <span className="text-2xl filter drop-shadow-lg">{s.emoji}</span>
                <span className="text-[10px] md:text-xs font-medium truncate w-full text-center">{s.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-auto">
            <label className="block text-sm text-mystic-300 mb-2">Como você acordou?</label>
            <textarea
              value={sleepText}
              onChange={handleSleepTextChange}
              placeholder="Ex: Descansado, grogue, com dores, agitado..."
              className="w-full bg-mystic-900/50 border border-mystic-600 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors placeholder-mystic-500 resize-none h-20"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DailyDashboard;