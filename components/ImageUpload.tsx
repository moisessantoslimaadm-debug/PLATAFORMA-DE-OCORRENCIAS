import React, { useRef, useState } from 'react';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ImageUploadProps {
  imageUrl?: string;
  onChange: (base64Url?: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Formato inválido. Use PNG, JPG ou WEBP.');
      setIsLoading(false);
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError('A imagem é muito grande (máx 2MB).');
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
        setError('Falha ao ler o arquivo de imagem.');
        setIsLoading(false);
    };
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        setError('Arquivo de imagem corrompido ou inválido.');
        setIsLoading(false);
      };
      img.onload = () => {
        try {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error("Não foi possível obter o contexto 2D do canvas.");
            };

            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            onChange(compressedDataUrl);
        } catch(err) {
            console.error("Image processing error:", err);
            setError("Ocorreu um erro ao processar a imagem.");
        } finally {
            setIsLoading(false);
        }
      };
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      } else {
        setError('Conteúdo do arquivo não pôde ser lido.');
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };
  
  const removeImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(undefined);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        disabled={isLoading}
      />
      <div
        className={`relative w-32 h-32 rounded-full flex items-center justify-center text-gray-400 mb-2 group transition-all ${
          isLoading ? 'cursor-wait bg-slate-100' : 'cursor-pointer'
        } ${
          error ? 'border-2 border-red-400 bg-red-50' : 'bg-gray-200'
        }`}
        onClick={triggerFileInput}
        role="button"
        aria-label="Upload de foto do aluno"
      >
        {isLoading ? (
             <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        ) : imageUrl ? (
          <>
            <img src={imageUrl} alt="Foto do Aluno" className="w-full h-full object-cover rounded-full" />
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <button type="button" onClick={triggerFileInput} className="flex items-center gap-1 p-1 hover:bg-white/20 rounded-md w-24 justify-center mb-1">
                    <PencilIcon className="w-3 h-3"/> Alterar Foto
                </button>
                <button type="button" onClick={removeImage} className="flex items-center gap-1 p-1 hover:bg-white/20 rounded-md w-24 justify-center">
                    <TrashIcon className="w-3 h-3"/> Remover
                </button>
            </div>
          </>
        ) : (
          <UserCircleIcon className="w-24 h-24" />
        )}
      </div>
       {!imageUrl && !isLoading && (
        <button type="button" onClick={triggerFileInput} className="text-sm text-center text-gray-600 border border-dashed border-gray-400 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors">
            Carregar foto
        </button>
      )}
      {error && (
        <div className="mt-2 flex items-start gap-2 text-red-800 text-center w-full max-w-xs p-3 bg-red-100 rounded-lg border border-red-200">
            <XCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-600" />
            <p className="text-sm font-medium text-left">{error}</p>
        </div>
      )}
    </div>
  );
};
