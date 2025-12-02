import React, { useState, useEffect } from 'react';
import { EyeIcon, BookOpenIcon, SparklesIcon, FeatherIcon } from './Icons';
import { lookupSymbol } from '../services/geminiService';
import { SymbolDefinition, LucidProgress } from '../types';

const Grimoire: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'symbols' | 'lucid'>('symbols');

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 pb-24 md:pb-6 animate-fade-in">
            <header className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => setActiveTab('symbols')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === 'symbols' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-mystic-400 hover:bg-white/5'}`}
                >
                    <BookOpenIcon className="w-4 h-4" /> Enciclopédia
                </button>
                <button 
                     onClick={() => setActiveTab('lucid')}
                     className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === 'lucid' ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30' : 'text-mystic-400 hover:bg-white/5'}`}
                >
                    <EyeIcon className="w-4 h-4" /> Sonho Lúcido
                </button>
            </header>

            {activeTab === 'symbols' ? <SymbolEncyclopedia /> : <LucidDreamTrainer />}
        </div>
    );
};

const SymbolEncyclopedia: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState<SymbolDefinition | null>(null);
    const [loading, setLoading] = useState(false);

    // Initial static examples
    const commonSymbols = ['Água', 'Cobra', 'Queda', 'Dentes', 'Voar'];

    const handleSearch = async (term: string) => {
        setLoading(true);
        const data = await lookupSymbol(term);
        setResult(data);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Biblioteca de Símbolos</h2>
                <div className="flex gap-2 mb-6">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pesquisar símbolo (ex: gato, tempestade)..."
                        className="flex-1 bg-mystic-900 border border-mystic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                    />
                    <button 
                        onClick={() => handleSearch(searchTerm)}
                        className="bg-indigo-600 px-4 py-2 rounded-lg text-white hover:bg-indigo-500 transition-colors"
                        disabled={loading}
                    >
                        {loading ? '...' : 'Buscar'}
                    </button>
                </div>

                {!result && !loading && (
                     <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-mystic-400">Populares:</span>
                        {commonSymbols.map(s => (
                            <button key={s} onClick={() => { setSearchTerm(s); handleSearch(s); }} className="text-sm bg-mystic-800 hover:bg-mystic-700 text-indigo-300 px-3 py-1 rounded-full border border-white/5 transition-colors">
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="py-12 flex justify-center text-indigo-400">
                        <SparklesIcon className="animate-spin w-8 h-8" />
                    </div>
                )}

                {result && (
                    <div className="space-y-4 animate-fade-in bg-mystic-900/50 p-6 rounded-xl border border-white/5">
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-serif text-white capitalize">{result.name}</h3>
                            <button onClick={() => setResult(null)} className="text-xs text-mystic-500 hover:text-white">Limpar</button>
                        </div>
                        <p className="text-lg text-indigo-200">{result.meaning}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div>
                                <span className="text-xs font-bold text-teal-400 uppercase">Psicológico</span>
                                <p className="text-sm text-mystic-200">{result.psychological}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-purple-400 uppercase">Espiritual</span>
                                <p className="text-sm text-mystic-200">{result.spiritual}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-orange-400 uppercase">Cultural</span>
                                <p className="text-sm text-mystic-200">{result.cultural}</p>
                            </div>
                             <div>
                                <span className="text-xs font-bold text-green-400 uppercase">Conselho</span>
                                <p className="text-sm text-mystic-200">{result.advice}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const LucidDreamTrainer: React.FC = () => {
    const [progress, setProgress] = useState<LucidProgress>(() => {
        const today = new Date().toISOString().split('T')[0];
        const saved = localStorage.getItem(`lucid_progress_${today}`);
        return saved ? JSON.parse(saved) : { date: today, realityChecks: 0, didMeditate: false, didJournal: false };
    });

    const updateProgress = (update: Partial<LucidProgress>) => {
        const newProgress = { ...progress, ...update };
        setProgress(newProgress);
        localStorage.setItem(`lucid_progress_${progress.date}`, JSON.stringify(newProgress));
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <EyeIcon className="w-32 h-32" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Check de Realidade</h2>
                    <p className="text-sm text-mystic-300 mb-6">Pergunte-se: "Estou sonhando?" Tente ler algo, desviar o olhar e ler de novo.</p>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => updateProgress({ realityChecks: progress.realityChecks + 1 })}
                            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
                        >
                            + Fiz um teste
                        </button>
                        <span className="text-2xl font-bold text-teal-300">{progress.realityChecks} <span className="text-xs font-normal text-mystic-400">hoje</span></span>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">Rotina de Lucidez</h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 bg-mystic-900/50 rounded-xl cursor-pointer hover:bg-mystic-800 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={progress.didJournal} 
                                onChange={(e) => updateProgress({ didJournal: e.target.checked })}
                                className="w-5 h-5 accent-teal-500 rounded"
                            />
                            <span className={progress.didJournal ? 'text-teal-200 line-through' : 'text-mystic-200'}>Registrar sonhos em detalhes</span>
                        </label>
                         <label className="flex items-center gap-3 p-3 bg-mystic-900/50 rounded-xl cursor-pointer hover:bg-mystic-800 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={progress.didMeditate} 
                                onChange={(e) => updateProgress({ didMeditate: e.target.checked })}
                                className="w-5 h-5 accent-teal-500 rounded"
                            />
                            <span className={progress.didMeditate ? 'text-teal-200 line-through' : 'text-mystic-200'}>Meditação de 5 min antes de dormir</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-l-4 border-purple-500">
                <h3 className="text-lg font-bold text-purple-300 mb-2 flex items-center gap-2">
                    <FeatherIcon className="w-4 h-4" /> Dica do Dia
                </h3>
                <p className="text-mystic-100 italic">
                    "Ao acordar, não se mova imediatamente. Fique imóvel e tente 'agarrar' os fragmentos do sonho que acabaram de acontecer. O movimento físico dissipa a memória onírica."
                </p>
            </div>
        </div>
    );
};

export default Grimoire;
