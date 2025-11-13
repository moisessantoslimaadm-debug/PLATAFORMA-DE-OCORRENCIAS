import React, { useState, useEffect } from 'react';
import { Occurrence, OccurrenceType } from '../types';
import { TextInput } from './TextInput';
import { TextAreaInput } from './TextAreaInput';
import { SelectInput } from './SelectInput';
import { Button } from './Button';
import { CloseIcon } from './icons/CloseIcon';
import { SCHOOL_UNITS, OCCURRENCE_TYPES } from '../constants';
import { validateOccurrence, ValidationErrors } from '../utils/validation';
import { MultiSelectTagInput } from './MultiSelectTagInput';

interface EditOccurrenceModalProps {
  isOpen: boolean;
  occurrence: Occurrence;
  onClose: () => void;
  onSave: (occurrence: Occurrence) => void;
}

const EditOccurrenceModal: React.FC<EditOccurrenceModalProps> = ({ isOpen, occurrence, onClose, onSave }) => {
  const [formData, setFormData] = useState(occurrence);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    setFormData(occurrence);
    setErrors({}); // Reset errors when a new occurrence is opened
  }, [occurrence]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section?: keyof typeof occurrence) => {
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateOccurrence(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-lime-800">Editar Ficha de Ocorrência</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Fechar modal">
             <CloseIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto">
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="px-2 font-semibold text-lime-700">Dados da Unidade</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectInput label="Unidade Escolar" id="schoolUnit" name="schoolUnit" value={formData.schoolUnit} onChange={handleChange} error={errors.schoolUnit}>
                {SCHOOL_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
              </SelectInput>
              <TextInput label="Município" id="municipality" name="municipality" value={formData.municipality} onChange={handleChange} />
              <TextInput label="UF" id="uf" name="uf" value={formData.uf} onChange={handleChange} />
              <TextInput label="Data de Preenchimento" id="fillingDate" name="fillingDate" type="date" value={formData.fillingDate} onChange={handleChange} />
              <TextInput label="Horário" id="fillingTime" name="fillingTime" type="time" value={formData.fillingTime} onChange={handleChange} />
            </div>
          </fieldset>
          
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="px-2 font-semibold text-lime-700">1. Identificação do Aluno</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput label="Nome Completo" id="student.fullName" name="fullName" value={formData.student.fullName} onChange={e => handleChange(e, 'student')} required className="md:col-span-2" error={errors.student?.fullName} />
              <TextInput label="Nº de Matrícula" id="student.enrollmentId" name="enrollmentId" value={formData.student.enrollmentId} onChange={e => handleChange(e, 'student')} />
              <TextInput label="Data de Nascimento" id="student.birthDate" name="birthDate" type="date" value={formData.student.birthDate} onChange={e => handleChange(e, 'student')} required error={errors.student?.birthDate} />
              <TextInput label="Idade" id="student.age" name="age" type="number" value={formData.student.age} onChange={e => handleChange(e, 'student')} readOnly className="bg-gray-100" />
              <TextInput label="Ano/Série" id="student.grade" name="grade" value={formData.student.grade} onChange={e => handleChange(e, 'student')} required error={errors.student?.grade} />
              <TextInput label="Turno" id="student.shift" name="shift" value={formData.student.shift} onChange={e => handleChange(e, 'student')} required error={errors.student?.shift} />
            </div>
          </fieldset>

          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="px-2 font-semibold text-lime-700">2. Responsável Legal</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Nome Completo" id="guardian.fullName" name="fullName" value={formData.guardian.fullName} onChange={e => handleChange(e, 'guardian')} required error={errors.guardian?.fullName} />
                <TextInput label="Parentesco" id="guardian.relationship" name="relationship" value={formData.guardian.relationship} onChange={e => handleChange(e, 'guardian')} />
                <TextInput label="Contato Telefônico" id="guardian.phone" name="phone" value={formData.guardian.phone} onChange={e => handleChange(e, 'guardian')} required error={errors.guardian?.phone} />
                <TextInput label="Endereço Completo" id="guardian.address" name="address" value={formData.guardian.address} onChange={e => handleChange(e, 'guardian')} className="md:col-span-2"/>
            </div>
          </fieldset>

          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="px-2 font-semibold text-lime-700">3. Caracterização da Ocorrência</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Data da Ocorrência" id="occurrenceDate" name="occurrenceDate" type="date" value={formData.occurrenceDate} onChange={handleChange} required error={errors.occurrenceDate} />
                <TextInput label="Horário Aproximado" id="occurrenceTime" name="occurrenceTime" type="time" value={formData.occurrenceTime} onChange={handleChange} required error={errors.occurrenceTime} />
                <TextInput label="Local onde ocorreu" id="location" name="location" value={formData.location} onChange={handleChange} className="md:col-span-2" required error={errors.location} />
            </div>
            <div className="mt-4">
              <MultiSelectTagInput
                label="Tipo de Ocorrência"
                id="occurrenceTypes-edit"
                options={OCCURRENCE_TYPES}
                selectedOptions={formData.occurrenceTypes}
                onChange={(selected) => setFormData(prev => ({ ...prev, occurrenceTypes: selected }))}
                error={errors.occurrenceTypes}
              />
              {formData.occurrenceTypes.includes(OccurrenceType.OTHER) && (
                <div className="mt-4">
                  <TextInput
                    label="Especifique 'Outros'"
                    id="otherOccurrenceType-edit"
                    name="otherOccurrenceType"
                    value={formData.otherOccurrenceType}
                    onChange={handleChange}
                    error={errors.otherOccurrenceType}
                  />
                </div>
              )}
            </div>
          </fieldset>

           <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="px-2 font-semibold text-lime-700">4. Descrição Detalhada do Fato</legend>
              <TextAreaInput label="Relatar de forma objetiva, com sequência cronológica." id="detailedDescription" name="detailedDescription" value={formData.detailedDescription} onChange={handleChange} rows={5} required error={errors.detailedDescription} />
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="px-2 font-semibold text-lime-700">5. Pessoas Envolvidas</legend>
              <TextAreaInput label="Incluir nome, cargo/função e vínculo." id="involvedPeople" name="involvedPeople" value={formData.involvedPeople} onChange={handleChange} rows={3} required error={errors.involvedPeople} />
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="px-2 font-semibold text-lime-700">6. Providências Imediatas Adotadas</legend>
              <TextAreaInput id="immediateActions" name="immediateActions" value={formData.immediateActions} onChange={handleChange} rows={3} required error={errors.immediateActions} />
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="px-2 font-semibold text-lime-700">7. Encaminhamentos Realizados</legend>
              <TextAreaInput label="Órgãos da rede, familiares, equipe interna." id="referrals" name="referrals" value={formData.referrals} onChange={handleChange} rows={3} />
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="px-2 font-semibold text-lime-700">8. Avaliação do Serviço Social</legend>
              <TextAreaInput id="socialServiceEvaluation" name="socialServiceEvaluation" value={formData.socialServiceEvaluation} onChange={handleChange} rows={3} />
          </fieldset>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOccurrenceModal;
