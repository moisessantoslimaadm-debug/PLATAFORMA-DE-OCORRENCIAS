export enum OccurrenceStatus {
  OPEN = 'Aberta',
  IN_PROGRESS = 'Em Andamento',
  RESOLVED = 'Resolvida',
  CLOSED = 'Fechada',
}

export enum OccurrenceType {
  PHYSICAL_AGGRESSION = 'Agressão física',
  VERBAL_AGGRESSION = 'Agressão verbal/ofensas',
  BULLYING = 'Situação de bullying',
  PROPERTY_DAMAGE = 'Danos ao patrimônio',
  ESCAPE = 'Fuga/abandono de sala ou unidade escolar',
  SOCIAL_RISK = 'Situação de risco/vulnerabilidade social',
  PROHIBITED_SUBSTANCES = 'Uso/porte de substâncias proibidas',
  OTHER = 'Outros',
}

export interface Student {
  fullName: string;
  birthDate: string;
  age: string;
  grade: string;
  shift: string;
  enrollmentId: string;
  photoUrl?: string; // Placeholder for visual representation
}

export interface Guardian {
  fullName:string;
  relationship: string;
  phone: string;
  address: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'Criação da Ficha' | 'Edição de Dados' | 'Atualização de Status';
  details: string;
}

export interface Occurrence {
  id: string;
  // Header info
  schoolUnit: string;
  municipality: string;
  uf: string;
  fillingDate: string;
  fillingTime: string;

  // Student
  student: Student;

  // Guardian
  guardian: Guardian;

  // Occurrence details
  occurrenceDate: string;
  occurrenceTime: string;
  location: string;
  occurrenceTypes: OccurrenceType[];
  otherOccurrenceType?: string;

  // Text areas
  detailedDescription: string;
  involvedPeople: string;
  immediateActions: string;
  referrals: string;
  socialServiceEvaluation?: string;
  observations?: string;
  
  // Meta
  status: OccurrenceStatus;
  createdAt: string;
  updatedAt: string;
  auditLog: AuditEntry[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}