import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, ChevronLeft } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Udhyog Saathi. Your Ai Business assistant. How can I help with your  data today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/ai/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Uses your JWT
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      {/* Header - White & Blue Theme with Back Key */}
      <div className="bg-white border-b border-gray-200 p-4 text-blue-600 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          {/* Back Key - navigates back in browser history */}
          <button 
            onClick={() => window.history.back()} 
            className="p-2 hover:bg-blue-50 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
               <Bot size={22} className="text-white" />
            </div>
            <div>
             <h2 className="font-bold text-lg">Saathi AI</h2>
              <p className="text-[10px] text-blue-500 font-bold uppercase">AI Business Agent </p>
            </div>
          </div>
        </div>
        <div className="hidden md:block text-xs text-gray-400 font-medium">Secure Financial Analysis</div>
      </div>

      {/* Message Container - Expanded */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-blue-100 text-blue-600'}`}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-center gap-3 text-blue-500 text-sm font-medium animate-pulse">
              <div className="p-2 bg-white rounded-xl border border-blue-50">
                <Loader2 size={16} className="animate-spin" />
              </div>
              Calculating your wholesale metrics...
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area - Centered and Styled Blue */}
      <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)]">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Analyze revenue, tax summary, or top products..."
            className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-blue-100 flex items-center gap-2"
          >
            <span className="hidden md:inline font-semibold">Send</span>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;