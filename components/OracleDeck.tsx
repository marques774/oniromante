import React, { useState } from 'react';
import { CardsIcon, SparklesIcon } from './Icons';

const OracleDeck: React.FC = () => {
    const [flipped, setFlipped] = useState(false);
    
    // Simple mocked Oracle for demo purposes, in a real app could use Gemini to generate infinite cards
    const card = {
        title: "O Espelho Nebuloso",
        meaning: "O que você recusa ver em si mesmo está se manifestando nos outros. Hoje é um dia para auto-análise honesta e retirada de máscaras.",
        action: "Passe 5 minutos em silêncio observando seus pensamentos sem julgamento.",
        element: "Água"
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 pb-24 md:pb-6 animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <CardsIcon className="text-purple-400" /> 
                <span>Oráculo Onírico</span>
                </h1>
                <p className="text-mystic-200">Uma carta para guiar sua vigília.</p>
            </header>

            <div 
                className="perspective-1000 w-64 h-96 cursor-pointer group"
                onClick={() => setFlipped(!flipped)}
            >
                <div className={`relative w-full h-full text-center transition-transform duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
                    {/* Front (Back of Card) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-indigo-500/30 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
                        <div className="p-6 border-2 border-white/10 rounded-xl w-[90%] h-[90%] flex flex-col items-center justify-center bg-mystic-900/50 backdrop-blur-sm">
                            <SparklesIcon className="w-16 h-16 text-indigo-400 animate-pulse" />
                            <p className="mt-4 text-sm font-bold tracking-widest text-indigo-200 uppercase">Toque para Revelar</p>
                        </div>
                    </div>

                    {/* Back (Front of Card) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-white text-mystic-900 flex flex-col items-center justify-between p-6 shadow-[0_0_50px_rgba(139,92,246,0.3)] overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                         
                         <div className="mt-4">
                             <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">{card.element}</span>
                             <h2 className="text-2xl font-bold text-mystic-900 mt-2">{card.title}</h2>
                         </div>

                         <div className="text-sm leading-relaxed text-center font-medium text-mystic-800">
                             {card.meaning}
                         </div>

                         <div className="w-full bg-purple-50 p-3 rounded-lg text-center">
                             <p className="text-xs font-bold text-purple-700 uppercase mb-1">Ação</p>
                             <p className="text-xs text-purple-900">{card.action}</p>
                         </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
};

export default OracleDeck;
