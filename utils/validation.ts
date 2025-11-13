import { Occurrence, OccurrenceType } from '../types';

type FormData = Omit<Occurrence, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

export interface ValidationErrors {
  schoolUnit?: string;
  student?: {
    fullName?: string;
    birthDate?: string;
    grade?: string;
    shift?: string;
  };
  guardian?: {
    fullName?: string;
    phone?: string;
    address?: string;
  };
  occurrenceDate?: string;
  occurrenceTime?: string;
  location?: string;
  occurrenceTypes?: string;
  otherOccurrenceType?: string;
  detailedDescription?: string;
  involvedPeople?: string;
  immediateActions?: string;
  [key: string]: any;
}

export const validateOccurrence = (data: FormData | Occurrence): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Unit validation
  if (!data.schoolUnit?.trim()) {
    errors.schoolUnit = 'A unidade escolar é obrigatória.';
  }

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
  
  if (!data.student.grade?.trim()) {
    errors.student = { ...errors.student, grade: 'O ano/série é obrigatório.' };
  }
  
  if (!data.student.shift?.trim()) {
    errors.student = { ...errors.student, shift: 'O turno é obrigatório.' };
  }


  // Guardian Validation
  if (!data.guardian.fullName?.trim()) {
    errors.guardian = { ...errors.guardian, fullName: 'O nome do responsável é obrigatório.' };
  }

  if (!data.guardian.phone?.trim()) {
    errors.guardian = { ...errors.guardian, phone: 'O contato do responsável é obrigatório.' };
  } else {
    const cleanedPhone = data.guardian.phone.trim().replace(/\D/g, '');
    if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
        errors.guardian = { ...errors.guardian, phone: 'Telefone inválido. Forneça um número com DDD, ex: (75) 99999-8888.' };
    }
  }

  if (!data.guardian.address?.trim()) {
    errors.guardian = { ...errors.guardian, address: 'O endereço do responsável é obrigatório.' };
  } else if (data.guardian.address.trim().length < 10) {
    errors.guardian = { ...errors.guardian, address: 'O endereço deve ter pelo menos 10 caracteres.' };
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

  if (!data.location?.trim()) {
    errors.location = 'O local da ocorrência é obrigatório.';
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

  if (!data.involvedPeople?.trim()) {
    errors.involvedPeople = 'Informar as pessoas envolvidas é obrigatório.';
  }
  
  if (!data.immediateActions?.trim()) {
    errors.immediateActions = 'Informar as providências imediatas é obrigatório.';
  }

  return errors;
};

export const validateStep = (data: FormData | Occurrence, step: number): ValidationErrors => {
  const errors: ValidationErrors = {};
  const fullErrors = validateOccurrence(data);

  switch (step) {
    case 1: // Identification
      if (fullErrors.schoolUnit) errors.schoolUnit = fullErrors.schoolUnit;
      if (fullErrors.student && Object.keys(fullErrors.student).length > 0) {
        errors.student = fullErrors.student;
      }
      break;
    case 2: // Guardian & Occurrence Details
      if (fullErrors.guardian && Object.keys(fullErrors.guardian).length > 0) {
        errors.guardian = fullErrors.guardian;
      }
      if (fullErrors.occurrenceDate) errors.occurrenceDate = fullErrors.occurrenceDate;
      if (fullErrors.occurrenceTime) errors.occurrenceTime = fullErrors.occurrenceTime;
      if (fullErrors.location) errors.location = fullErrors.location;
      if (fullErrors.occurrenceTypes) errors.occurrenceTypes = fullErrors.occurrenceTypes;
      if (fullErrors.otherOccurrenceType) errors.otherOccurrenceType = fullErrors.otherOccurrenceType;
      break;
    case 3: // Description
      if (fullErrors.detailedDescription) errors.detailedDescription = fullErrors.detailedDescription;
      if (fullErrors.involvedPeople) errors.involvedPeople = fullErrors.involvedPeople;
      if (fullErrors.immediateActions) errors.immediateActions = fullErrors.immediateActions;
      break;
    case 4: // Finalization (optional fields are not validated for step progression)
      // No validation needed for just moving to the final step
      break;
    default:
      break;
  }
  return errors;
};