import React, { useState, useEffect } from 'react';
import { Occurrence, OccurrenceType } from '../types';
import { SelectInput } from './SelectInput';
import { TextAreaInput } from './TextAreaInput';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { SCHOOL_UNITS, OCCURRENCE_TYPES } from '../constants';
import { validateOccurrence, ValidationErrors } from '../utils/validation';
import { MultiSelectTagInput } from './MultiSelectTagInput';
import { UserCircleIcon } from './icons/UserCircleIcon';


interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<SectionProps> = ({ title, children }) => (
  <div className="mt-8">
    <div className="bg-green-700 text-white font-bold p-3 w-full text-lg rounded-t-md">
      <h3>{title}</h3>
    </div>
    <div className="p-4 border border-t-0 rounded-b-md border-gray-200">
      {children}
    </div>
  </div>
);


interface OccurrenceFormProps {
  onSubmit: (data: Omit<Occurrence, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'auditLog'>) => void;
}

const initialFormData = {
  schoolUnit: SCHOOL_UNITS[4],
  municipality: 'Belo Horizonte',
  uf: 'MG',
  fillingDate: new Date().toISOString().split('T')[0],
  fillingTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  student: {
    fullName: '',
    birthDate: '',
    age: '',
    grade: '',
    shift: '',
    enrollmentId: '',
  },
  guardian: {
    fullName: '',
    relationship: '',
    phone: '',
    address: '',
  },
  occurrenceDate: '',
  occurrenceTime: '',
  location: '',
  occurrenceTypes: [] as OccurrenceType[],
  otherOccurrenceType: '',
  detailedDescription: '',
  involvedPeople: '',
  immediateActions: '',
  referrals: '',
  socialServiceEvaluation: '',
};

