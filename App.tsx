import React, { useState } from 'react';
import Navigation from './components/Navigation';
import DailyDashboard from './components/DailyDashboard';
import ChatInterface from './components/ChatInterface';
import DreamJournal from './components/DreamJournal';
import StatsPanel from './components/StatsPanel';
import OracleDeck from './components/OracleDeck';
import Grimoire from './components/Grimoire';
import NightMode from './components/NightMode';
import { UserStatus, DreamEntry } from './types';
import { MoonIcon, BellIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'chat' | 'journal' | 'stats' | 'oracle' | 'grimoire'>('dashboard');
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
  const [showNightMode, setShowNightMode] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const [userStatus, setUserStatus] = useState<UserStatus>(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`oniromante_status_${today}`);
    return saved ? JSON.parse(saved) : { date: today };
  });

  const handleUpdateStatus = (update: Partial<UserStatus>) => {
    setUserStatus(prev => {
      const newState = { ...prev, ...update };
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`oniromante_status_${today}`, JSON.stringify(newState));
      return newState;
    });
  };

  const handleAnalyzeDream = (dream: DreamEntry) => {
    const prompt = `Gostaria de conversar mais sobre este sonho: "${dream.title}". 
    
${dream.analysis ? `A interpretação automática sugeriu um significado ${dream.analysis.spiritual}, mas sinto que...` : ''}`;

    setChatInitialMessage(prompt);
    setCurrentTab('chat');
  };

  // Mock Notification logic
  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Floating Header Actions (Mobile/Desktop) */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-3">
          <button 
            onClick={() => triggerNotification()}
            className="p-2 bg-mystic-900/50 backdrop-blur rounded-full text-mystic-300 hover:text-white border border-white/5 hover:bg-white/10 transition-all"
            title="Notificações"
          >
              <BellIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowNightMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 backdrop-blur hover:bg-indigo-500 rounded-full text-white shadow-lg shadow-indigo-500/20 transition-all"
          >
              <MoonIcon className="w-4 h-4" /> <span className="hidden sm:inline font-medium">Energia da Noite</span>
          </button>
      </div>

      <main className="md:ml-64 relative z-10 h-screen overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {currentTab === 'dashboard' && (
            <div className="animate-fade-in">
              <DailyDashboard userStatus={userStatus} onUpdateStatus={handleUpdateStatus} />
            </div>
          )}
          {currentTab === 'journal' && (
            <div className="animate-fade-in">
              <DreamJournal onAnalyzeDream={handleAnalyzeDream} />
            </div>
          )}
           {currentTab === 'stats' && (
            <div className="animate-fade-in">
              <StatsPanel />
            </div>
          )}
           {currentTab === 'oracle' && (
            <div className="animate-fade-in">
              <OracleDeck />
            </div>
          )}
          {currentTab === 'grimoire' && (
            <div className="animate-fade-in">
              <Grimoire />
            </div>
          )}
          {currentTab === 'chat' && (
            <div className="h-full animate-fade-in">
              <ChatInterface key={chatInitialMessage ? 'analyzing' : 'chat'} userStatus={userStatus} initialMessage={chatInitialMessage} />
            </div>
          )}
        </div>
      </main>

      {/* Overlays */}
      {showNightMode && <NightMode mood={userStatus.mood || 'calma'} onClose={() => setShowNightMode(false)} />}
      
      {/* Toast Notification */}
      {showNotification && (
          <div className="fixed top-20 right-4 z-50 bg-mystic-800 border-l-4 border-indigo-500 text-white p-4 rounded shadow-2xl max-w-sm animate-fade-in">
              <p className="font-bold text-sm text-indigo-300 mb-1">Dica do Oniromante</p>
              <p className="text-sm">"Seu sonho com água indica renovação. Tente um banho relaxante hoje."</p>
          </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
