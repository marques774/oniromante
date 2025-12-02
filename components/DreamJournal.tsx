import React, { useState, useEffect } from 'react';
import { DreamEntry, ArtStyle } from '../types';
import { analyzeDreamRaw, generateDreamImage } from '../services/geminiService';
import { BookHeartIcon, PlusIcon, TagIcon, BrainCircuitIcon, TrashIcon, SmileIcon, WandIcon, ShareIcon, SparklesIcon, PaletteIcon } from './Icons';

interface DreamJournalProps {
  onAnalyzeDream: (dream: DreamEntry) => void;
}

const DreamJournal: React.FC<DreamJournalProps> = ({ onAnalyzeDream }) => {
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [rawText, setRawText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<Partial<DreamEntry> | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>('surreal');

  useEffect(() => {
    const savedDreams = localStorage.getItem('oniromante_dreams');
    if (savedDreams) {
      setDreams(JSON.parse(savedDreams));
    }
  }, []);

  const handleMagicAnalyze = async () => {
    if (!rawText.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeDreamRaw(rawText);
    if (result) {
        setAnalyzedData(result);
        setIsGeneratingImage(true);
        const img = await generateDreamImage(result.summary || rawText, selectedStyle);
        setGeneratedImage(img);
        setIsGeneratingImage(false);
    }
    setIsAnalyzing(false);
  };

  const regenerateImage = async () => {
      if (!analyzedData) return;
      setIsGeneratingImage(true);
      const img = await generateDreamImage(analyzedData.summary || rawText, selectedStyle);
      setGeneratedImage(img);
      setIsGeneratingImage(false);
  }

  const saveDream = () => {
    if (!analyzedData) return;

    const newDream: DreamEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      originalText: rawText,
      title: analyzedData.title || 'Sonho Sem Título',
      summary: analyzedData.summary || rawText,
      emotions: analyzedData.emotions || [],
      symbols: analyzedData.symbols || [],
      characters: analyzedData.characters || [],
      places: analyzedData.places || [],
      analysis: analyzedData.analysis,
      isNightmare: analyzedData.isNightmare,
      imageUrl: generatedImage || undefined,
      imageStyle: selectedStyle,
      socialCaption: analyzedData.socialCaption
    };

    const updatedDreams = [newDream, ...dreams];
    setDreams(updatedDreams);
    localStorage.setItem('oniromante_dreams', JSON.stringify(updatedDreams));
    
    // Reset
    setIsAdding(false);
    setRawText('');
    setAnalyzedData(null);
    setGeneratedImage(null);
  };

  const deleteDream = (id: string) => {
    const updatedDreams = dreams.filter(d => d.id !== id);
    setDreams(updatedDreams);
    localStorage.setItem('oniromante_dreams', JSON.stringify(updatedDreams));
  };

  const handleShare = (dream: DreamEntry) => {
    const text = dream.socialCaption || `🌙 Tive um sonho: "${dream.title}"\n✨ Tema: ${dream.analysis?.dailyTheme}\n🔮 Oniromante AI`;
    navigator.clipboard.writeText(text);
    alert("Legenda copiada!");
  }

  if (isAdding) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 pb-24 md:pb-6 animate-fade-in">
        <header className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <WandIcon className="text-indigo-400" /> Registro Mágico
            </h2>
            <button onClick={() => setIsAdding(false)} className="text-sm text-mystic-400 hover:text-white">
                Cancelar
            </button>
        </header>

        <div className="glass-panel p-6 rounded-2xl space-y-4">
            {!analyzedData ? (
                <>
                    <div>
                        <label className="block text-lg font-medium text-mystic-100 mb-2">Conte-me seu sonho...</label>
                        <textarea 
                            value={rawText}
                            onChange={e => setRawText(e.target.value)}
                            className="w-full bg-mystic-900/50 border border-mystic-600 rounded-lg p-4 text-white focus:outline-none focus:border-indigo-400 h-64 resize-none leading-relaxed"
                            placeholder="Descreva detalhes, cores, sentimentos..."
                        />
                    </div>
                    
                    <div className="flex items-center gap-4 py-2 overflow-x-auto">
                        <span className="text-sm text-mystic-400 whitespace-nowrap"><PaletteIcon className="inline w-4 h-4 mb-1"/> Estilo da Arte:</span>
                        {(['surreal', 'fantasy', 'watercolor', 'cyberpunk', 'minimalist'] as ArtStyle[]).map(style => (
                            <button 
                                key={style}
                                onClick={() => setSelectedStyle(style)}
                                className={`px-3 py-1 rounded-full text-xs capitalize border transition-all ${selectedStyle === style ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-white/10 text-mystic-400 hover:bg-white/5'}`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            onClick={handleMagicAnalyze}
                            disabled={!rawText.trim() || isAnalyzing}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isAnalyzing ? (
                                <><SparklesIcon className="animate-spin" /> Interpretando...</>
                            ) : (
                                <><WandIcon /> Interpretar & Visualizar</>
                            )}
                        </button>
                    </div>
                </>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col md:flex-row gap-6">
                         {/* Visual Representation */}
                         <div className="w-full md:w-1/3 space-y-2">
                            <div className="aspect-square rounded-xl bg-mystic-900 overflow-hidden relative border border-mystic-700 shadow-xl group">
                                {isGeneratingImage ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-mystic-400">
                                        <SparklesIcon className="w-8 h-8 animate-spin mb-2 text-indigo-400" />
                                        <span className="text-xs">Pintando ({selectedStyle})...</span>
                                    </div>
                                ) : generatedImage ? (
                                    <img src={generatedImage} alt="Dream visualization" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-mystic-500 text-xs">Sem imagem</div>
                                )}
                            </div>
                            <div className="flex justify-center gap-2">
                                <button onClick={regenerateImage} className="text-xs text-indigo-300 hover:text-white flex items-center gap-1"><PaletteIcon className="w-3 h-3"/> Mudar Estilo</button>
                            </div>
                         </div>

                         {/* Data Fields */}
                         <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-white">{analyzedData.title}</h3>
                                <span className="text-xs font-mono text-purple-300 border border-purple-500/30 px-2 py-1 rounded bg-purple-500/10 uppercase tracking-widest">{analyzedData.analysis?.dailyTheme}</span>
                            </div>
                            
                            <p className="text-sm text-mystic-100 leading-relaxed bg-mystic-900/30 p-4 rounded-xl border border-white/5">{analyzedData.summary}</p>

                            {/* Enhanced Emotional Analysis */}
                            <div className="bg-mystic-900/30 p-4 rounded-xl border border-white/5">
                                <h4 className="text-xs font-bold text-pink-300 uppercase mb-3 flex items-center gap-2"><SmileIcon className="w-3 h-3"/> Análise Emocional</h4>
                                <div className="space-y-2">
                                    {analyzedData.analysis?.emotionsList?.map((emo, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <span className="w-20 font-medium text-pink-100 capitalize">{emo.name}</span>
                                            <div className="flex-1 h-2 bg-mystic-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-pink-600 to-purple-500" style={{ width: `${emo.intensity * 10}%` }}></div>
                                            </div>
                                            <span className="text-xs text-mystic-400 w-6">{emo.intensity}</span>
                                        </div>
                                    ))}
                                </div>
                                {analyzedData.analysis?.emotionalBalanceTip && (
                                    <p className="mt-3 text-xs text-pink-200 italic border-l-2 border-pink-500 pl-2">
                                        💡 {analyzedData.analysis.emotionalBalanceTip}
                                    </p>
                                )}
                            </div>
                         </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-white/10">
                         <button onClick={() => setAnalyzedData(null)} className="text-sm text-mystic-400 hover:text-white">
                             Voltar e Editar
                         </button>
                         <button 
                            onClick={saveDream}
                            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-green-500/20"
                        >
                            Salvar no Diário
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-24 md:pb-6">
      <header className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <BookHeartIcon className="text-pink-400" /> 
            <span>Diário de Sonhos</span>
            </h1>
            <p className="text-mystic-200">Seu arquivo akáshico pessoal.</p>
        </div>
        <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
            <PlusIcon className="w-5 h-5" /> <span className="hidden md:inline">Novo Sonho</span>
        </button>
      </header>

      <div className="grid gap-8">
        {dreams.length === 0 ? (
            <div className="text-center py-16 text-mystic-400 glass-panel rounded-2xl border-dashed border-2 border-mystic-700">
                <BookHeartIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum sonho registrado ainda.</p>
                <button onClick={() => setIsAdding(true)} className="text-indigo-400 hover:text-indigo-300 mt-2 underline">
                    Usar a Magia do Sonho
                </button>
            </div>
        ) : (
            dreams.map(dream => (
                <div key={dream.id} className="glass-panel rounded-2xl overflow-hidden group hover:border-indigo-500/30 transition-all">
                    <div className="relative h-32 md:h-48 bg-mystic-900 overflow-hidden">
                        {dream.imageUrl && (
                            <img src={dream.imageUrl} alt={dream.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-mystic-900 to-transparent flex flex-col justify-end p-6">
                             <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-xs font-mono text-indigo-300 bg-black/40 backdrop-blur px-2 py-1 rounded mb-2 inline-block border border-white/10">
                                        {new Date(dream.date).toLocaleDateString()}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white shadow-black drop-shadow-lg">{dream.title}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleShare(dream)} className="p-2 bg-black/40 backdrop-blur rounded-lg text-white hover:bg-white/20 transition-colors" title="Copiar Legenda">
                                        <ShareIcon className="w-4 h-4" />
                                    </button>
                                     <button onClick={() => deleteDream(dream.id)} className="p-2 bg-black/40 backdrop-blur rounded-lg text-red-400 hover:bg-red-900/50 transition-colors" title="Excluir">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {dream.analysis?.dailyTheme && (
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                                    {dream.analysis.dailyTheme}
                                </span>
                            )}
                        </div>
                        
                        <p className="text-mystic-100 leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
                            {dream.summary}
                        </p>
                        
                        <div className="flex justify-end pt-2">
                            <button 
                                onClick={() => onAnalyzeDream(dream)}
                                className="text-sm flex items-center gap-2 text-indigo-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-500/20"
                            >
                                <BrainCircuitIcon className="w-4 h-4" /> Mentor dos Sonhos
                            </button>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default DreamJournal;
