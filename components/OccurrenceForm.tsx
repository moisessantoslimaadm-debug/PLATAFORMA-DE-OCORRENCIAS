import React, { useState, useEffect } from 'react';
import { Occurrence, OccurrenceType } from '../types';
import { SelectInput } from './SelectInput';
import { TextAreaInput } from './TextAreaInput';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { SCHOOL_UNITS, OCCURRENCE_TYPES } from '../constants';
import { validateOccurrence, ValidationErrors, validateStep } from '../utils/validation';
import { MultiSelectTagInput } from './MultiSelectTagInput';
import { FormTabs } from './FormTabs';
import { ImageUpload } from './ImageUpload';

interface OccurrenceFormProps {
  onSubmit: (data: Omit<Occurrence, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'auditLog'>) => void;
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
    photoUrl: '',
  },
  guardian: {
    fullName: '',
    relationship: '',
    phone: '',
    address: '',
  },
  occurrenceDate: new Date().toISOString().split('T')[0],
  occurrenceTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  location: '',
  occurrenceTypes: [] as OccurrenceType[],
  otherOccurrenceType: '',
  detailedDescription: '',
  involvedPeople: '',
  immediateActions: '',
  referrals: '',
  socialServiceEvaluation: '',
  observations: '',
};

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

const OccurrenceForm: React.FC<OccurrenceFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [visitedSteps, setVisitedSteps] = useState(new Set([1]));
  
  const steps = [
    { name: 'Passo 1', description: 'Identificação do Aluno' },
    { name: 'Passo 2', description: 'Dados da Ocorrência' },
    { name: 'Passo 3', description: 'Relato e Providências' },
    { name: 'Passo 4', description: 'Finalização' },
  ];
  const totalSteps = steps.length;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section?: keyof typeof initialFormData) => {
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

  const handleClearStep1 = () => {
    setFormData(prev => ({
      ...prev,
      schoolUnit: initialFormData.schoolUnit,
      student: initialFormData.student,
    }));
    setErrors({});
  };
  
  const handleNext = () => {
    const stepErrors = validateStep(formData, currentStep);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0 && currentStep < totalSteps) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setVisitedSteps(prev => new Set(prev).add(nextStep));
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
        setErrors({});
        setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateOccurrence(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Find the first step with an error and navigate to it
      const firstErrorKey = Object.keys(validationErrors)[0];
      const firstSubErrorKey = (typeof validationErrors[firstErrorKey] === 'object') ? Object.keys(validationErrors[firstErrorKey] as object)[0] : '';
      const fullKey = firstSubErrorKey ? `${firstErrorKey}.${firstSubErrorKey}` : firstErrorKey;
      
      if (['schoolUnit', 'student.fullName', 'student.birthDate', 'student.grade', 'student.shift'].some(key => fullKey.startsWith(key.split('.')[0]))) setCurrentStep(1);
      else if (['guardian.fullName', 'guardian.phone', 'guardian.address', 'occurrenceDate', 'occurrenceTime', 'location', 'occurrenceTypes', 'otherOccurrenceType'].some(key => fullKey.startsWith(key.split('.')[0]))) setCurrentStep(2);
      else if (['detailedDescription', 'involvedPeople', 'immediateActions'].includes(firstErrorKey)) setCurrentStep(3);
      return;
    }
    setErrors({});
    onSubmit(formData);
    setFormData(initialFormData);
    setCurrentStep(1);
    setVisitedSteps(new Set([1]));
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-white/30 animate-fade-in max-w-5xl mx-auto">
      <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            Ficha de Registro de Ocorrência
          </h1>
          <p className="text-md text-gray-500 mt-1">
            Preencha os campos abaixo para documentar uma nova ocorrência.
          </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
           <FormTabs 
              steps={steps} 
              currentStep={currentStep} 
              visitedSteps={visitedSteps}
              setCurrentStep={setCurrentStep}
            />
        </aside>

        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div key={currentStep} className="animate-fade-in min-h-[500px]">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-gray-700">Cabeçalho e Identificação do Aluno</h2>
                    <button
                      type="button"
                      onClick={handleClearStep1}
                      className="text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md px-2 py-1 transition-colors font-medium"
                      title="Limpar campos do cabeçalho e do aluno"
                    >
                      Limpar Campos
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-6">
                      <SelectInput label="Unidade Escolar" id="schoolUnit" name="schoolUnit" value={formData.schoolUnit} onChange={handleChange} error={errors.schoolUnit} required>
                      {SCHOOL_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                      </SelectInput>
                    </div>
                    <div className="md:col-span-4"><TextInput label="Município" id="municipality" name="municipality" value={formData.municipality} onChange={handleChange} /></div>
                    <div className="md:col-span-2"><TextInput label="UF" id="uf" name="uf" value={formData.uf} onChange={handleChange} /></div>
                    <div className="md:col-span-3"><TextInput label="Data de Preenchimento" id="fillingDate" name="fillingDate" type="date" value={formData.fillingDate} onChange={handleChange} /></div>
                    <div className="md:col-span-3"><TextInput label="Horário" id="fillingTime" name="fillingTime" type="time" value={formData.fillingTime} onChange={handleChange} /></div>
                  </div>
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
                          <TextInput label="Nome Completo do Aluno" id="student.fullName" name="fullName" value={formData.student.fullName} onChange={e => handleChange(e, 'student')} required error={errors.student?.fullName} />
                          <div className="grid grid-cols-2 gap-4">
                              <TextInput label="Data de Nascimento" id="student.birthDate" name="birthDate" type="date" value={formData.student.birthDate} onChange={e => handleChange(e, 'student')} required error={errors.student?.birthDate} />
                              <TextInput label="Idade (anos)" id="student.age" name="age" type="number" value={formData.student.age} readOnly placeholder="Automático" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <TextInput label="Nº de Matrícula" id="student.enrollmentId" name="enrollmentId" value={formData.student.enrollmentId} onChange={e => handleChange(e, 'student')} />
                              <TextInput label="Ano/Série" id="student.grade" name="grade" value={formData.student.grade} onChange={e => handleChange(e, 'student')} required error={errors.student?.grade} />
                          </div>
                          <TextInput label="Turno" id="student.shift" name="shift" value={formData.student.shift} onChange={e => handleChange(e, 'student')} required error={errors.student?.shift} />
                      </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Responsável e Detalhes da Ocorrência</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput label="Nome Completo do Responsável" id="guardian.fullName" name="fullName" value={formData.guardian.fullName} onChange={e => handleChange(e, 'guardian')} required error={errors.guardian?.fullName}/>
                        <TextInput label="Parentesco" id="guardian.relationship" name="relationship" value={formData.guardian.relationship} onChange={e => handleChange(e, 'guardian')} />
                        <TextInput label="Contato Telefônico" id="guardian.phone" name="phone" value={formData.guardian.phone} onChange={e => handleChange(e, 'guardian')} required error={errors.guardian?.phone} maxLength={15} placeholder="(XX) XXXXX-XXXX"/>
                        <TextInput label="Endereço Completo" id="guardian.address" name="address" value={formData.guardian.address} onChange={e => handleChange(e, 'guardian')} className="md:col-span-2" required error={errors.guardian?.address} />
                    </div>
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput label="Data da Ocorrência" id="occurrenceDate" name="occurrenceDate" type="date" value={formData.occurrenceDate} onChange={handleChange} required error={errors.occurrenceDate} />
                        <TextInput label="Horário Aproximado" id="occurrenceTime" name="occurrenceTime" type="time" value={formData.occurrenceTime} onChange={handleChange} required error={errors.occurrenceTime} />
                        <TextInput label="Local onde ocorreu" id="location" name="location" value={formData.location} onChange={handleChange} className="md:col-span-2" required error={errors.location} />
                      </div>
                      <div>
                        <MultiSelectTagInput label="Tipo de Ocorrência" id="occurrenceTypes" options={OCCURRENCE_TYPES} selectedOptions={formData.occurrenceTypes} onChange={(selected) => setFormData(prev => ({ ...prev, occurrenceTypes: selected }))} error={errors.occurrenceTypes} required />
                        {formData.occurrenceTypes.includes(OccurrenceType.OTHER) && (
                          <div className="mt-4">
                            <TextInput label="Especifique 'Outros'" id="otherOccurrenceType" name="otherOccurrenceType" value={formData.otherOccurrenceType} onChange={handleChange} error={errors.otherOccurrenceType} />
                          </div>
                        )}
                      </div>
                    </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Descrição, Envolvidos e Providências</h2>
                    <TextAreaInput label="Descrição detalhada do fato (Relatar de forma objetiva, com sequência cronológica)" id="detailedDescription" name="detailedDescription" value={formData.detailedDescription} onChange={handleChange} rows={5} required error={errors.detailedDescription} />
                    <TextAreaInput label="Pessoas envolvidas (Incluir nome, cargo/função e vínculo)" id="involvedPeople" name="involvedPeople" value={formData.involvedPeople} onChange={handleChange} rows={3} required error={errors.involvedPeople} />
                    <TextAreaInput label="Providências imediatas adotadas" id="immediateActions" name="immediateActions" value={formData.immediateActions} onChange={handleChange} rows={3} required error={errors.immediateActions} />
                    <TextAreaInput label="Encaminhamentos realizados (Órgãos da rede, familiares, equipe interna)" id="referrals" name="referrals" value={formData.referrals} onChange={handleChange} rows={3} />
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Avaliações Adicionais e Conclusão</h2>
                    <TextAreaInput label="Avaliação e observações do Serviço Social (se houver)" id="socialServiceEvaluation" name="socialServiceEvaluation" value={formData.socialServiceEvaluation} onChange={handleChange} rows={4} />
                    <TextAreaInput label="Observações Gerais (Opcional)" id="observations" name="observations" value={formData.observations} onChange={handleChange} rows={4} />
                </div>
              )}
            </div>

            <div className="pt-6 flex justify-between items-center">
              <div>
                {currentStep > 1 && (
                  <button type="button" onClick={handlePrev} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white">
                    Anterior
                  </button>
                )}
              </div>
              <div>
                {currentStep < totalSteps ? (
                  <button type="button" onClick={handleNext} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                    Próximo
                  </button>
                ) : (
                  <Button type="submit">
                    Registrar Ocorrência
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OccurrenceForm;