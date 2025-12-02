import React from 'react';
import { HomeIcon, MessageCircleIcon, BookHeartIcon, ChartIcon, CardsIcon, BookOpenIcon } from './Icons';

interface NavigationProps {
  currentTab: 'dashboard' | 'chat' | 'journal' | 'stats' | 'oracle' | 'grimoire';
  onTabChange: (tab: 'dashboard' | 'chat' | 'journal' | 'stats' | 'oracle' | 'grimoire') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-mystic-900/90 backdrop-blur-lg border-t border-white/5 md:hidden z-50 safe-area-bottom overflow-x-auto">
        <div className="flex justify-between items-center p-2 min-w-max px-4 gap-4">
          <button onClick={() => onTabChange('dashboard')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentTab === 'dashboard' ? 'text-indigo-400' : 'text-mystic-400'}`}>
            <HomeIcon className={currentTab === 'dashboard' ? 'fill-current opacity-20' : ''} />
            <span className="text-[10px] font-medium mt-1">Início</span>
          </button>
          
          <button onClick={() => onTabChange('journal')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentTab === 'journal' ? 'text-indigo-400' : 'text-mystic-400'}`}>
            <BookHeartIcon className={currentTab === 'journal' ? 'fill-current opacity-20' : ''} />
            <span className="text-[10px] font-medium mt-1">Diário</span>
          </button>

          <button onClick={() => onTabChange('stats')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentTab === 'stats' ? 'text-indigo-400' : 'text-mystic-400'}`}>
            <ChartIcon className={currentTab === 'stats' ? 'fill-current opacity-20' : ''} />
            <span className="text-[10px] font-medium mt-1">Padrões</span>
          </button>

          <button onClick={() => onTabChange('oracle')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentTab === 'oracle' ? 'text-indigo-400' : 'text-mystic-400'}`}>
            <CardsIcon className={currentTab === 'oracle' ? 'fill-current opacity-20' : ''} />
            <span className="text-[10px] font-medium mt-1">Oráculo</span>
          </button>

          <button onClick={() => onTabChange('grimoire')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentTab === 'grimoire' ? 'text-indigo-400' : 'text-mystic-400'}`}>
            <BookOpenIcon className={currentTab === 'grimoire' ? 'fill-current opacity-20' : ''} />
            <span className="text-[10px] font-medium mt-1">Grimório</span>
          </button>

          <button onClick={() => onTabChange('chat')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentTab === 'chat' ? 'text-indigo-400' : 'text-mystic-400'}`}>
            <MessageCircleIcon className={currentTab === 'chat' ? 'fill-current opacity-20' : ''} />
            <span className="text-[10px] font-medium mt-1">Chat</span>
          </button>
        </div>
      </div>

      <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-mystic-900 border-r border-white/5 p-6 z-50">
        <div className="mb-10 pl-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Oniromante
            </h1>
        </div>
        
        <div className="space-y-2">
            <button onClick={() => onTabChange('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${currentTab === 'dashboard' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'text-mystic-300 hover:bg-white/5'}`}>
                <HomeIcon /> <span className="font-medium">Painel Diário</span>
            </button>
            <button onClick={() => onTabChange('journal')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${currentTab === 'journal' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'text-mystic-300 hover:bg-white/5'}`}>
                <BookHeartIcon /> <span className="font-medium">Diário de Sonhos</span>
            </button>
            <button onClick={() => onTabChange('stats')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${currentTab === 'stats' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'text-mystic-300 hover:bg-white/5'}`}>
                <ChartIcon /> <span className="font-medium">Padrões & Stats</span>
            </button>
            <button onClick={() => onTabChange('oracle')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${currentTab === 'oracle' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'text-mystic-300 hover:bg-white/5'}`}>
                <CardsIcon /> <span className="font-medium">Oráculo</span>
            </button>
            <button onClick={() => onTabChange('grimoire')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${currentTab === 'grimoire' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'text-mystic-300 hover:bg-white/5'}`}>
                <BookOpenIcon /> <span className="font-medium">Grimório</span>
            </button>
            <button onClick={() => onTabChange('chat')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${currentTab === 'chat' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'text-mystic-300 hover:bg-white/5'}`}>
                <MessageCircleIcon /> <span className="font-medium">Mentor IA</span>
            </button>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
            <p className="text-xs text-mystic-500 text-center">
                Powered by Gemini 3 Pro
            </p>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
