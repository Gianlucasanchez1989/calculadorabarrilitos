import React from 'react';
import Calculator from './components/Calculator';

const App: React.FC = () => {
  return (
    <main className="bg-slate-900 min-h-screen text-slate-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500 mb-2">
            Calculadora de barriles
          </h1>
          <p className="text-slate-400 text-lg">
            Viví la experiencia perfecta con la cantidad ideal de bebida - by Pump Barrilito
          </p>
        </header>
        <Calculator />
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Creado por Gianluca Sanchez para <strong className="font-bold">PUMP Barrilito</strong>.</p>
        </footer>
      </div>
    </main>
  );
};

export default App;