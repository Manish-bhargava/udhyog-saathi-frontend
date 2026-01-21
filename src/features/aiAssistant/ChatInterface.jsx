import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, Menu, X } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Udhyog Saathi. Your AI Business assistant. How can I help with your data today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.success === false) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const exampleQuestions = [
    "What's my total revenue this month?",
    "Who are my top 5 customers?",
    "Show me pending payments",
    "Compare sales by product"
  ];

  const handleExampleClick = (question) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Internal Header - Simplified since Dashboard has the main header */}
      <div className="bg-white border-b border-gray-100 p-3 md:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg">
             <Bot size={16} className="md:size-[20px] text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm md:text-base">Saathi AI</h2>
            <p className="text-[9px] md:text-[10px] text-blue-600 font-bold uppercase tracking-wider">Business Intelligence Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400 font-medium bg-gray-50 px-2 md:px-3 py-1 rounded-full hidden sm:block">
            Secure Analysis
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1 text-gray-500"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Example Questions - Hidden on mobile when menu is open */}
      {!mobileMenuOpen && (
        <div className="bg-blue-50 border-b border-blue-100 p-3 md:p-4">
          <p className="text-xs text-blue-700 mb-2 font-medium">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(q)}
                className="px-3 py-1.5 bg-white text-blue-600 text-xs rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
              >
                {q.length > 30 ? q.substring(0, 30) + '...' : q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Container - Independent scroll within the outlet */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex mb-4 md:mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-2 md:gap-3 max-w-[90%] md:max-w-[85%] lg:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-sm shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-blue-100 text-blue-600'}`}>
                  {msg.role === 'user' ? <User size={14} className="md:size-[16px]" /> : <Bot size={14} className="md:size-[16px]" />}
                </div>
                <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl text-sm md:text-[15px] leading-relaxed shadow-sm ${
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
            <div className="flex justify-start items-center gap-2 md:gap-3 text-blue-600 text-xs md:text-sm font-medium">
              <div className="p-1.5 md:p-2 bg-white rounded-lg md:rounded-xl border border-blue-50 shadow-sm">
                <Loader2 size={14} className="md:size-[16px] animate-spin" />
              </div>
              <span className="animate-pulse">Processing business data...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 p-3">
          <div className="space-y-2">
            <p className="text-xs text-blue-700 mb-2 font-medium">Quick Actions:</p>
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  handleExampleClick(q);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-3 py-2 bg-blue-50 text-blue-600 text-xs rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area - Fixed at bottom of the component */}
      <div className="p-3 md:p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2 md:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about revenue, taxes, or top products..."
            className="flex-1 p-2.5 md:p-3.5 bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs md:text-sm"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-5 rounded-lg md:rounded-xl transition-all disabled:opacity-50 flex items-center gap-1 md:gap-2 shadow-md shadow-blue-200"
          >
            <Send size={16} className="md:size-[18px]" />
            <span className="hidden md:inline font-semibold text-sm">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;