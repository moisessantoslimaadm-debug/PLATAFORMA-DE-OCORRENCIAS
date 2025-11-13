import React, { useState } from 'react';
import { Occurrence, OccurrenceStatus } from '../types';
import OccurrenceItem from './OccurrenceItem';
import ReportModal, { ReportOptions } from './ReportModal';
import { DocumentReportIcon } from './icons/DocumentReportIcon';

interface OccurrenceListProps {
  occurrences: Occurrence[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onUpdateStatus: (id: string, status: OccurrenceStatus) => void;
  onDeleteRequest: (id: string) => void;
  onEditRequest: (occurrence: Occurrence) => void;
  onGenerateReport: (data: Occurrence[], options: ReportOptions) => void;
  onGenerateSinglePdf: (data: Occurrence) => void;
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
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleGenerateReport = (options: ReportOptions) => {
    onGenerateReport(occurrences, options);
    setIsReportModalOpen(false);
  };

  return (
    <>
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
       <div className="md:flex justify-between items-center mb-4">
        <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                Histórico de Ocorrências
            </h3>
            <p className="text-sm text-gray-500">
                Visualize, edite e gerencie todas as fichas registradas.
            </p>
        </div>
        <button 
          onClick={() => setIsReportModalOpen(true)}
          className="mt-3 md:mt-0 flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
          aria-label="Gerar Relatório"
        >
          <DocumentReportIcon className="h-5 w-5" />
          Gerar Relatório
        </button>
       </div>


      <div className="mb-4">
        <input
          type="search"
          placeholder="Buscar por nome, ID ou descrição..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-4 pr-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"
        />
      </div>

      {occurrences.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma ocorrência encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">Comece registrando uma nova ocorrência na aba "Registrar".</p>
        </div>
      ) : (
        <div className="space-y-3 pt-4 max-h-[60vh] overflow-y-auto pr-2">
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
