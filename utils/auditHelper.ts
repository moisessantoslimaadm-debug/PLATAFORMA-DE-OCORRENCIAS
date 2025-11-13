import { Occurrence } from '../types';

const FIELD_LABELS: { [key: string]: string } = {
  schoolUnit: 'Unidade Escolar',
  municipality: 'Município',
  uf: 'UF',
  fillingDate: 'Data de Preenchimento',
  fillingTime: 'Horário de Preenchimento',
  'student.fullName': 'Nome do Aluno',
  'student.birthDate': 'Data de Nascimento',
  'student.age': 'Idade',
  'student.grade': 'Ano/Série',
  'student.shift': 'Turno',
  'student.enrollmentId': 'Nº de Matrícula',
  'guardian.fullName': 'Nome do Responsável',
  'guardian.relationship': 'Parentesco',
  'guardian.phone': 'Contato Telefônico',
  'guardian.address': 'Endereço',
  occurrenceDate: 'Data da Ocorrência',
  occurrenceTime: 'Hora da Ocorrência',
  location: 'Local',
  occurrenceTypes: 'Tipos de Ocorrência',
  otherOccurrenceType: 'Outro Tipo (Detalhe)',
  detailedDescription: 'Descrição Detalhada',
  involvedPeople: 'Pessoas Envolvidas',
  immediateActions: 'Providências Imediatas',
  referrals: 'Encaminhamentos',
  socialServiceEvaluation: 'Avaliação Serviço Social',
  status: 'Status',
};

const formatDateForCompare = (dateString: string) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Compare only YYYY-MM-DD
    } catch {
        return dateString;
    }
}

const compareObjects = (oldObj: any, newObj: any, keys: { path: string, label: string }[]) => {
    const changes: string[] = [];
    
    for (const { path, label } of keys) {
        const oldVal = path.split('.').reduce((o, p) => o && o[p], oldObj);
        const newVal = path.split('.').reduce((o, p) => o && o[p], newObj);

        let oldDisplay = oldVal;
        let newDisplay = newVal;
        
        if (path.toLowerCase().includes('date')) {
            oldDisplay = formatDateForCompare(oldVal);
            newDisplay = formatDateForCompare(newVal);
        } else if (Array.isArray(oldVal)) {
            oldDisplay = [...oldVal].sort().join(', ');
            newDisplay = [...newVal].sort().join(', ');
        }
        
        if (String(oldDisplay ?? '') !== String(newDisplay ?? '')) {
            if (typeof oldVal === 'string' && oldVal.length > 50) {
                changes.push(`Campo '${label}' foi modificado.`);
            } else {
                changes.push(`'${label}' de '${oldDisplay || 'vazio'}' para '${newDisplay || 'vazio'}'`);
            }
        }
    }
    
    return changes;
}

export const generateChangeDetails = (oldOcc: Occurrence, newOcc: Occurrence): string => {
  const keysToCompare = Object.entries(FIELD_LABELS).map(([path, label]) => ({ path, label }));
  const changes = compareObjects(oldOcc, newOcc, keysToCompare);
  return changes.join('; ');
};