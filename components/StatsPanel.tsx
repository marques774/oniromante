import React, { useEffect, useState } from 'react';
import { DreamEntry } from '../types';
import { ChartIcon, SmileIcon, TagIcon, SparklesIcon } from './Icons';

const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState({
    totalDreams: 0,
    nightmareCount: 0,
    topSymbols: [] as { name: string; count: number }[],
    topEmotions: [] as { name: string; count: number }[],
    thisWeekCount: 0,
    wrapped: null as any
  });

  useEffect(() => {
    const savedDreams = localStorage.getItem('oniromante_dreams');
    if (savedDreams) {
      const dreams: DreamEntry[] = JSON.parse(savedDreams);
      
      const symbolMap: Record<string, number> = {};
      const emotionMap: Record<string, number> = {};
      let nightmares = 0;
      let weekCount = 0;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      dreams.forEach(d => {
        if (d.isNightmare) nightmares++;
        if (new Date(d.date) > oneWeekAgo) weekCount++;

        d.symbols.forEach(s => {
          const clean = s.toLowerCase().trim();
          symbolMap[clean] = (symbolMap[clean] || 0) + 1;
        });

        d.emotions.forEach(e => {
            const clean = e.toLowerCase().trim();
            emotionMap[clean] = (emotionMap[clean] || 0) + 1;
        });
      });

      const topSymbols = Object.entries(symbolMap).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({name, count}));
      const topEmotions = Object.entries(emotionMap).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({name, count}));

      setStats({
        totalDreams: dreams.length,
        nightmareCount: nightmares,
        thisWeekCount: weekCount,
        topSymbols,
        topEmotions,
        wrapped: dreams.length > 2 ? {
            topSymbol: topSymbols[0]?.name || 'N/A',
            topEmotion: topEmotions[0]?.name || 'N/A',
            theme: dreams[0]?.analysis?.dailyTheme || 'Mistério',
            archetype: 'O Viajante' // Mock archetype based on data
        } : null
      });
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-24 md:pb-6 animate-fade-in">
        <header>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <ChartIcon className="text-indigo-400" /> 
            <span>Padrões Oníricos</span>
            </h1>
            <p className="text-mystic-200">A geometria sagrada da sua mente subconsciente.</p>
        </header>

        {/* Wrapped Section */}
        {stats.wrapped && (
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-20"><SparklesIcon className="w-48 h-48" /></div>
                <h2 className="text-2xl font-bold text-white mb-6 font-serif">Seu Mês em Sonhos</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                    <div>
                        <span className="text-xs text-purple-300 uppercase tracking-widest block mb-1">Símbolo Principal</span>
                        <span className="text-xl md:text-2xl font-bold text-white capitalize">{stats.wrapped.topSymbol}</span>
                    </div>
                    <div>
                        <span className="text-xs text-purple-300 uppercase tracking-widest block mb-1">Emoção Base</span>
                        <span className="text-xl md:text-2xl font-bold text-white capitalize">{stats.wrapped.topEmotion}</span>
                    </div>
                     <div>
                        <span className="text-xs text-purple-300 uppercase tracking-widest block mb-1">Tema Recorrente</span>
                        <span className="text-xl md:text-2xl font-bold text-white capitalize">{stats.wrapped.theme}</span>
                    </div>
                     <div>
                        <span className="text-xs text-purple-300 uppercase tracking-widest block mb-1">Arquétipo</span>
                        <span className="text-xl md:text-2xl font-bold text-yellow-300 capitalize">{stats.wrapped.archetype}</span>
                    </div>
                </div>
            </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
             <div className="glass-panel p-4 rounded-2xl text-center">
                 <span className="text-3xl font-bold text-white block">{stats.totalDreams}</span>
                 <span className="text-xs text-mystic-400 uppercase">Sonhos</span>
             </div>
             <div className="glass-panel p-4 rounded-2xl text-center">
                 <span className="text-3xl font-bold text-indigo-400 block">{stats.thisWeekCount}</span>
                 <span className="text-xs text-mystic-400 uppercase">Semana</span>
             </div>
             <div className="glass-panel p-4 rounded-2xl text-center">
                 <span className="text-3xl font-bold text-red-400 block">{stats.nightmareCount}</span>
                 <span className="text-xs text-mystic-400 uppercase">Pesadelos</span>
             </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TagIcon className="text-blue-400" /> Símbolos Recorrentes
                </h3>
                {stats.topSymbols.length > 0 ? (
                    <div className="space-y-3">
                        {stats.topSymbols.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-xs font-mono text-mystic-500 w-4">#{i+1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-blue-200 capitalize">{item.name}</span>
                                        <span className="text-mystic-400">{item.count}x</span>
                                    </div>
                                    <div className="h-1.5 bg-mystic-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full" 
                                            style={{ width: `${(item.count / stats.topSymbols[0].count) * 100}%`}}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-mystic-500 text-sm">Dados insuficientes.</p>}
            </div>

            <div className="glass-panel p-6 rounded-2xl">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <SmileIcon className="text-pink-400" /> Mapa Emocional
                </h3>
                {stats.topEmotions.length > 0 ? (
                     <div className="space-y-3">
                        {stats.topEmotions.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-xs font-mono text-mystic-500 w-4">#{i+1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-pink-200 capitalize">{item.name}</span>
                                        <span className="text-mystic-400">{item.count}x</span>
                                    </div>
                                    <div className="h-1.5 bg-mystic-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-pink-500 rounded-full" 
                                            style={{ width: `${(item.count / stats.topEmotions[0].count) * 100}%`}}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-mystic-500 text-sm">Dados insuficientes.</p>}
            </div>
        </div>
    </div>
  );
};

export default StatsPanel;
