import React, { useRef } from 'react';
import { BackupIcon } from './icons/BackupIcon';
import { RestoreIcon } from './icons/RestoreIcon';

interface SettingsProps {
  onBackup: () => void;
  onRestoreRequest: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Settings: React.FC<SettingsProps> = ({ onBackup, onRestoreRequest }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
          Backup e Restauração
        </h1>
        <p className="text-md text-gray-500 mt-1">
          Gerencie os dados da aplicação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Card */}
        <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-4">
                <BackupIcon className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Criar Backup</h2>
            <p className="text-sm text-gray-500 mt-2 mb-4">
                Salve todos os registros de ocorrências atuais em um arquivo JSON. Guarde este arquivo em um local seguro.
            </p>
            <button
                onClick={onBackup}
                className="w-full max-w-xs flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                aria-label="Fazer Backup"
            >
                <BackupIcon className="h-5 w-5" />
                Fazer Backup
            </button>
        </div>

        {/* Restore Card */}
         <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4">
                <RestoreIcon className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Restaurar Backup</h2>
            <p className="text-sm text-gray-500 mt-2 mb-4">
                Importe um arquivo de backup JSON. <strong className="text-red-600">Atenção:</strong> Isso substituirá todos os dados existentes.
            </p>
            <button
                onClick={handleRestoreClick}
                className="w-full max-w-xs flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                aria-label="Importar Backup"
            >
                <RestoreIcon className="h-5 w-5" />
                Importar Backup
            </button>
             <input
                type="file"
                ref={fileInputRef}
                onChange={onRestoreRequest}
                accept=".json"
                className="hidden"
            />
        </div>

      </div>
    </div>
  );
};

export default Settings;
