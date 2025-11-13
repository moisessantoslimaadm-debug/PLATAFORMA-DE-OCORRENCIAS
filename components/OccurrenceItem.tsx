import React, { useState } from 'react';
import { Occurrence, OccurrenceStatus } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PrintIcon } from './icons/PrintIcon';
import { ClockIcon } from './icons/ClockIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { OCCURRENCE_STATUS_STYLES, OCCURRENCE_TYPE_DATA } from '../constants';

interface OccurrenceItemProps {
  occurrence: Occurrence;
  onUpdateStatus: (id: string, status: OccurrenceStatus) => void;
  onDeleteRequest: (id: string) => void;
  onEditRequest: (occurrence: Occurrence) => void;
  onGenerateSinglePdf: (occurrence: Occurrence) => void;
}

const OccurrenceItem: React.FC<OccurrenceItemProps> = ({ occurrence, onUpdateStatus, onDeleteRequest, onEditRequest, onGenerateSinglePdf }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatTimestamp = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  }

  const statusStyle = OCCURRENCE_STATUS_STYLES[occurrence.status];

  return (
    <div className="border border-gray-200 bg-white rounded-lg transition-shadow hover:shadow-md">
      <div 
        className="flex items-center justify-between cursor-pointer p-4"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0">
             {occurrence.student.photoUrl ? (
                <img src={occurrence.student.photoUrl} alt={occurrence.student.fullName} className="h-10 w-10 rounded-full object-cover bg-gray-200" />
              ) : (
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
              )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="font-bold text-gray-800 truncate">{occurrence.student.fullName}</h4>
            <div className="flex flex-wrap items-center gap-1.5 mt-1" title={occurrence.occurrenceTypes.join(', ')}>
                {occurrence.occurrenceTypes.map(type => {
                    const typeData = OCCURRENCE_TYPE_DATA[type];
                    if (!typeData) return null;
                    const Icon = typeData.icon;
                    return (
                        <span key={type} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeData.color.bg} ${typeData.color.text}`}>
                            <Icon className="h-3.5 w-3.5" />
                            {type}
                        </span>
                    );
                })}
            </div>
          </div>
        </div>
         <div className="flex items-center gap-3 ml-4">
            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
              {occurrence.status}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200 space-y-4 animate-fade-in">
             <div className="text-xs text-gray-500 grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex items-center gap-1.5">
                    <strong className="font-medium text-gray-600">ID:</strong> {occurrence.id}
                </div>
                 <div className="flex items-center gap-1.5">
                    <strong className="font-medium text-gray-600">Data:</strong> {new Date(occurrence.occurrenceDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                </div>
                 <div className="flex items-center gap-1.5 col-span-2">
                    <strong className="font-medium text-gray-600">Unidade:</strong> {occurrence.schoolUnit}
                </div>
             </div>

             <div className="pt-3 border-t">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Histórico de Alterações</h5>
                 <div className="flow-root max-h-48 overflow-y-auto pr-2">
                    <ul className="-mb-4">
                    {(occurrence.auditLog || []).slice().reverse().map((log, logIndex) => (
                        <li key={log.id}>
                        <div className="relative pb-4">
                            {logIndex !== occurrence.auditLog.length - 1 ? (
                            <span className="absolute top-2 left-2 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                            ) : null}
                            <div className="relative flex items-start space-x-2">
                            <div className="h-4 w-4 bg-gray-300 rounded-full flex items-center justify-center ring-4 ring-white">
                                <ClockIcon className="h-2.5 w-2.5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">
                                {formatTimestamp(log.timestamp)} - <span className="font-medium text-gray-700">{log.action}</span>
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5 italic">"{log.details}"</p>
                            </div>
                            </div>
                        </div>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>

             <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex-1">
                    <label htmlFor={`status-select-${occurrence.id}`} className="sr-only">Mudar Status</label>
                    <select
                        id={`status-select-${occurrence.id}`}
                        value={occurrence.status}
                        onChange={(e) => onUpdateStatus(occurrence.id, e.target.value as OccurrenceStatus)}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm bg-white border border-gray-300 rounded-md py-1.5 px-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        {Object.values(OccurrenceStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-1 justify-end">
                    <button 
                        onClick={() => onGenerateSinglePdf(occurrence)} 
                        className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                        aria-label="Imprimir Ficha" title="Imprimir Ficha (PDF)"
                    >
                        <PrintIcon className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={() => onEditRequest(occurrence)} 
                        className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-100 rounded-full transition-colors"
                        aria-label="Editar ocorrência" title="Editar Ocorrência"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={() => onDeleteRequest(occurrence.id)} 
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        aria-label="Excluir ocorrência" title="Excluir Ocorrência"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default OccurrenceItem;