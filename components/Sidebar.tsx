
import React from 'react';
import { BookOpenIcon, DashboardIcon, UsersIcon, CogIcon, QuestionMarkCircleIcon } from './IconComponents';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive }) => (
  <a href="#" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
    isActive
      ? 'bg-brand-accent text-white shadow-lg'
      : 'text-text-secondary hover:bg-gray-light hover:text-text-primary'
  }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </a>
);

const Sidebar: React.FC = () => {
  return (
    <nav className="w-64 bg-gray-medium p-4 flex flex-col justify-between border-r border-gray-light">
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          <BookOpenIcon className="w-8 h-8 text-brand-accent" />
          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            Sales AI
          </h1>
        </div>
        <div className="space-y-2">
          <NavItem icon={<DashboardIcon className="w-5 h-5" />} label="Dashboard" isActive />
          <NavItem icon={<UsersIcon className="w-5 h-5" />} label="Leads" />
          <NavItem icon={<BookOpenIcon className="w-5 h-5" />} label="Accounts" />
        </div>
      </div>
      <div>
        <div className="space-y-2">
          <NavItem icon={<CogIcon className="w-5 h-5" />} label="Settings" />
          <NavItem icon={<QuestionMarkCircleIcon className="w-5 h-5" />} label="Help & Support" />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
