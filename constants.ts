// FIX: Import React to use React types like React.FC and React.SVGProps.
import React from 'react';
import { OccurrenceStatus, OccurrenceType } from './types';
import { PhysicalAggressionIcon, VerbalAggressionIcon, BullyingIcon, PropertyDamageIcon, EscapeIcon, SocialRiskIcon, ProhibitedSubstancesIcon, OtherIcon } from './components/icons/OccurrenceTypeIcons';

export const SCHOOL_UNITS = [
    "Escola Municipal Dr. Abdias de Menezes",
    "Colégio Estadual de Itaberaba",
    "Centro Educacional de Itaberaba",
    "Escola Municipal de Campo Formoso",
    "Escola Municipal Cecília Meireles",
    "Outra Unidade Escolar"
];

export const OCCURRENCE_TYPES = Object.values(OccurrenceType);

export const OCCURRENCE_TYPE_DATA: { [key in OccurrenceType]: { icon: React.FC<React.SVGProps<SVGSVGElement>>, color: { bg: string, text: string } } } = {
  [OccurrenceType.PHYSICAL_AGGRESSION]: { icon: PhysicalAggressionIcon, color: { bg: 'bg-red-100', text: 'text-red-600' } },
  [OccurrenceType.VERBAL_AGGRESSION]: { icon: VerbalAggressionIcon, color: { bg: 'bg-orange-100', text: 'text-orange-600' } },
  [OccurrenceType.BULLYING]: { icon: BullyingIcon, color: { bg: 'bg-amber-100', text: 'text-amber-600' } },
  [OccurrenceType.PROPERTY_DAMAGE]: { icon: PropertyDamageIcon, color: { bg: 'bg-yellow-100', text: 'text-yellow-600' } },
  [OccurrenceType.ESCAPE]: { icon: EscapeIcon, color: { bg: 'bg-lime-100', text: 'text-lime-600' } },
  [OccurrenceType.SOCIAL_RISK]: { icon: SocialRiskIcon, color: { bg: 'bg-sky-100', text: 'text-sky-600' } },
  [OccurrenceType.PROHIBITED_SUBSTANCES]: { icon: ProhibitedSubstancesIcon, color: { bg: 'bg-indigo-100', text: 'text-indigo-600' } },
  [OccurrenceType.OTHER]: { icon: OtherIcon, color: { bg: 'bg-slate-100', text: 'text-slate-600' } },
};

export const OCCURRENCE_STATUS_STYLES: { [key in OccurrenceStatus]: { bg: string, text: string } } = {
  [OccurrenceStatus.OPEN]: { bg: 'bg-blue-100', text: 'text-blue-800' },
  [OccurrenceStatus.IN_PROGRESS]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  [OccurrenceStatus.RESOLVED]: { bg: 'bg-green-100', text: 'text-green-800' },
  [OccurrenceStatus.CLOSED]: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

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