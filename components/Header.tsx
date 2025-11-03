import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[var(--primary)] text-white w-full shadow-sm">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-4 px-6 lg:px-8">
        <a href="/" className="text-xl md:text-2xl tracking-tight font-black">
          PUMP
        </a>
        <nav className="flex items-center space-x-6 md:space-x-8">
          <a href="https://barrilesya.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-sm md:text-base font-medium hover:opacity-80 transition-opacity">
            BarrilesYA!
          </a>
          <a href="https://pumpbarrilito.carrd.co" target="_blank" rel="noopener noreferrer" className="text-sm md:text-base font-medium hover:opacity-80 transition-opacity">
            Web
          </a>
          <a href="https://www.instagram.com/pumpbarrilito/" target="_blank" rel="noopener noreferrer" className="text-sm md:text-base font-medium hover:opacity-80 transition-opacity">
            Instagram
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
