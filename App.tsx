import React from 'react';
import Calculator from './components/Calculator';

const App: React.FC = () => {
  return (
    <main className="bg-[var(--background)] min-h-screen text-[var(--text)] flex flex-col items-center p-4 py-12">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] mb-2">
            Calculadora de barriles
          </h1>
          <p className="text-[var(--text)] opacity-80 text-lg">
            Viví la experiencia perfecta con la cantidad ideal de bebida - by Pump Barrilito
          </p>
        </header>
        <Calculator />
        <footer className="text-center mt-12 text-[var(--text)] opacity-60 text-sm">
          <p>Creado por Gianluca Sanchez para <strong className="font-bold">PUMP Barrilito</strong>.</p>
        </footer>
      </div>
    </main>
  );
};

export default App;
