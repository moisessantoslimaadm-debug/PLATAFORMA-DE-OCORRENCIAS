import React, { useState } from 'react';
import { Button } from './Button';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

// ATENÇÃO: A senha está visível no código-fonte.
// Isso serve apenas como uma barreira de conveniência.
const CORRECT_PASSWORD = 'itaberaba2024';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="px-6 py-8">
          <div className="text-center text-gray-600 mb-6">
            <p className="font-semibold">Prefeitura Municipal de Itaberaba</p>
            <p className="text-sm">Secretaria Municipal de Educação – SMED</p>
            <p className="text-sm">Coordenação de Gestão do Ensino e de Ações Socioeducativas</p>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-700">Acesso Restrito</h2>
          <p className="mt-1 text-center text-gray-500">
            Plataforma de Registro de Ocorrências
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="w-full">
              <input
                className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg focus:ring-opacity-40 focus:outline-none focus:ring ${
                  error
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-300'
                    : 'border-gray-200 focus:border-emerald-400 focus:ring-emerald-300'
                }`}
                type="password"
                placeholder="Senha de Acesso"
                aria-label="Senha de Acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            
            {error && (
                <p className="mt-2 text-xs text-center text-red-600">{error}</p>
            )}

            <div className="mt-6">
                <Button type="submit">
                    Entrar
                </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;