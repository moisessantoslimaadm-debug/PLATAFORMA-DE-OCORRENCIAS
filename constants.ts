import { OccurrenceType } from './types';

export const SCHOOL_UNITS = [
    "Escola Municipal Dr. Abdias de Menezes",
    "Colégio Estadual de Itaberaba",
    "Centro Educacional de Itaberaba",
    "Escola Municipal de Campo Formoso",
    "Outra Unidade Escolar"
];

export const OCCURRENCE_TYPES = Object.values(OccurrenceType);

export const REPORT_COLUMNS = [
  { key: 'id', label: 'ID Ocorrência' },
  { key: 'status', label: 'Status' },
  { key: 'schoolUnit', label: 'Unidade Escolar' },
  { key: 'fillingDate', label: 'Data Preenchimento' },
  { key: 'student.fullName', label: 'Nome do Aluno' },
  { key: 'student.birthDate', label: 'Data Nasc. Aluno' },
  { key: 'student.age', label: 'Idade Aluno' },
  { key: 'student.grade', label: 'Ano/Série' },
  { key: 'student.shift', label: 'Turno' },
  { key: 'guardian.fullName', label: 'Responsável' },
  { key: 'guardian.phone', label: 'Telefone Resp.' },
  { key: 'occurrenceDate', label: 'Data Ocorrência' },
  { key: 'occurrenceTime', label: 'Hora Ocorrência' },
  { key: 'location', label: 'Local' },
  { key: 'occurrenceTypes', label: 'Tipos de Ocorrência' },
  { key: 'otherOccurrenceType', label: 'Outro Tipo (Detalhe)' },
  { key: 'detailedDescription', label: 'Descrição Detalhada' },
  { key: 'involvedPeople', label: 'Pessoas Envolvidas' },
  { key: 'immediateActions', label: 'Providências Imediatas' },
  { key: 'referrals', label: 'Encaminhamentos' },
  { key: 'socialServiceEvaluation', label: 'Avaliação Serviço Social' },
  { key: 'createdAt', label: 'Registrado em' },
  { key: 'updatedAt', label: 'Atualizado em' },
];