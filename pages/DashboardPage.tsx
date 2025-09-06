
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DashboardOverviewPage from './DashboardOverviewPage';
import SurveysPage from './SurveysPage';
import DataInsightsPage from './DataInsightsPage';
import CommunityPage from './CommunityPage';
import ProfileModal from '../components/Dashboard/ProfileModal';
import { useData } from '../contexts/DataContext';
import Footer from '../components/Footer';

const DashboardPage: React.FC = () => {
  const { currentUser } = useData();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gole-sand min-h-screen flex flex-col">
      <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          onProfileClick={() => setIsProfileModalOpen(true)} 
        />
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
            ></div>
        )}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
             <Routes>
                <Route path="/" element={<DashboardOverviewPage />} />
                <Route path="/surveys" element={<SurveysPage />} />
                <Route path="/data-insights" element={<DataInsightsPage />} />
                <Route path="/community" element={<CommunityPage />} />
            </Routes>
          </div>
        </main>
      </div>
      <Footer />
      {isProfileModalOpen && (
        <ProfileModal
          user={currentUser}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
