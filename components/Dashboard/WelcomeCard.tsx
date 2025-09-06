
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const InformationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gole-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gole-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm11 1a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1V4a1 1 0 011-1zM5.293 9.293a1 1 0 011.414 0L8 10.586l1.293-1.293a1 1 0 111.414 1.414L9.414 12l1.293 1.293a1 1 0 01-1.414 1.414L8 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L6.586 12 5.293 10.707a1 1 0 010-1.414zM15 9a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>;
const WifiOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gole-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-1.414-1.414a7 7 0 000-9.899m-1.414-1.415a5 5 0 00-7.072 0m-1.414-1.414a3 3 0 00-4.242 0M4 4l16 16" /></svg>;

const WelcomeCard: React.FC = () => {
    const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-gole-blue">
      <div className="flex items-start space-x-4">
        <InformationCircleIcon />
        <div>
          <h2 className="text-2xl font-bold text-gole-dark">{t('welcomeTitle')}</h2>
          <p className="text-gray-600 mt-1">{t('welcomeIntro')}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
                <SparklesIcon/>
                <h3 className="ml-2 font-semibold text-gole-dark">{t('aiCommentsTitle')}</h3>
            </div>
            <p className="text-sm text-gray-700 mt-1">{t('aiCommentsDesc')}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
                <WifiOffIcon />
                <h3 className="ml-2 font-semibold text-gole-dark">{t('offlineResearchTitle')}</h3>
            </div>
            <p className="text-sm text-gray-700 mt-1">{t('offlineResearchDesc')}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
