import React from 'react';
import { Occurrence, OccurrenceStatus } from '../types';
import { Tag } from './Tag';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PrintIcon } from './icons/PrintIcon';

interface OccurrenceItemProps {
  occurrence: Occurrence;
  onUpdateStatus: (id: string, status: OccurrenceStatus) => void;
  onDeleteRequest: (id: string) => void;
  onEditRequest: (occurrence: Occurrence) => void;
  onGenerateSinglePdf: (occurrence: Occurrence) => void;
}

const statusColors: { [key in OccurrenceStatus]: string } = {
  [OccurrenceStatus.OPEN]: 'bg-blue-100 text-blue-800',
  [OccurrenceStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [OccurrenceStatus.RESOLVED]: 'bg-green-100 text-green-800',
  [OccurrenceStatus.CLOSED]: 'bg-gray-100 text-gray-800',
};


const OccurrenceItem: React.FC<OccurrenceItemProps> = ({ occurrence, onUpdateStatus, onDeleteRequest, onEditRequest, onGenerateSinglePdf }) => {

  const mainOccurrenceType = occurrence.occurrenceTypes[0] || 'Não especificado';

  return (
    <div className="border border-lime-200 bg-lime-50 rounded-lg p-4 transition-shadow hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-lime-900">{occurrence.student.fullName}</h3>
          <p className="text-sm text-gray-500 mb-2">
            ID: {occurrence.id} | Data: {new Date(occurrence.occurrenceDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Tag text={occurrence.status} color={statusColors[occurrence.status]} />
        </div>
      </div>
      <div className="my-3 space-y-2">
        <p className="text-gray-700">
            <strong>Tipo Principal:</strong> <span className="font-medium text-lime-800">{mainOccurrenceType}</span>
            {occurrence.occurrenceTypes.length > 1 && <span className="text-gray-500 text-sm"> (+{occurrence.occurrenceTypes.length - 1})</span>}
        </p>
         <p className="text-sm text-gray-600"><strong>Unidade Escolar:</strong> {occurrence.schoolUnit}</p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
           <select
            value={occurrence.status}
            onChange={(e) => onUpdateStatus(occurrence.id, e.target.value as OccurrenceStatus)}
            className="text-sm bg-white border border-gray-300 rounded-md py-1 px-2 focus:ring-lime-500 focus:border-lime-500"
          >
            {Object.values(OccurrenceStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            onClick={() => onGenerateSinglePdf(occurrence)} 
            className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
            aria-label="Imprimir Ficha"
            title="Imprimir Ficha"
          >
            <PrintIcon className="h-5 w-5" />
          </button>
           <button 
            onClick={() => onEditRequest(occurrence)} 
            className="p-2 text-gray-500 hover:text-lime-700 hover:bg-lime-100 rounded-full transition-colors"
            aria-label="Editar ocorrência"
            title="Editar Ocorrência"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={() => onDeleteRequest(occurrence.id)} 
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
            aria-label="Excluir ocorrência"
            title="Excluir Ocorrência"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OccurrenceItem;