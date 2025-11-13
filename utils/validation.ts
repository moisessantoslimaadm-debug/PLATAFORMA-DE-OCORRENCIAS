import { Occurrence, OccurrenceType } from '../types';

type FormData = Omit<Occurrence, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

export interface ValidationErrors {
  student?: {
    fullName?: string;
    birthDate?: string;
  };
  occurrenceDate?: string;
  occurrenceTime?: string;
  occurrenceTypes?: string;
  otherOccurrenceType?: string;
  detailedDescription?: string;
  [key: string]: any;
}

export const validateOccurrence = (data: FormData | Occurrence): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Student Validation
  if (!data.student.fullName.trim()) {
    errors.student = { ...errors.student, fullName: 'O nome do aluno é obrigatório.' };
  } else if (data.student.fullName.trim().length < 3) {
    errors.student = { ...errors.student, fullName: 'O nome deve ter pelo menos 3 caracteres.' };
  }

  if (!data.student.birthDate) {
    errors.student = { ...errors.student, birthDate: 'A data de nascimento é obrigatória.' };
  } else if (new Date(data.student.birthDate) >= new Date()) {
    errors.student = { ...errors.student, birthDate: 'A data de nascimento deve ser no passado.' };
  }

  // Occurrence Validation
  if (!data.occurrenceDate) {
    errors.occurrenceDate = 'A data da ocorrência é obrigatória.';
  } else if (new Date(data.occurrenceDate) > new Date()) {
    errors.occurrenceDate = 'A data da ocorrência não pode ser no futuro.';
  }
  
  if (!data.occurrenceTime) {
    errors.occurrenceTime = 'O horário aproximado é obrigatório.';
  }

  if (data.occurrenceTypes.length === 0) {
    errors.occurrenceTypes = 'Selecione ao menos um tipo de ocorrência.';
  }

  if (data.occurrenceTypes.includes(OccurrenceType.OTHER) && !data.otherOccurrenceType?.trim()) {
    errors.otherOccurrenceType = "Especifique o tipo 'Outros'.";
  }
  
  if (!data.detailedDescription.trim()) {
    errors.detailedDescription = 'A descrição detalhada é obrigatória.';
  } else if (data.detailedDescription.trim().length < 10) {
    errors.detailedDescription = 'A descrição deve ter pelo menos 10 caracteres.';
  }

  return errors;
};
