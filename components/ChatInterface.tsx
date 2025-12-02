import React, { useState, useRef, useEffect } from 'react';
import { Message, UserStatus } from '../types';
import { createChatSession } from '../services/geminiService';
import { SendIcon, SparklesIcon, MoonIcon } from './Icons';
import { Chat, GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  userStatus: UserStatus;
  initialMessage?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userStatus, initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá. Sou o Oniromante. Conte-me seu sonho ou compartilhe o que pesa em seu coração. Estou aqui para ouvir e interpretar.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initialize chat session on mount
  useEffect(() => {
    const initChat = async () => {
      try {
        const chat = await createChatSession();
        chatSessionRef.current = chat;
        
        // Feed context about user status silently if available
        let contextMsg = "";
        if (userStatus.mood || userStatus.sleep || userStatus.sleepNotes) {
           contextMsg += `[Contexto do Sistema: O usuário está se sentindo "${userStatus.mood || 'não informado'}", sono: "${userStatus.sleep || 'não informado'}". Notas do sono: "${userStatus.sleepNotes || 'nenhuma'}". Use isso para calibrar sua empatia.]`;
        }
        
        if (contextMsg) {
             await chat.sendMessage({ message: contextMsg });
        }

        // Handle initial message (e.g. from Dream Journal)
        if (initialMessage && !hasInitialized.current) {
            hasInitialized.current = true; // Prevent double sending if effect re-runs
            setInputValue(initialMessage);
            // Optional: Auto-send could be done here, but usually better to let user review first or trigger via separate effect
            // For now, let's just put it in the input or simulate user typing.
            // Actually, let's auto-trigger if it comes from the Journal for better UX
            handleSendMessage(initialMessage, chat);
        }

      } catch (err) {
        console.error("Failed to init chat", err);
      }
    };
    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textOverride?: string, chatInstance?: Chat) => {
    const textToSend = textOverride || inputValue;
    const chat = chatInstance || chatSessionRef.current;

    if (!textToSend.trim() || !chat || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await chat.sendMessageStream({ message: userMsg.text });
      
      let fullText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      // Add placeholder message
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullText += text;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullText } : msg
        ));
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Sinto uma perturbação no éter. Não consegui compreender completamente. Tente novamente, por favor.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full">
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-lg ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'glass-panel text-mystic-50 rounded-tl-sm border-none'
              }`}
            >
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-xs text-indigo-300 font-bold uppercase tracking-widest">
                  <MoonIcon className="w-3 h-3" /> Oniromante
                </div>
              )}
              <div className="prose prose-invert prose-sm leading-relaxed">
                 <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
              <div className="glass-panel rounded-2xl p-4 flex items-center gap-2">
                 <SparklesIcon className="w-4 h-4 text-indigo-400 animate-spin" />
                 <span className="text-sm text-indigo-200">Consultando os astros...</span>
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-mystic-900/80 backdrop-blur-md border-t border-white/5">
        <div className="relative flex items-end gap-2 bg-mystic-800/50 rounded-xl p-2 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva seu sonho ou como se sente..."
            className="w-full bg-transparent text-white placeholder-mystic-400 p-2 resize-none focus:outline-none max-h-32 min-h-[44px]"
            rows={1}
            style={{ height: 'auto', minHeight: '44px' }} 
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-all shadow-lg hover:shadow-indigo-500/25"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;