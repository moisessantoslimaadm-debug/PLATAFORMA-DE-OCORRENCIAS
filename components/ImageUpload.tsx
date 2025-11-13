import React, { useRef } from 'react';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ImageUploadProps {
  imageUrl?: string;
  onChange: (base64Url?: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check for file size (e.g., 2MB limit)
      if (file.size > 2 * 1024 * 1024) {
          alert('A imagem é muito grande. O tamanho máximo é 2MB.');
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    fileInputRef.current?.click();
  };
  
  const removeImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(undefined);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <div
        className="relative w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-2 cursor-pointer group"
        onClick={triggerFileInput}
      >
        {imageUrl ? (
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
       {!imageUrl && (
        <button type="button" onClick={triggerFileInput} className="text-sm text-center text-gray-600 border border-dashed border-gray-400 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors">
            Carregar foto
        </button>
      )}
    </div>
  );
};