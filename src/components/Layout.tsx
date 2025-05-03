import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hammer, Layers, Home, Info } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-forge-medium shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Hammer className="h-8 w-8 text-accent-500" />
            <span className="text-2xl font-bold text-white">Digit<span className="text-accent-500">Forge</span></span>
          </Link>
          
          <nav className="flex space-x-1 sm:space-x-4">
            <NavLink to="/" current={location.pathname === "/"}>
              <Home className="h-5 w-5 mr-1" />
              <span className="hidden md:inline">Accueil</span>
            </NavLink>
            <NavLink to="/generator" current={location.pathname === "/generator"}>
              <Layers className="h-5 w-5 mr-1" />
              <span className="hidden md:inline">Générateur</span>
            </NavLink>
            <NavLink to="/about" current={location.pathname === "/about"}>
              <Info className="h-5 w-5 mr-1" />
              <span className="hidden md:inline">À propos</span>
            </NavLink>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-forge-medium py-4 text-center text-gray-400 text-sm">
        <div className="container mx-auto px-4">
          <p>© 2025 DigitForge. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  current: boolean;
  children: ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, current, children }) => {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md flex items-center transition-colors ${
        current 
          ? 'bg-forge-light text-white' 
          : 'text-gray-300 hover:bg-forge-light hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};

export default Layout;