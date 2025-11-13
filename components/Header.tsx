import React from 'react';

type ActiveTab = 'register' | 'dashboard' | 'settings';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm md:text-base font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
      isActive
        ? 'bg-white/20 text-white'
        : 'text-emerald-100 hover:bg-white/10 hover:text-white'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {label}
  </button>
);

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
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
            />
             <TabButton 
              label="Backup & Restauração"
              isActive={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
