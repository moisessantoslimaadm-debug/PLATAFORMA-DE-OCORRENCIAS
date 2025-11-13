import React, { useState, useRef } from 'react';
import { Occurrence, OccurrenceStatus } from '../types';
import OccurrenceItem from './OccurrenceItem';
import { SearchIcon } from './icons/SearchIcon';
import { PdfIcon } from './icons/PdfIcon';
import { ExcelIcon } from './icons/ExcelIcon';
import { BackupIcon } from './icons/BackupIcon';
import { RestoreIcon } from './icons/RestoreIcon';

interface OccurrenceListProps {
  occurrences: Occurrence[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onUpdateStatus: (id: string, status: OccurrenceStatus) => void;
  onDeleteRequest: (id: string) => void;
  onEditRequest: (occurrence: Occurrence) => void;
  onGeneratePdfList: (data: Occurrence[]) => void;
  onGenerateExcel: (data: Occurrence[]) => void;
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
  onGeneratePdfList,
  onGenerateExcel,
  onGenerateSinglePdf,
  onBackup,
  onRestoreRequest,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredByStatusOccurrences = occurrences.filter(occ => {
    if (statusFilter === 'all') return true;
    return occ.status === statusFilter;
  });

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-lime-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-lime-800 whitespace-nowrap">Histórico de Fichas</h2>
        <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar por aluno ou ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={() => onGeneratePdfList(filteredByStatusOccurrences)}
              className="flex items-center gap-2 py-2 px-3 border border-red-200 bg-red-50 text-red-700 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
              aria-label="Gerar lista em PDF"
            >
              <PdfIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onGenerateExcel(filteredByStatusOccurrences)}
              className="flex items-center gap-2 py-2 px-3 border border-green-200 bg-green-50 text-green-700 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
              aria-label="Gerar relatório em Excel"
            >
              <ExcelIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onBackup}
              className="flex items-center gap-2 py-2 px-3 border border-blue-200 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
              aria-label="Fazer Backup"
            >
              <BackupIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleRestoreClick}
              className="flex items-center gap-2 py-2 px-3 border border-gray-200 bg-gray-50 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              aria-label="Restaurar Backup"
            >
              <RestoreIcon className="h-5 w-5" />
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
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
            <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 text-sm rounded-full transition-colors ${statusFilter === 'all' ? 'bg-lime-700 text-white font-semibold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Todas</button>
            {Object.values(OccurrenceStatus).map(status => (
                 <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1 text-sm rounded-full transition-colors ${statusFilter === status ? 'bg-lime-700 text-white font-semibold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{status}</button>
            ))}
        </div>
      </div>

      {filteredByStatusOccurrences.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhuma ocorrência encontrada para os filtros aplicados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredByStatusOccurrences.map(occurrence => (
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
  );
};

export default OccurrenceList;