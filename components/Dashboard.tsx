import React, { useMemo } from 'react';
import { Occurrence, OccurrenceType } from '../types';
import { OCCURRENCE_TYPE_DATA } from '../constants';
import { DocumentIcon } from './icons/DocumentIcon';

interface DashboardProps {
  occurrences: Occurrence[];
}

const StatCard: React.FC<{type: OccurrenceType, count: number}> = ({ type, count }) => {
    const typeData = OCCURRENCE_TYPE_DATA[type];
    const IconComponent = typeData.icon || DocumentIcon;
    return (
         <div className="flex items-start p-4 bg-white rounded-lg shadow border border-gray-200">
            <div className={`p-3 rounded-lg ${typeData.color.bg} ${typeData.color.text}`}>
                <IconComponent className="h-6 w-6" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">{type}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
        </div>
    )
}

const Dashboard: React.FC<DashboardProps> = ({ occurrences }) => {
  const typeCounts = useMemo(() => {
    const counts: { [key in OccurrenceType]: number } = Object.values(OccurrenceType).reduce((acc, type) => {
        acc[type] = 0;
        return acc;
    }, {} as { [key in OccurrenceType]: number });
    
    occurrences.forEach(occ => {
      occ.occurrenceTypes.forEach(type => {
        if (type in counts) {
          counts[type]++;
        }
      });
    });
    
    return Object.entries(counts) as [OccurrenceType, number][];
  }, [occurrences]);

  const totalOccurrences = occurrences.length;

  return (
    <div className="mb-8">
        <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Painel de Controle</h2>
            <p className="text-gray-500">Resumo estatístico das ocorrências registradas.</p>
        </div>

        {totalOccurrences === 0 ? (
           <div className="text-center py-10 bg-white rounded-lg shadow-md border border-gray-200">
                <p className="text-gray-500">Nenhuma ocorrência registrada para exibir estatísticas.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {typeCounts.map(([type, count]) => (
                    <StatCard key={type} type={type} count={count} />
                ))}
            </div>
        )}
    </div>
  );
};

export default Dashboard;
