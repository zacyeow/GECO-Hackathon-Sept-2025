import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon } from './IconComponents';
import Spinner from './Spinner';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose, messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-gray-medium rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-light">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-brand-accent" />
            <h2 className="text-xl font-bold text-text-primary">AI Assistant</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-light">
            <XMarkIcon className="w-6 h-6 text-text-secondary" />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-accent text-white' : 'bg-gray-light text-text-secondary'}`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-md p-3 rounded-lg bg-gray-light text-text-secondary">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <footer className="p-4 border-t border-gray-light">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Which lead is interested in AI?"
              className="flex-1 bg-gray-dark border border-gray-light rounded-lg py-2 px-4 text-text-primary placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-accent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-brand-accent text-white p-2.5 rounded-lg disabled:bg-gray-light disabled:cursor-not-allowed hover:bg-brand-primary transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatbotModal;
