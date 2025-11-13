import React from 'react';
import { LogoutIcon } from './icons/LogoutIcon';

type ActiveTab = 'register' | 'dashboard' | 'settings';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  occurrenceCount: number;
  onLogout: () => void;
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, count }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 text-sm md:text-base font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
      isActive
        ? 'bg-white/20 text-white'
        : 'text-emerald-100 hover:bg-white/10 hover:text-white'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {label}
    {count !== undefined && count > 0 && (
      <span className={`absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ring-2 ring-emerald-700 ${
        isActive ? 'bg-white text-emerald-700' : 'bg-emerald-500 text-white'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, occurrenceCount, onLogout }) => {
  return (
    <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Registro de Ocorrências Escolares
            </h1>
            <p className="text-xs md:text-sm text-emerald-200">
              Plataforma Inteligente de Gestão
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-800/50 p-1.5 rounded-lg flex items-center space-x-2">
              <TabButton 
                label="Registrar Ocorrência"
                isActive={activeTab === 'register'}
                onClick={() => setActiveTab('register')}
              />
               <TabButton 
                label="Painel & Histórico"
                isActive={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
                count={occurrenceCount}
              />
               <TabButton 
                label="Backup & Restauração"
                isActive={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
              />
            </div>
            <button
              onClick={onLogout}
              className="p-2.5 rounded-lg text-emerald-100 bg-emerald-800/50 hover:bg-white/10 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              aria-label="Sair da aplicação"
              title="Sair"
            >
              <LogoutIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
