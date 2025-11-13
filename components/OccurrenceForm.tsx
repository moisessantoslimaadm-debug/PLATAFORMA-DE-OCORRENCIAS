import React, { useState, useEffect } from 'react';
import { Occurrence, OccurrenceType } from '../types';
import { SelectInput } from './SelectInput';
import { TextAreaInput } from './TextAreaInput';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { SCHOOL_UNITS, OCCURRENCE_TYPES } from '../constants';
import { CheckboxInput } from './CheckboxInput';

interface OccurrenceFormProps {
  onSubmit: (data: Omit<Occurrence, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
}

const initialFormData = {
  schoolUnit: SCHOOL_UNITS[0],
  municipality: 'Itaberaba',
  uf: 'BA',
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const type = value as OccurrenceType;
    setFormData(prev => {
      const newTypes = checked
        ? [...prev.occurrenceTypes, type]
        : prev.occurrenceTypes.filter(t => t !== type);
      return { ...prev, occurrenceTypes: newTypes };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialFormData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-lime-200">
      <h2 className="text-2xl font-bold text-lime-800 mb-6">Nova Ficha de Ocorrência</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="border border-gray-300 p-4 rounded-md">
          <legend className="px-2 font-semibold text-lime-700">Dados da Unidade</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput label="Unidade Escolar" id="schoolUnit" name="schoolUnit" value={formData.schoolUnit} onChange={handleChange}>
              {SCHOOL_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
            </SelectInput>
            <TextInput label="Município" id="municipality" name="municipality" value={formData.municipality} onChange={handleChange} />
            <TextInput label="UF" id="uf" name="uf" value={formData.uf} onChange={handleChange} />
            <TextInput label="Data de Preenchimento" id="fillingDate" name="fillingDate" type="date" value={formData.fillingDate} onChange={handleChange} />
            <TextInput label="Horário" id="fillingTime" name="fillingTime" type="time" value={formData.fillingTime} onChange={handleChange} />
          </div>
        </fieldset>
        
        <fieldset className="border border-gray-300 p-4 rounded-md">
          <legend className="px-2 font-semibold text-lime-700">1. Identificação do Aluno Envolvido</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Nome Completo" id="student.fullName" name="fullName" value={formData.student.fullName} onChange={e => handleChange(e, 'student')} required />
            <TextInput label="Data de Nascimento" id="student.birthDate" name="birthDate" type="date" value={formData.student.birthDate} onChange={e => handleChange(e, 'student')} />
            <TextInput label="Idade" id="student.age" name="age" type="number" value={formData.student.age} onChange={e => handleChange(e, 'student')} readOnly className="bg-gray-100" />
            <TextInput label="Ano/Série" id="student.grade" name="grade" value={formData.student.grade} onChange={e => handleChange(e, 'student')} />
            <TextInput label="Turno" id="student.shift" name="shift" value={formData.student.shift} onChange={e => handleChange(e, 'student')} />
            <TextInput label="Nº de Matrícula" id="student.enrollmentId" name="enrollmentId" value={formData.student.enrollmentId} onChange={e => handleChange(e, 'student')} />
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 p-4 rounded-md">
          <legend className="px-2 font-semibold text-lime-700">2. Responsável Legal</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Nome Completo" id="guardian.fullName" name="fullName" value={formData.guardian.fullName} onChange={e => handleChange(e, 'guardian')} />
            <TextInput label="Parentesco" id="guardian.relationship" name="relationship" value={formData.guardian.relationship} onChange={e => handleChange(e, 'guardian')} />
            <TextInput label="Contato Telefônico" id="guardian.phone" name="phone" value={formData.guardian.phone} onChange={e => handleChange(e, 'guardian')} />
            <TextInput label="Endereço Completo" id="guardian.address" name="address" value={formData.guardian.address} onChange={e => handleChange(e, 'guardian')} className="md:col-span-2" />
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 p-4 rounded-md">
          <legend className="px-2 font-semibold text-lime-700">3. Caracterização da Ocorrência</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Data da Ocorrência" id="occurrenceDate" name="occurrenceDate" type="date" value={formData.occurrenceDate} onChange={handleChange} required />
              <TextInput label="Horário Aproximado" id="occurrenceTime" name="occurrenceTime" type="time" value={formData.occurrenceTime} onChange={handleChange} />
              <TextInput label="Local onde ocorreu" id="location" name="location" value={formData.location} onChange={handleChange} className="md:col-span-2" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ocorrência:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OCCURRENCE_TYPES.map(type => (
                  <CheckboxInput
                    key={type}
                    id={`type-${type}`}
                    label={type}
                    value={type}
                    checked={formData.occurrenceTypes.includes(type)}
                    onChange={handleCheckboxChange}
                  />
                ))}
              </div>
               {formData.occurrenceTypes.includes(OccurrenceType.OTHER) && (
                <TextInput
                  label="Especifique 'Outros'"
                  id="otherOccurrenceType"
                  name="otherOccurrenceType"
                  value={formData.otherOccurrenceType}
                  onChange={handleChange}
                  className="mt-2"
                />
              )}
            </div>
        </fieldset>

        <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="px-2 font-semibold text-lime-700">4. Descrição Detalhada do Fato</legend>
             <TextAreaInput label="Relatar de forma objetiva, com sequência cronológica dos acontecimentos." id="detailedDescription" name="detailedDescription" value={formData.detailedDescription} onChange={handleChange} rows={5} required />
        </fieldset>

         <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="px-2 font-semibold text-lime-700">5. Pessoas Envolvidas</legend>
             <TextAreaInput label="Incluir nome, cargo/função e vínculo (alunos, funcionários, etc.)." id="involvedPeople" name="involvedPeople" value={formData.involvedPeople} onChange={handleChange} rows={3} />
        </fieldset>
        
        <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="px-2 font-semibold text-lime-700">6. Providências Imediatas Adotadas</legend>
             <TextAreaInput id="immediateActions" name="immediateActions" value={formData.immediateActions} onChange={handleChange} rows={3} />
        </fieldset>
        
        <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="px-2 font-semibold text-lime-700">7. Encaminhamentos Realizados</legend>
             <TextAreaInput label="Órgãos da rede, familiares, equipe interna." id="referrals" name="referrals" value={formData.referrals} onChange={handleChange} rows={3} />
        </fieldset>

        <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="px-2 font-semibold text-lime-700">8. Avaliação e Observações do Serviço Social (se houver)</legend>
             <TextAreaInput id="socialServiceEvaluation" name="socialServiceEvaluation" value={formData.socialServiceEvaluation} onChange={handleChange} rows={3} />
        </fieldset>

        <Button type="submit">
          Registrar Ocorrência
        </Button>
      </form>
    </div>
  );
};

export default OccurrenceForm;