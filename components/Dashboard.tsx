import React, { useMemo } from 'react';
import { Occurrence, OccurrenceType } from '../types';
import { OCCURRENCE_TYPE_COLORS } from '../constants';

interface DashboardProps {
  occurrences: Occurrence[];
}

const Dashboard: React.FC<DashboardProps> = ({ occurrences }) => {
  const typeCounts = useMemo(() => {
    const counts: { [key in OccurrenceType]: number } = {
      [OccurrenceType.PHYSICAL_AGGRESSION]: 0,
      [OccurrenceType.VERBAL_AGGRESSION]: 0,
      [OccurrenceType.BULLYING]: 0,
      [OccurrenceType.PROPERTY_DAMAGE]: 0,
      [OccurrenceType.ESCAPE]: 0,
      [OccurrenceType.SOCIAL_RISK]: 0,
      [OccurrenceType.PROHIBITED_SUBSTANCES]: 0,
      [OccurrenceType.OTHER]: 0,
    };
    
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
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Índice de Ocorrências</h3>
        {totalOccurrences === 0 ? (
           <div className="flex items-center justify-center h-full text-gray-500 py-8">Nenhuma ocorrência registrada.</div>
        ) : (
            <div className="space-y-3">
            {typeCounts.map(([type, count]) => (
                <div key={type}>
                    <div className="flex justify-between text-sm mb-1 items-center">
                        <span className="text-gray-600 truncate pr-2">{type}</span>
                        <div className="flex items-center gap-2">
                             <div className="w-20 h-4 bg-gray-200 rounded-md">
                                {count > 0 &&
                                    <div
                                        className="h-4 rounded-md"
                                        style={{ width: `100%`, backgroundColor: OCCURRENCE_TYPE_COLORS[type] }}
                                    ></div>
                                }
                            </div>
                            <span className="font-semibold text-gray-800 w-4 text-right">{count}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        )}
    </div>
  );
};

export default Dashboard;
