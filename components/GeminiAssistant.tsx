'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hi! I am your AI travel planner. Ask me about destinations or tips!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!input.trim() || !apiKey) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = 'gemini-3-flash-preview'; 
      
      const response = await ai.models.generateContent({
        model,
        contents: [
            { role: 'user', parts: [{ text: `System: You are a helpful travel assistant for AloTrips.me. Keep answers brief (under 50 words) and exciting. User: ${userMsg}` }] }
        ]
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I couldn't generate a response." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to the travel grid." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl shadow-orange-300/40 transition-all hover:scale-110 z-50 flex items-center gap-2 group animate-bounce-slow"
      >
        <Sparkles size={20} className="animate-pulse" />
        <span className="font-bold tracking-wide hidden md:inline group-hover:inline transition-all">AI Planner</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 ring-1 ring-black/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
             <Sparkles size={18} />
          </div>
          <span className="font-bold text-sm tracking-wide">Gemini Travel Agent</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 h-80 overflow-y-auto p-4 bg-gray-50/80 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-orange-500 text-white rounded-tr-sm' 
                : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in">
             <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-200"></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY) ? "Ask about Paris..." : "Missing API Key"}
          disabled={!(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY) || isLoading}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
        />
        <button 
          onClick={handleSend}
          disabled={!(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY) || isLoading}
          className="bg-orange-500 text-white p-2.5 rounded-full hover:bg-orange-600 disabled:opacity-50 transition-all hover:scale-105 shadow-md"
        >
          <Send size={18} className={isLoading ? "opacity-0" : ""} />
        </button>
      </div>
    </div>
  );
};

export default GeminiAssistant;
