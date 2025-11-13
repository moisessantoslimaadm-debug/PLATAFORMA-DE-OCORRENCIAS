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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredOccurrences = useMemo(() => {
    return occurrences
      .filter(occ => {
        if (!searchTerm.trim()) return true;
        return (
          occ.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          occ.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
          occ.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .filter(occ => {
        if (!startDate) return true;
        // String comparison works for YYYY-MM-DD format and avoids timezone issues
        return occ.occurrenceDate >= startDate;
      })
      .filter(occ => {
        if (!endDate) return true;
        return occ.occurrenceDate <= endDate;
      });
  }, [occurrences, searchTerm, startDate, endDate]);

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
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
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