const OccurrenceForm: React.FC<OccurrenceFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  useEffect(() => {
    if (formData.student.birthDate) {
        const birthDate = new Date(formData.student.birthDate);
        if (!isNaN(birthDate.getTime()) && birthDate.getFullYear() > 1900) {
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setFormData(prev => ({
                ...prev,
                student: {
                    ...prev.student,
                    age: String(Math.max(0, age))
                }
            }));
        }
    }
  }, [formData.student.birthDate]);

  useEffect(() => {
    if (hasSubmitted) {
        setErrors(validateOccurrence(formData));
    }
  }, [formData, hasSubmitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section?: keyof typeof initialFormData) => {
    const { name, value } = e.target;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as object),
          [name]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    const validationErrors = validateOccurrence(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(formData);
    setFormData(initialFormData);
    setHasSubmitted(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="bg-green-700 text-white p-6 rounded-lg -mx-6 -mt-6 mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            FICHA DE REGISTRO DE OCORRÊNCIA ESCOLAR
          </h1>
          <p className="text-sm md:text-md text-green-200 mt-1">
            Plataforma Inteligente de Registro de Situações Críticas
          </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-gray-200 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-6">
                    <SelectInput label="Unidade Escolar" id="schoolUnit" name="schoolUnit" value={formData.schoolUnit} onChange={handleChange} error={errors.schoolUnit} required>
                    {SCHOOL_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </SelectInput>
                </div>
                <div className="md:col-span-4">
                     <TextInput label="Município" id="municipality" name="municipality" value={formData.municipality} onChange={handleChange} />
                </div>
                 <div className="md:col-span-2">
                    <TextInput label="UF" id="uf" name="uf" value={formData.uf} onChange={handleChange} />
                 </div>
                 <div className="md:col-span-3">
                    <TextInput label="Data de Preenchimento" id="fillingDate" name="fillingDate" type="date" value={formData.fillingDate} onChange={handleChange} />
                </div>
                 <div className="md:col-span-3">
                    <TextInput label="Horário" id="fillingTime" name="fillingTime" type="time" value={formData.fillingTime} onChange={handleChange} />
                 </div>
            </div>
        </div>
        
        <FormSection title="1. IDENTIFICAÇÃO DO ALUNO ENVOLVIDO">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center md:col-span-1">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-2">
                    <UserCircleIcon className="w-24 h-24" />
                </div>
                <button type="button" className="text-sm text-center text-gray-600 border border-dashed border-gray-400 rounded-md px-3 py-1.5 hover:bg-gray-50">
                    Carregar foto
                </button>
            </div>
            <div className="md:col-span-2 space-y-4">
                 <TextInput label="Nome Completo" id="student.fullName" name="fullName" value={formData.student.fullName} onChange={e => handleChange(e, 'student')} required error={errors.student?.fullName} />
                <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Data de Nascimento" id="student.birthDate" name="birthDate" type="date" value={formData.student.birthDate} onChange={e => handleChange(e, 'student')} required error={errors.student?.birthDate} />
                    <TextInput label="Idade (anos)" id="student.age" name="age" type="number" value={formData.student.age} readOnly className="!bg-gray-200 !text-gray-800" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Nº de Matrícula" id="student.enrollmentId" name="enrollmentId" value={formData.student.enrollmentId} onChange={e => handleChange(e, 'student')} />
                    <TextInput label="Ano/Série" id="student.grade" name="grade" value={formData.student.grade} onChange={e => handleChange(e, 'student')} required error={errors.student?.grade} />
                </div>
                <TextInput label="Turno" id="student.shift" name="shift" value={formData.student.shift} onChange={e => handleChange(e, 'student')} required error={errors.student?.shift} />
            </div>
          </div>
        </FormSection>

        <FormSection title="2. RESPONSÁVEL LEGAL">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Nome Completo" id="guardian.fullName" name="fullName" value={formData.guardian.fullName} onChange={e => handleChange(e, 'guardian')} required error={errors.guardian?.fullName}/>
            <TextInput label="Parentesco" id="guardian.relationship" name="relationship" value={formData.guardian.relationship} onChange={e => handleChange(e, 'guardian')} />
            <TextInput label="Contato Telefônico" id="guardian.phone" name="phone" value={formData.guardian.phone} onChange={e => handleChange(e, 'guardian')} required error={errors.guardian?.phone} />
            <TextInput label="Endereço Completo" id="guardian.address" name="address" value={formData.guardian.address} onChange={e => handleChange(e, 'guardian')} className="md:col-span-2" />
          </div>
        </FormSection>

        <FormSection title="3. CARACTERIZAÇÃO DA OCORRÊNCIA">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Data da Ocorrência" id="occurrenceDate" name="occurrenceDate" type="date" value={formData.occurrenceDate} onChange={handleChange} required error={errors.occurrenceDate} />
              <TextInput label="Horário Aproximado" id="occurrenceTime" name="occurrenceTime" type="time" value={formData.occurrenceTime} onChange={handleChange} required error={errors.occurrenceTime} />
              <TextInput label="Local onde ocorreu" id="location" name="location" value={formData.location} onChange={handleChange} className="md:col-span-2" required error={errors.location} />
            </div>
            <div className="mt-4">
              <MultiSelectTagInput
                label="Tipo de Ocorrência"
                id="occurrenceTypes"
                options={OCCURRENCE_TYPES}
                selectedOptions={formData.occurrenceTypes}
                onChange={(selected) => setFormData(prev => ({ ...prev, occurrenceTypes: selected }))}
                error={errors.occurrenceTypes}
                required
              />
              {formData.occurrenceTypes.includes(OccurrenceType.OTHER) && (
                <div className="mt-4">
                  <TextInput
                    label="Especifique 'Outros'"
                    id="otherOccurrenceType"
                    name="otherOccurrenceType"
                    value={formData.otherOccurrenceType}
                    onChange={handleChange}
                    error={errors.otherOccurrenceType}
                  />
                </div>
              )}
            </div>
        </FormSection>

        <FormSection title="4. DESCRIÇÃO DETALHADA DO FATO">
             <TextAreaInput label="Relatar de forma objetiva, com sequência cronológica dos acontecimentos." id="detailedDescription" name="detailedDescription" value={formData.detailedDescription} onChange={handleChange} rows={5} required error={errors.detailedDescription} />
        </FormSection>

         <FormSection title="5. PESSOAS ENVOLVIDAS">
             <TextAreaInput label="Incluir nome, cargo/função e vínculo (alunos, funcionários, etc.)." id="involvedPeople" name="involvedPeople" value={formData.involvedPeople} onChange={handleChange} rows={3} required error={errors.involvedPeople} />
        </FormSection>
        
        <FormSection title="6. PROVIDÊNCIAS IMEDIATAS ADOTADAS">
             <TextAreaInput id="immediateActions" name="immediateActions" value={formData.immediateActions} onChange={handleChange} rows={3} required error={errors.immediateActions} />
        </FormSection>
        
        <FormSection title="7. ENCAMINHAMENTOS REALIZADOS">
             <TextAreaInput label="Órgãos da rede, familiares, equipe interna." id="referrals" name="referrals" value={formData.referrals} onChange={handleChange} rows={3} />
        </FormSection>

        <FormSection title="8. AVALIAÇÃO E OBSERVAÇÕES DO SERVIÇO SOCIAL (SE HOUVER)">
             <TextAreaInput id="socialServiceEvaluation" name="socialServiceEvaluation" value={formData.socialServiceEvaluation} onChange={handleChange} rows={3} />
        </FormSection>

        <div className="pt-4">
            <Button type="submit">
            Registrar Ocorrência
            </Button>
        </div>
      </form>
    </div>
  );
};

export default OccurrenceForm;