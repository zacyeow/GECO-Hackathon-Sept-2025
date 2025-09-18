import React from 'react';
import { SparklesIcon } from './IconComponents';

interface DiscoveryBarProps {
  onOpenChat: () => void;
}

const DiscoveryBar: React.FC<DiscoveryBarProps> = ({ onOpenChat }) => {
  return (
    <div className="bg-gray-medium rounded-lg p-3">
        <button
            onClick={onOpenChat}
            className="w-full text-left bg-gray-dark hover:bg-gray-light transition-colors duration-200 text-text-secondary placeholder-text-secondary px-4 py-2 rounded-lg flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
            <SparklesIcon className="w-5 h-5 text-brand-accent"/>
            <span>Ask AI Assistant... (e.g., "Which leads are interested in Chemistry?")</span>
        </button>
    </div>
  );
};

export default DiscoveryBar;
