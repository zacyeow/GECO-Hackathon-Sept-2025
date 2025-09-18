
import React from 'react';
import { BookOpenIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-medium p-4 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex items-center gap-3">
        <BookOpenIcon className="w-8 h-8 text-brand-accent" />
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Publisher's Sales AI Assistant
        </h1>
      </div>
    </header>
  );
};

export default Header;
