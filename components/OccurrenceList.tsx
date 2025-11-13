import React, { useState, useRef } from 'react';
import { Occurrence, OccurrenceStatus } from '../types';
import OccurrenceItem from './OccurrenceItem';
import { SearchIcon } from './icons/SearchIcon';
import { BackupIcon } from './icons/BackupIcon';
import { RestoreIcon } from './icons/RestoreIcon';
import ReportModal, { ReportOptions } from './ReportModal';
import { DocumentReportIcon } from './icons/DocumentReportIcon';
import { CsvIcon } from './icons/CsvIcon';

interface OccurrenceListProps {
  occurrences: Occurrence[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onUpdateStatus: (id: string, status: OccurrenceStatus) => void;
  onDeleteRequest: (id: string) => void;
  onEditRequest: (occurrence: Occurrence) => void;
  onGenerateReport: (data: Occurrence[], options: ReportOptions) => void;
  onGenerateSinglePdf: (data: Occurrence) => void;
  onBackup: () => void;
  onRestoreRequest: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const OccurrenceList: React.FC<OccurrenceListProps> = ({ 
  occurrences, 
  searchTerm,
  onSearchChange,
  onUpdateStatus, 
  onDeleteRequest,
  onEditRequest,
  onGenerateReport,
  onGenerateSinglePdf,
  onBackup,
  onRestoreRequest,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleGenerateReport = (options: ReportOptions) => {
    onGenerateReport(occurrences, options);
    setIsReportModalOpen(false);
  };

  return (
    <>
    <div className="space-y-4">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Nome do aluno..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-4 pr-4 py-2 bg-gray-700 text-gray-200 border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
        />
      </div>
      
      {/* Date filter placeholder */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <input type="text" placeholder="dd/mm/aaaa" onFocus={(e) => e.target.type='date'} onBlur={(e) => e.target.type='text'} className="w-full p-2 bg-gray-700 text-gray-200 border-gray-600 rounded-md placeholder-gray-400"/>
        <input type="text" placeholder="dd/mm/aaaa" onFocus={(e) => e.target.type='date'} onBlur={(e) => e.target.type='text'} className="w-full p-2 bg-gray-700 text-gray-200 border-gray-600 rounded-md placeholder-gray-400"/>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
         <button 
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-green-100 text-green-800 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
          aria-label="Exportar CSV"
          title="Exportar para CSV"
        >
          <CsvIcon className="h-4 w-4" />
          Exportar CSV
        </button>
        <button
          onClick={onBackup}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
          aria-label="Fazer Backup"
          title="Fazer Backup dos Dados (JSON)"
        >
          <BackupIcon className="h-4 w-4" />
          Backup (JSON)
        </button>
      </div>

       <button
        onClick={handleRestoreClick}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
        aria-label="Importar Backup"
        title="Importar a partir de um Backup (JSON)"
      >
        <RestoreIcon className="h-4 w-4" />
        Importar Backup (JSON)
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onRestoreRequest}
        accept=".json"
        className="hidden"
      />


      {occurrences.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhuma ocorrência encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3 pt-4 max-h-96 overflow-y-auto">
          {occurrences.map(occurrence => (
            <OccurrenceItem
              key={occurrence.id}
              occurrence={occurrence}
              onUpdateStatus={onUpdateStatus}
              onDeleteRequest={onDeleteRequest}
              onEditRequest={onEditRequest}
              onGenerateSinglePdf={onGenerateSinglePdf}
            />
          ))}
        </div>
      )}
    </div>
    <ReportModal
      isOpen={isReportModalOpen}
      onClose={() => setIsReportModalOpen(false)}
      onSubmit={handleGenerateReport}
    />
    </>
  );
};

export default OccurrenceList;