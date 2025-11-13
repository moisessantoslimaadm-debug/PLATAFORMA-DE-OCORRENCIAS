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
import { ImageUpload } from './ImageUpload';

interface EditOccurrenceModalProps {
  isOpen: boolean;
  occurrence: Occurrence;
  onClose: () => void;
  onSave: (occurrence: Occurrence) => void;
}

const formatPhoneNumber = (value: string) => {
    if (!value) return '';
    let digitsOnly = value.replace(/\D/g, '').slice(0, 11);
    
    if (digitsOnly.length <= 2) {
        return `(${digitsOnly}`;
    }
    if (digitsOnly.length <= 6) {
        return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2)}`;
    }
    if (digitsOnly.length <= 10) {
        return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 6)}-${digitsOnly.slice(6)}`;
    }
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 7)}-${digitsOnly.slice(7, 11)}`;
};

const EditOccurrenceModal: React.FC<EditOccurrenceModalProps> = ({ isOpen, occurrence, onClose, onSave }) => {
  const [formData, setFormData] = useState(occurrence);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    setFormData(occurrence);
    setErrors({}); // Reset errors when a new occurrence is opened
    setHasSubmitted(false);
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
        } else {
            setFormData(prev => ({ ...prev, student: { ...prev.student, age: '' } }));
        }
    }
  }, [formData.student.birthDate]);

  useEffect(() => {
    if (hasSubmitted) {
        setErrors(validateOccurrence(formData));
    }
  }, [formData, hasSubmitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section?: keyof typeof occurrence) => {
    const { name, value } = e.target;
    
    if (section === 'guardian' && name === 'phone') {
        setFormData(prev => ({
            ...prev,
            guardian: {
                ...prev.guardian,
                phone: formatPhoneNumber(value),
            },
        }));
        return;
    }

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
    setHasSubmitted(true);
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
          <h2 className="text-xl font-bold text-gray-800">Editar Ficha de Ocorrência</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Fechar modal">
             <CloseIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <SelectInput label="Unidade Escolar" id="schoolUnit-edit" name="schoolUnit" value={formData.schoolUnit} onChange={handleChange} error={errors.schoolUnit} required>
                    {SCHOOL_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                </SelectInput>
              </div>
              <div className="md:col-span-2">
                <TextInput label="Município" id="municipality-edit" name="municipality" value={formData.municipality} onChange={handleChange} />
              </div>
              <TextInput label="UF" id="uf-edit" name="uf" value={formData.uf} onChange={handleChange} />
              <TextInput label="Data de Preenchimento" id="fillingDate-edit" name="fillingDate" type="date" value={formData.fillingDate} onChange={handleChange} />
              <TextInput label="Horário" id="fillingTime-edit" name="fillingTime" type="time" value={formData.fillingTime} onChange={handleChange} />
            </div>
          
            <h3 className="text-lg font-semibold text-gray-700 pt-2 border-b pb-2">1. Identificação do Aluno</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
               <div className="flex flex-col items-center justify-center md:col-span-1">
                  <ImageUpload
                      imageUrl={formData.student.photoUrl}
                      onChange={(base64Url) =>
                          setFormData(prev => ({
                              ...prev,
                              student: { ...prev.student, photoUrl: base64Url }
                          }))
                      }
                  />
              </div>
              <div className="md:col-span-2 space-y-4">
                  <TextInput label="Nome Completo" id="student.fullName-edit" name="fullName" value={formData.student.fullName} onChange={e => handleChange(e, 'student')} required error={errors.student?.fullName} />
                  <div className="grid grid-cols-2 gap-4">
                      <TextInput label="Data de Nascimento" id="student.birthDate-edit" name="birthDate" type="date" value={formData.student.birthDate} onChange={e => handleChange(e, 'student')} required error={errors.student?.birthDate} />
                      <TextInput label="Idade" id="student.age-edit" name="age" type="number" value={formData.student.age} readOnly placeholder="Automático" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <TextInput label="Nº de Matrícula" id="student.enrollmentId-edit" name="enrollmentId" value={formData.student.enrollmentId} onChange={e => handleChange(e, 'student')} />
                      <TextInput label="Ano/Série" id="student.grade-edit" name="grade" value={formData.student.grade} onChange={e => handleChange(e, 'student')} required error={errors.student?.grade} />
                  </div>
                  <TextInput label="Turno" id="student.shift-edit" name="shift" value={formData.student.shift} onChange={e => handleChange(e, 'student')} required error={errors.student?.shift} />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-700 pt-2 border-b pb-2">2. Responsável Legal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Nome Completo" id="guardian.fullName-edit" name="fullName" value={formData.guardian.fullName} onChange={e => handleChange(e, 'guardian')} required error={errors.guardian?.fullName} />
                <TextInput label="Parentesco" id="guardian.relationship-edit" name="relationship" value={formData.guardian.relationship} onChange={e => handleChange(e, 'guardian')} />
                <TextInput label="Contato Telefônico" id="guardian.phone-edit" name="phone" value={formData.guardian.phone} onChange={e => handleChange(e, 'guardian')} required error={errors.guardian?.phone} maxLength={15} placeholder="(XX) XXXXX-XXXX" />
                <TextInput label="Endereço Completo" id="guardian.address-edit" name="address" value={formData.guardian.address} onChange={e => handleChange(e, 'guardian')} className="md:col-span-2" required error={errors.guardian?.address}/>
            </div>

            <h3 className="text-lg font-semibold text-gray-700 pt-2 border-b pb-2">3. Caracterização da Ocorrência</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Data da Ocorrência" id="occurrenceDate-edit" name="occurrenceDate" type="date" value={formData.occurrenceDate} onChange={handleChange} required error={errors.occurrenceDate} />
                <TextInput label="Horário Aproximado" id="occurrenceTime-edit" name="occurrenceTime" type="time" value={formData.occurrenceTime} onChange={handleChange} required error={errors.occurrenceTime} />
                <TextInput label="Local onde ocorreu" id="location-edit" name="location" value={formData.location} onChange={handleChange} className="md:col-span-2" required error={errors.location} />
            </div>
            <div className="mt-4">
              <MultiSelectTagInput
                label="Tipo de Ocorrência"
                id="occurrenceTypes-edit"
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
                    id="otherOccurrenceType-edit"
                    name="otherOccurrenceType"
                    value={formData.otherOccurrenceType}
                    onChange={handleChange}
                    error={errors.otherOccurrenceType}
                  />
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-700 pt-2 border-b pb-2">4. Descrição, Providências e Encaminhamentos</h3>
            <TextAreaInput label="Descrição Detalhada do Fato" id="detailedDescription-edit" name="detailedDescription" value={formData.detailedDescription} onChange={handleChange} rows={4} required error={errors.detailedDescription} />
            <TextAreaInput label="Pessoas Envolvidas" id="involvedPeople-edit" name="involvedPeople" value={formData.involvedPeople} onChange={handleChange} rows={2} required error={errors.involvedPeople} />
            <TextAreaInput label="Providências Imediatas Adotadas" id="immediateActions-edit" name="immediateActions" value={formData.immediateActions} onChange={handleChange} rows={2} required error={errors.immediateActions} />
            <TextAreaInput label="Encaminhamentos Realizados" id="referrals-edit" name="referrals" value={formData.referrals} onChange={handleChange} rows={2} />
            <TextAreaInput label="Avaliação do Serviço Social" id="socialServiceEvaluation-edit" name="socialServiceEvaluation" value={formData.socialServiceEvaluation} onChange={handleChange} rows={2} />
            <TextAreaInput label="Observações Gerais (Opcional)" id="observations-edit" name="observations" value={formData.observations} onChange={handleChange} rows={2} />
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <Button type="submit" className="w-auto">Salvar Alterações</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOccurrenceModal;