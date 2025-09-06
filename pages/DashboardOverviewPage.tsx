import React from 'react';
import StatCard from '../components/Dashboard/StatCard';
import ParticipationChart from '../components/Dashboard/ParticipationChart';
import FileUpload from '../components/Dashboard/FileUpload';
import Feed from '../components/Dashboard/Feed';
import { useTranslation } from '../hooks/useTranslation';
import { StatCardData } from '../types';
import WelcomeCard from '../components/Dashboard/WelcomeCard';
import CreatePost from '../components/Dashboard/CreatePost';

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

const DashboardOverviewPage: React.FC = () => {
    const { t } = useTranslation();

    const statCards: StatCardData[] = [
      { titleKey: 'communityGrowth', value: '1,250', icon: <UsersIcon />, color: 'text-gole-blue' },
      { titleKey: 'activeUsers', value: '980', icon: <ChartBarIcon />, color: 'text-gole-green' },
      { titleKey: 'reportsUploaded', value: '342', icon: <DocumentTextIcon />, color: 'text-gole-sand' },
      { titleKey: 'engagementRate', value: '78%', icon: <TrendingUpIcon />, color: 'text-gole-red' },
    ];

    return (
        <div className="space-y-6">
          <WelcomeCard />
          <h1 className="text-3xl font-bold text-gole-dark">{t('dashboard')}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {statCards.map((card, index) => <StatCard key={index} data={card} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ParticipationChart />
            </div>
            <div>
              <FileUpload />
            </div>
          </div>
          <div>
            <CreatePost />
            <Feed />
          </div>
        </div>
    );
}

export default DashboardOverviewPage;