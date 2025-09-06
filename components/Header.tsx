
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
    onMenuClick: () => void;
}

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-4">
            <button
                onClick={onMenuClick}
                className="md:hidden text-gray-600 hover:text-gole-blue"
                aria-label="Open navigation menu"
            >
                <MenuIcon />
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gole-blue">{t('appName')}</h1>
              <p className="hidden md:block text-sm text-gray-500">{t('tagline')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSwitcher />
            <button
              onClick={logout}
              className="px-3 sm:px-4 py-2 text-sm sm:text-md font-semibold text-white bg-gole-red rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gole-red transition-all duration-200"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;