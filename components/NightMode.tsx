import React, { useState, useEffect } from 'react';
import { generateNightEnergy } from '../services/geminiService';
import { NightEnergy } from '../types';
import { MoonIcon, SparklesIcon } from './Icons';

interface NightModeProps {
    mood: string;
    onClose: () => void;
}

const NightMode: React.FC<NightModeProps> = ({ mood, onClose }) => {
    const [energy, setEnergy] = useState<NightEnergy | null>(null);
    const [step, setStep] = useState<'generating' | 'message' | 'breathing' | 'intention'>('generating');

    useEffect(() => {
        const loadEnergy = async () => {
            const data = await generateNightEnergy(mood);
            setEnergy(data);
            setStep('message');
        };
        loadEnergy();
    }, [mood]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#050510] text-white flex flex-col items-center justify-center p-8 animate-fade-in">
            {/* Background Stars Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                <div className="absolute top-[30%] right-[20%] w-1 h-1 bg-white rounded-full animate-pulse delay-75 shadow-[0_0_10px_white]"></div>
                <div className="absolute bottom-[20%] left-[40%] w-2 h-2 bg-blue-200 rounded-full animate-pulse delay-150 blur-sm"></div>
            </div>

            <button onClick={onClose} className="absolute top-6 right-6 text-mystic-400 hover:text-white transition-colors">
                ✕ Fechar
            </button>

            {step === 'generating' && (
                <div className="text-center space-y-4">
                    <MoonIcon className="w-16 h-16 mx-auto text-indigo-400 animate-bounce" />
                    <p className="text-xl text-indigo-200 animate-pulse">Sintonizando frequências noturnas...</p>
                </div>
            )}

            {energy && step === 'message' && (
                <div className="text-center max-w-lg space-y-8 animate-fade-in">
                    <MoonIcon className="w-12 h-12 mx-auto text-indigo-300" />
                    <h2 className="text-3xl font-light text-white leading-relaxed">{energy.message}</h2>
                    <button 
                        onClick={() => setStep('breathing')}
                        className="bg-indigo-600/50 hover:bg-indigo-600 px-8 py-3 rounded-full text-indigo-100 transition-all border border-indigo-400/30"
                    >
                        Iniciar Respiração
                    </button>
                </div>
            )}

            {energy && step === 'breathing' && (
                <div className="text-center max-w-lg space-y-12 animate-fade-in">
                    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping-slow"></div>
                        <div className="w-32 h-32 bg-indigo-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-indigo-400/20">
                            <span className="text-2xl font-light">Respire</span>
                        </div>
                    </div>
                    <p className="text-2xl font-light text-blue-200">{energy.breathing}</p>
                    <button 
                         onClick={() => setStep('intention')}
                         className="text-mystic-400 hover:text-white underline decoration-dashed underline-offset-4"
                    >
                        Próximo: Intenção
                    </button>
                </div>
            )}

             {energy && step === 'intention' && (
                <div className="text-center max-w-lg space-y-8 animate-fade-in">
                    <SparklesIcon className="w-12 h-12 mx-auto text-yellow-200" />
                    <div>
                        <p className="text-sm text-mystic-400 uppercase tracking-widest mb-4">Sua intenção para o sono</p>
                        <h2 className="text-2xl md:text-4xl font-serif text-white italic">"{energy.intention}"</h2>
                    </div>
                    <p className="text-mystic-300 text-sm">Repita mentalmente três vezes.</p>
                    <button 
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-full text-white transition-all"
                    >
                        Boa Noite 🌙
                    </button>
                </div>
            )}

            <style>{`
                @keyframes ping-slow {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.5); opacity: 0.2; }
                    100% { transform: scale(1); opacity: 0.5; }
                }
                .animate-ping-slow {
                    animation: ping-slow 8s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default NightMode;
