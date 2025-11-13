import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Occurrence, OccurrenceStatus, Toast as ToastType } from './types';
import Header from './components/Header';
import OccurrenceForm from './components/OccurrenceForm';
import OccurrenceList from './components/OccurrenceList';
import Dashboard from './components/Dashboard';
import EditOccurrenceModal from './components/EditOccurrenceModal';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';
import { generateExcelReport, generatePdfReport, generateSingleOccurrencePdf } from './utils/reportGenerator';
import { seedOccurrences } from './utils/seedData';

const App: React.FC = () => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>(() => {
    try {
      const savedOccurrences = localStorage.getItem('occurrences_school');
      if (savedOccurrences) {
        return JSON.parse(savedOccurrences);
      }
      return seedOccurrences; // Load seed data if localStorage is empty
    } catch (error) {
      console.error("Failed to load occurrences from localStorage", error);
      return seedOccurrences; // Fallback to seed data on error
    }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOccurrence, setEditingOccurrence] = useState<Occurrence | null>(null);
  const [deletingOccurrenceId, setDeletingOccurrenceId] = useState<string | null>(null);
  const [dataToRestore, setDataToRestore] = useState<Occurrence[] | null>(null);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('occurrences_school', JSON.stringify(occurrences));
    } catch (error) {
      console.error("Failed to save occurrences to localStorage", error);
    }
  }, [occurrences]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const addOccurrence = useCallback((occurrence: Omit<Occurrence, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newOccurrence: Occurrence = {
      ...occurrence,
      id: `OCC-${Date.now()}`,
      status: OccurrenceStatus.OPEN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOccurrences(prev => [newOccurrence, ...prev]);
    addToast('Ocorrência registrada com sucesso!');
  }, [addToast]);

  const updateOccurrence = useCallback((updatedOccurrence: Occurrence) => {
    setOccurrences(prev =>
      prev.map(occ =>
        occ.id === updatedOccurrence.id 
          ? { ...updatedOccurrence, updatedAt: new Date().toISOString() } 
          : occ
      )
    );
    setEditingOccurrence(null);
    addToast('Ocorrência atualizada com sucesso!');
  }, [addToast]);


  const updateOccurrenceStatus = useCallback((id: string, status: OccurrenceStatus) => {
    setOccurrences(prev =>
      prev.map(occ =>
        occ.id === id ? { ...occ, status, updatedAt: new Date().toISOString() } : occ
      )
    );
  }, []);

  const confirmDeleteOccurrence = useCallback(() => {
    if (deletingOccurrenceId) {
      setOccurrences(prev => prev.filter(occ => occ.id !== deletingOccurrenceId));
      setDeletingOccurrenceId(null);
      addToast('Ocorrência excluída com sucesso!');
    }
  }, [deletingOccurrenceId, addToast]);

  const filteredOccurrences = useMemo(() => {
    return occurrences.filter(occ => 
      occ.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [occurrences, searchTerm]);
  
  const handleGeneratePdfList = useCallback((data: Occurrence[]) => {
    addToast('Gerando lista em PDF...');
    generatePdfReport(data);
  }, [addToast]);

  const handleGenerateExcel = useCallback((data: Occurrence[]) => {
    addToast('Gerando relatório Excel...');
    generateExcelReport(data);
  }, [addToast]);

  const handleGenerateSinglePdf = useCallback((data: Occurrence) => {
    const validationError = generateSingleOccurrencePdf(data);
    if (validationError) {
      addToast(validationError, 'error');
    } else {
      addToast(`Ficha de ${data.student.fullName} gerada com sucesso!`);
    }
  }, [addToast]);

  // Backup and Restore Logic
  const handleBackup = useCallback(() => {
    try {
      const dataStr = JSON.stringify(occurrences, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.download = `backup_ocorrencias_${date}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      addToast('Backup criado com sucesso!');
    } catch (error) {
      console.error("Backup failed", error);
      addToast('Falha ao criar o backup.', 'error');
    }
  }, [occurrences, addToast]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("File content is not a string.");
        }
        const data = JSON.parse(text);
        
        // Simple validation
        if (Array.isArray(data) && (data.length === 0 || (data[0].id && data[0].student))) {
          setDataToRestore(data);
        } else {
          throw new Error("Invalid backup file structure.");
        }
      } catch (error) {
        console.error("Restore failed", error);
        addToast('Arquivo de backup inválido ou corrompido.', 'error');
      } finally {
        // Reset file input to allow selecting the same file again
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }, [addToast]);
  
  const confirmRestore = useCallback(() => {
    if (dataToRestore) {
      setOccurrences(dataToRestore);
      setDataToRestore(null);
      addToast('Backup restaurado com sucesso!');
    }
  }, [dataToRestore, addToast]);


  return (
    <div className="min-h-screen bg-lime-50 font-sans">
      <Toast toasts={toasts} onClose={removeToast} />
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Dashboard occurrences={occurrences} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1">
            <OccurrenceForm 
              onSubmit={addOccurrence} 
            />
          </div>
          <div className="lg:col-span-2">
            <OccurrenceList
              occurrences={filteredOccurrences}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onUpdateStatus={updateOccurrenceStatus}
              onDeleteRequest={setDeletingOccurrenceId}
              onEditRequest={setEditingOccurrence}
              onGeneratePdfList={handleGeneratePdfList}
              onGenerateExcel={handleGenerateExcel}
              onGenerateSinglePdf={handleGenerateSinglePdf}
              onBackup={handleBackup}
              onRestoreRequest={handleFileSelect}
            />
          </div>
        </div>
      </main>
       <footer className="text-center p-4 text-sm text-lime-700">
        Plataforma de Gestão de Ocorrências Escolares © {new Date().getFullYear()} - Prefeitura Municipal de Itaberaba
      </footer>

      {editingOccurrence && (
        <EditOccurrenceModal
          isOpen={!!editingOccurrence}
          occurrence={editingOccurrence}
          onClose={() => setEditingOccurrence(null)}
          onSave={updateOccurrence}
        />
      )}

      {deletingOccurrenceId && (
        <ConfirmationModal
          isOpen={!!deletingOccurrenceId}
          title="Confirmar Exclusão"
          message="Você tem certeza que deseja excluir esta ocorrência? Esta ação não pode ser desfeita."
          onConfirm={confirmDeleteOccurrence}
          onClose={() => setDeletingOccurrenceId(null)}
        />
      )}

      {dataToRestore && (
         <ConfirmationModal
          isOpen={!!dataToRestore}
          title="Confirmar Restauração"
          message="Você tem certeza que deseja restaurar este backup? Todos os dados atuais serão substituídos. Esta ação não pode ser desfeita."
          onConfirm={confirmRestore}
          onClose={() => setDataToRestore(null)}
        />
      )}
    </div>
  );
};

export default App;