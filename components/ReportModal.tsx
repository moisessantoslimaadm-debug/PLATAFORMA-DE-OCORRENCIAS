import React, { useState } from 'react';
import { Button } from './Button';
import { CloseIcon } from './icons/CloseIcon';
import { REPORT_COLUMNS } from '../constants';
import { CheckboxInput } from './CheckboxInput';

export interface ReportOptions {
  format: 'pdf' | 'excel';
  columns: string[];
  groupBy: 'none' | 'status' | 'schoolUnit' | 'occurrenceDate' | 'mainType' | 'student.fullName';
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (options: ReportOptions) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(REPORT_COLUMNS.map(c => c.key));
  const [groupBy, setGroupBy] = useState<ReportOptions['groupBy']>('none');

  const handleFormatChange = (newFormat: 'pdf' | 'excel') => {
    setFormat(newFormat);
    if (newFormat === 'pdf' && groupBy === 'student.fullName') {
      setGroupBy('none'); // Reset if student grouping is not applicable for PDF
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedColumns(REPORT_COLUMNS.map(c => c.key));
    } else {
      setSelectedColumns([]);
    }
  };

  const handleColumnChange = (key: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns(prev => [...prev, key]);
    } else {
      setSelectedColumns(prev => prev.filter(k => k !== key));
    }
  };

  const handleSubmit = () => {
    onSubmit({ format, columns: selectedColumns, groupBy });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-green-800">Gerar Relatório Customizado</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Fechar modal">
            <CloseIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Format Selection */}
          <fieldset>
            <legend className="text-md font-semibold text-gray-800 mb-2">1. Escolha o Formato</legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 p-3 border rounded-md has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
                <input type="radio" name="format" value="pdf" checked={format === 'pdf'} onChange={() => handleFormatChange('pdf')} className="h-4 w-4 text-green-600 focus:ring-green-500"/>
                <span>PDF</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-md has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
                <input type="radio" name="format" value="excel" checked={format === 'excel'} onChange={() => handleFormatChange('excel')} className="h-4 w-4 text-green-600 focus:ring-green-500"/>
                <span>Excel</span>
              </label>
            </div>
          </fieldset>
          
          {/* Column Selection */}
          <fieldset>
            <legend className="text-md font-semibold text-gray-800 mb-2">2. Selecione as Colunas</legend>
            <div className="border rounded-md p-3">
              <CheckboxInput
                id="select-all"
                label="Selecionar Todas / Limpar Seleção"
                checked={selectedColumns.length === REPORT_COLUMNS.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <hr className="my-2"/>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2">
                {REPORT_COLUMNS.map(col => (
                  <CheckboxInput
                    key={col.key}
                    id={`col-${col.key}`}
                    label={col.label}
                    checked={selectedColumns.includes(col.key)}
                    onChange={(e) => handleColumnChange(col.key, e.target.checked)}
                  />
                ))}
              </div>
            </div>
          </fieldset>

          {/* Grouping Selection */}
          <fieldset>
            <legend className="text-md font-semibold text-gray-800 mb-2">3. Agrupar Dados Por (Opcional)</legend>
            <div className="flex flex-wrap gap-3">
               <label className="flex items-center gap-2 p-2 border rounded-md text-sm has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
                <input type="radio" name="groupBy" value="none" checked={groupBy === 'none'} onChange={() => setGroupBy('none')} className="h-4 w-4 text-green-600 focus:ring-green-500"/>
                <span>Sem Agrupamento</span>
              </label>
              <label className="flex items-center gap-2 p-2 border rounded-md text-sm has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
                <input type="radio" name="groupBy" value="status" checked={groupBy === 'status'} onChange={() => setGroupBy('status')} className="h-4 w-4 text-green-600 focus:ring-green-500"/>
                <span>Status</span>
              </label>
              <label className="flex items-center gap-2 p-2 border rounded-md text-sm has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
                <input type="radio" name="groupBy" value="schoolUnit" checked={groupBy === 'schoolUnit'} onChange={() => setGroupBy('schoolUnit')} className="h-4 w-4 text-green-600 focus:ring-green-500"/>
                <span>Unidade Escolar</span>
              </label>
              <label className="flex items-center gap-2 p-2 border rounded-md text-sm has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
                <input type="radio" name="groupBy" value="occurrenceDate" checked={groupBy === 'occurrenceDate'} onChange={() => setGroupBy('occurrenceDate')} className="h-4 w-4 text-green-600 focus:ring-green-500"/>
                <span>Data da Ocorrência</span>
              </label>
               <label className="flex items-center gap-2 p-2 border rounded-md text-sm has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
                <input type="radio" name="groupBy" value="mainType" checked={groupBy === 'mainType'} onChange={() => setGroupBy('mainType')} className="h-4 w-4 text-green-600 focus:ring-green-500"/>
                <span>Tipo Principal</span>
              </label>
              {format === 'excel' && (
                <label className="flex items-center gap-2 p-2 border rounded-md text-sm has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
                  <input type="radio" name="groupBy" value="student.fullName" checked={groupBy === 'student.fullName'} onChange={() => setGroupBy('student.fullName')} className="h-4 w-4 text-green-600 focus:ring-green-500"/>
                  <span>Aluno (Aba Individual)</span>
                </label>
              )}
            </div>
          </fieldset>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
            Cancelar
          </button>
          <Button onClick={handleSubmit}>Gerar Relatório</Button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;