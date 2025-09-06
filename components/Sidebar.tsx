
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useData } from '../contexts/DataContext';

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const SurveysIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const InsightsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
const CommunityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

interface SidebarProps {
  onProfileClick: () => void;
  isMobileOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onProfileClick, isMobileOpen, onClose }) => {
  const { t } = useTranslation();
  const { currentUser } = useData();
  
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-md font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-gole-blue text-white shadow-md'
        : 'text-gray-600 hover:bg-gole-sand hover:text-gole-dark'
    }`;
    
  const handleProfileClick = () => {
    onClose();
    onProfileClick();
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-white p-4 flex-shrink-0 border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gole-dark pl-2">{t('appName')}</h2>
        <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gole-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div className="mb-8">
        <button 
          onClick={handleProfileClick}
          className="flex items-center w-full p-2 rounded-lg text-left hover:bg-gole-sand transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gole-blue"
          aria-label="View or edit your profile"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="ml-3 overflow-hidden">
            <p className="font-semibold text-gole-dark truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500">{t('editProfile')}</p>
          </div>
        </button>
      </div>

      <nav className="space-y-2">
        <NavLink to="/" end className={navLinkClasses} onClick={onClose}>
          <DashboardIcon />
          <span className="ml-3">{t('sidebarDashboard')}</span>
        </NavLink>
        <NavLink to="/surveys" className={navLinkClasses} onClick={onClose}>
          <SurveysIcon />
          <span className="ml-3">{t('sidebarSurveys')}</span>
        </NavLink>
        <NavLink to="/data-insights" className={navLinkClasses} onClick={onClose}>
          <InsightsIcon />
          <span className="ml-3">{t('sidebarDataInsights')}</span>
        </NavLink>
         <NavLink to="/community" className={navLinkClasses} onClick={onClose}>
          <CommunityIcon />
          <span className="ml-3">{t('sidebarCommunity')}</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
