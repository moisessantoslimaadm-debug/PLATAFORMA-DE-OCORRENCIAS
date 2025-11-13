import React from 'react';
import { Toast as ToastType } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CloseIcon } from './icons/CloseIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ToastProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    bg: 'bg-green-600',
    icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
  },
  error: {
    bg: 'bg-red-600',
    icon: <XCircleIcon className="h-6 w-6 text-white" />,
  },
};

const Toast: React.FC<ToastProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm space-y-3">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        return (
          <div
            key={toast.id}
            className={`${config.bg} text-white p-4 rounded-lg shadow-2xl flex items-center justify-between animate-fade-in-right`}
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">{config.icon}</div>
              <div className="ml-3">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => onClose(toast.id)}
              className="ml-4 -mr-1 p-1 rounded-full hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Fechar"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;