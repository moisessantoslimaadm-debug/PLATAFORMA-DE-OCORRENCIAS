import React from 'react';

const ThankYouPage: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-100 z-[100] flex flex-col items-center justify-center animate-fade-in p-4">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
          Obrigado pela visita!
        </h1>
        <p className="text-md md:text-lg text-gray-600 mt-4">
          Sessão encerrada com sucesso. Até a próxima!
        </p>
        <div className="mt-8">
          <img
            src="https://media.tenor.com/3_n25yVGS6YAAAAM/dancing-dance.gif"
            alt="Carlton Banks dancing"
            className="mx-auto rounded-lg shadow-xl"
            style={{ maxWidth: '300px', width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
