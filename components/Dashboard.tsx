import React, { useMemo } from 'react';
import { Occurrence, OccurrenceStatus, OccurrenceType } from '../types';

interface DashboardProps {
  occurrences: Occurrence[];
}

interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <div className={`p-4 rounded-lg shadow-md ${color}`}>
    <p className="text-sm font-medium opacity-80">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const BarChart: React.FC<{ data: { name: string, value: number }[] }> = ({ data }) => {
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">Nenhuma ocorrência registrada para exibir estatísticas.</div>;
    }

    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="space-y-3 p-2">
            {data.map(item => (
                <div key={item.name} className="flex items-center">
                    <div className="w-1/3 text-sm text-gray-600 truncate pr-2" title={item.name}>{item.name}</div>
                    <div className="w-2/3 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-5">
                            <div
                                className="bg-lime-600 h-5 rounded-full text-xs text-white flex items-center justify-end pr-2"
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            >
                                {item.value}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ occurrences }) => {
  const stats = useMemo(() => {
    const typeCounts: { [key in OccurrenceType]?: number } = {};
    occurrences.forEach(occ => {
      occ.occurrenceTypes.forEach(type => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
    });
    
    const sortedTypes = Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value: value! }));

    return {
      total: occurrences.length,
      open: occurrences.filter(o => o.status === OccurrenceStatus.OPEN).length,
      inProgress: occurrences.filter(o => o.status === OccurrenceStatus.IN_PROGRESS).length,
      resolved: occurrences.filter(o => o.status === OccurrenceStatus.RESOLVED).length,
      topTypes: sortedTypes,
    };
  }, [occurrences]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:col-span-2">
             <StatCard title="Total de Fichas" value={stats.total} color="bg-lime-600 text-white" />
             <StatCard title="Abertas" value={stats.open} color="bg-blue-500 text-white" />
             <StatCard title="Em Andamento" value={stats.inProgress} color="bg-yellow-500 text-white" />
             <StatCard title="Resolvidas" value={stats.resolved} color="bg-green-500 text-white" />
        </div>
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md border">
            <h3 className="text-lg font-bold text-lime-800 mb-2">Tipos de Ocorrência Mais Frequentes</h3>
            <BarChart data={stats.topTypes} />
        </div>
    </div>
  );
};

export default Dashboard;
