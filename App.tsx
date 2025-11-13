import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Occurrence, OccurrenceStatus, Toast as ToastType, AuditEntry } from './types';
import OccurrenceForm from './components/OccurrenceForm';
import EditOccurrenceModal from './components/EditOccurrenceModal';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';
import { generateExcelReport, generatePdfReport, generateSingleOccurrencePdf } from './utils/reportGenerator';
import { seedOccurrences } from './utils/seedData';
import { ReportOptions } from './components/ReportModal';
import { generateChangeDetails } from './utils/auditHelper';
import Header from './components/Header';
import DashboardAndList from './components/DashboardAndList';
import Settings from './components/Settings';
import LoginScreen from './components/LoginScreen';

type ActiveTab = 'register' | 'dashboard' | 'settings';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [occurrences, setOccurrences] = useState<Occurrence[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedOccurrences = localStorage.getItem('occurrences_school');
        if (savedOccurrences) {
          return JSON.parse(savedOccurrences);
        }
      }
      return seedOccurrences;
    } catch (error) {
      console.error("Failed to load occurrences from localStorage", error);
      return seedOccurrences;
    }
  });
  
  const [editingOccurrence, setEditingOccurrence] = useState<Occurrence | null>(null);
  const [deletingOccurrenceId, setDeletingOccurrenceId] = useState<string | null>(null);
  const [dataToRestore, setDataToRestore] = useState<Occurrence[] | null>(null);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('register');
  
  useEffect(() => {
    // Check session storage on initial load
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      setIsAuthenticated(loggedIn);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('occurrences_school', JSON.stringify(occurrences));
      }
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

  const handleLoginSuccess = () => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('isLoggedIn', 'true');
    }
    setIsAuthenticated(true);
  };

  const addOccurrence = useCallback((occurrence: Omit<Occurrence, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'auditLog'>) => {
    const timestamp = new Date().toISOString();
    const newOccurrence: Occurrence = {
      ...(occurrence as Omit<Occurrence, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'auditLog'>),
      id: `OCC-${Date.now()}`,
      status: OccurrenceStatus.OPEN,
      createdAt: timestamp,
      updatedAt: timestamp,
      auditLog: [{
        id: `log-${Date.now()}`,
        timestamp: timestamp,
        user: 'Usuário do Sistema',
        action: 'Criação da Ficha',
        details: 'Ficha de ocorrência registrada no sistema.',
      }]
    };
    setOccurrences(prev => [newOccurrence, ...prev]);
    addToast('Ocorrência registrada com sucesso!');
    setActiveTab('dashboard'); // Switch to dashboard after registering
  }, [addToast]);

  const updateOccurrence = useCallback((updatedOccurrence: Occurrence) => {
    const originalOccurrence = occurrences.find(o => o.id === updatedOccurrence.id);
    if (!originalOccurrence) return;

    const changeDetails = generateChangeDetails(originalOccurrence, updatedOccurrence);

    let finalOccurrence = { ...updatedOccurrence };
    const timestamp = new Date().toISOString();

    if (changeDetails) {
        const newLogEntry: AuditEntry = {
          id: `log-${Date.now()}`,
          timestamp,
          user: 'Usuário do Sistema',
          action: 'Edição de Dados',
          details: changeDetails,
        };
        finalOccurrence.auditLog = [...(finalOccurrence.auditLog || []), newLogEntry];
        finalOccurrence.updatedAt = timestamp;
    }
    
    setOccurrences(prev =>
      prev.map(occ =>
        occ.id === finalOccurrence.id ? finalOccurrence : occ
      )
    );
    setEditingOccurrence(null);
    addToast('Ocorrência atualizada com sucesso!');
  }, [occurrences, addToast]);


  const updateOccurrenceStatus = useCallback((id: string, status: OccurrenceStatus) => {
    setOccurrences(prev =>
      prev.map(occ => {
        if (occ.id === id) {
          if (occ.status === status) return occ;

          const oldStatus = occ.status;
          const timestamp = new Date().toISOString();
          const newLogEntry: AuditEntry = {
            id: `log-${Date.now()}`,
            timestamp: timestamp,
            user: 'Usuário do Sistema',
            action: 'Atualização de Status',
            details: `Status alterado de '${oldStatus}' para '${status}'.`,
          };

          return {
            ...occ,
            status,
            updatedAt: timestamp,
            auditLog: [...occ.auditLog, newLogEntry]
          };
        }
        return occ;
      })
    );
  }, []);

  const confirmDeleteOccurrence = useCallback(() => {
    if (deletingOccurrenceId) {
      setOccurrences(prev => prev.filter(occ => occ.id !== deletingOccurrenceId));
      setDeletingOccurrenceId(null);
      addToast('Ocorrência excluída com sucesso!');
    }
  }, [deletingOccurrenceId, addToast]);
  
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
        if (typeof text !== 'string') throw new Error("File content is not a string.");
        const data = JSON.parse(text);
        if (Array.isArray(data) && (data.length === 0 || (data[0].id && data[0].student))) {
          setDataToRestore(data);
        } else {
          throw new Error("Invalid backup file structure.");
        }
      } catch (error) {
        console.error("Restore failed", error);
        addToast('Arquivo de backup inválido ou corrompido.', 'error');
      } finally {
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


  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Toast toasts={toasts} onClose={removeToast} />
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        occurrenceCount={occurrences.length} 
      />
      
      <main className="container mx-auto p-4 md:p-8">
        <div key={activeTab}>
          {activeTab === 'register' && <OccurrenceForm onSubmit={addOccurrence} />}
          {activeTab === 'dashboard' && 
            <DashboardAndList 
              occurrences={occurrences}
              updateOccurrenceStatus={updateOccurrenceStatus}
              setDeletingOccurrenceId={setDeletingOccurrenceId}
              setEditingOccurrence={setEditingOccurrence}
              addToast={addToast}
            />
          }
          {activeTab === 'settings' && 
            <Settings 
              onBackup={handleBackup} 
              onRestoreRequest={handleFileSelect} 
            />
          }
        </div>
      </main>

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
          message="Você tem certeza que deseja restaurar este backup? Todos os dados atuais serão substituídos."
          onConfirm={confirmRestore}
          onClose={() => setDataToRestore(null)}
        />
      )}
    </div>
  );
};

export default App;