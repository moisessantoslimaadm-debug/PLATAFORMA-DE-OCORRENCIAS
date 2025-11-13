import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-lime-800 text-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Ficha de Registro de Ocorrência Escolar
          </h1>
          <p className="text-sm md:text-md text-lime-200">
            Registro Digital de Situações Críticas
          </p>
        </div>
         <div className="mt-2 md:mt-0">
          <span className="text-xl font-semibold">ANO 2025</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
