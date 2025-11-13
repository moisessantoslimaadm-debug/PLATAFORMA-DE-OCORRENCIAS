import React, { useState, useMemo, useCallback } from 'react';
import { Occurrence, OccurrenceStatus } from '../types';
import Dashboard from './Dashboard';
import OccurrenceList from './OccurrenceList';
import { generateExcelReport, generatePdfReport, generateSingleOccurrencePdf } from '../utils/reportGenerator';
import { ReportOptions } from './ReportModal';

interface DashboardAndListProps {
  occurrences: Occurrence[];
  updateOccurrenceStatus: (id: string, status: OccurrenceStatus) => void;
  setDeletingOccurrenceId: (id: string | null) => void;
  setEditingOccurrence: (occurrence: Occurrence | null) => void;
  addToast: (message: string, type?: 'success' | 'error') => void;
}

const DashboardAndList: React.FC<DashboardAndListProps> = ({
  occurrences,
  updateOccurrenceStatus,
  setDeletingOccurrenceId,
  setEditingOccurrence,
  addToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOccurrences = useMemo(() => {
    if (!searchTerm.trim()) return occurrences;
    return occurrences.filter(occ => 
      occ.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [occurrences, searchTerm]);

  const handleGenerateCustomReport = useCallback((data: Occurrence[], options: ReportOptions) => {
    const { format, columns, groupBy } = options;
    if (columns.length === 0) {
      addToast('Selecione ao menos uma coluna para gerar o relatório.', 'error');
      return;
    }

    addToast(`Gerando relatório em ${format.toUpperCase()}...`);
    if (format === 'pdf') {
      generatePdfReport(data, columns, groupBy);
    } else {
      generateExcelReport(data, columns, groupBy);
    }
  }, [addToast]);

  const handleGenerateSinglePdf = useCallback((data: Occurrence) => {
    const validationError = generateSingleOccurrencePdf(data);
    if (validationError) {
      addToast(validationError, 'error');
    } else {
      addToast(`Ficha de ${data.student.fullName} gerada com sucesso!`);
    }
  }, [addToast]);
  
  return (
    <div className="space-y-8 animate-fade-in">
      <Dashboard occurrences={occurrences} />
      <OccurrenceList
        occurrences={filteredOccurrences}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onUpdateStatus={updateOccurrenceStatus}
        onDeleteRequest={setDeletingOccurrenceId}
        onEditRequest={setEditingOccurrence}
        onGenerateReport={handleGenerateCustomReport}
        onGenerateSinglePdf={handleGenerateSinglePdf}
      />
    </div>
  );
};

export default DashboardAndList;
