import React, { useState, useRef, useEffect } from 'react';
import { useSendMessageMutation, useGetHistoryQuery } from '../api/aiApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { Layout } from '../../../components/layout/Layout';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AiAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: 'Hello! I am Nexus AI. I can help you analyze supply chain data, write reports, or answer logistics queries. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: historyData, isLoading: isHistoryLoading } = useGetHistoryQuery(user?.id || 'demo-user-id', {
    skip: !user
  });
  
  useEffect(() => {
    if (historyData?.data && historyData.data.length > 0) {
      const historyMessages: Message[] = [];
      historyData.data.forEach((item: any) => {
        historyMessages.push({
          id: item._id + '_user',
          role: 'user',
          content: item.prompt,
          timestamp: new Date(item.createdAt)
        });
        historyMessages.push({
          id: item._id + '_ai',
          role: 'ai',
          content: item.response,
          timestamp: new Date(item.createdAt)
        });
      });
      setMessages([
        {
          id: 'welcome',
          role: 'ai',
          content: 'Hello! I am Nexus AI. I can help you analyze supply chain data, write reports, or answer logistics queries. How can I assist you today?',
          timestamp: new Date()
        },
        ...historyMessages
      ]);
    }
  }, [historyData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendMessage({ 
        userId: user?.id || 'demo-user-id', 
        message: userMessage.content 
      }).unwrap();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Failed to send message', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Sorry, I encountered an error communicating with the server. Please ensure Ollama is running locally.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Layout pageTitle="AI Assistant">
      <div className="flex h-[calc(100vh-4rem)] bg-background text-on-surface">
        
        {/* History Sidebar */}
        <div className="w-64 border-r border-border-subtle bg-surface-container-lowest flex flex-col hidden md:flex">
          <div className="p-4 border-b border-border-subtle">
            <h3 className="font-title-md text-on-surface">Query History</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isHistoryLoading ? (
              <div className="p-4 text-center text-on-surface-variant font-body-sm">Loading history...</div>
            ) : historyData?.data && historyData.data.length > 0 ? (
              [...historyData.data].reverse().map((item: any) => (
                <button 
                  key={item._id}
                  className="w-full text-left p-3 hover:bg-surface-variant rounded-lg transition-colors group"
                >
                  <p className="font-body-sm text-on-surface truncate group-hover:text-primary transition-colors">
                    {item.prompt}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-on-surface-variant font-body-sm">No recent queries.</div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-secondary-container text-on-secondary-container'}`}>
                {msg.role === 'user' ? (
                  <span className="material-symbols-outlined text-xl">person</span>
                ) : (
                  <span className="material-symbols-outlined text-xl">smart_toy</span>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-6 py-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-surface-container-highest text-on-surface rounded-tl-sm'} shadow-sm`}>
                  <p className="font-body-md whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[10px] text-on-surface-variant mt-1 px-1 font-label-md">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4 max-w-3xl flex-row">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-secondary-container text-on-secondary-container">
                <span className="material-symbols-outlined text-xl animate-spin">refresh</span>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-surface-container-highest text-on-surface rounded-tl-sm flex items-center gap-1 shadow-sm">
                <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border-subtle bg-surface-glass backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-surface-container-low rounded-2xl border border-border-subtle p-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
            <textarea
              className="flex-1 max-h-48 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none py-3 px-4 font-body-md text-on-surface placeholder:text-outline-variant scrollbar-hide"
              placeholder="Ask Nexus AI about shipments, inventory, or reports..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={input.split('\n').length > 1 ? Math.min(input.split('\n').length, 5) : 1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-11 w-11 flex-shrink-0 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-0.5 mr-0.5"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-on-surface-variant font-label-md">Nexus AI may produce inaccurate information about real-world entities. Verify important data.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</Layout>
  );
};
