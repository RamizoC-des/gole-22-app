

import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { generateInsight } from '../services/geminiService';

const SparklesIcon = () => <svg className="w-6 h-6 text-gole-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm11 1a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1V4a1 1 0 011-1zM5.293 9.293a1 1 0 011.414 0L8 10.586l1.293-1.293a1 1 0 111.414 1.414L9.414 12l1.293 1.293a1 1 0 01-1.414 1.414L8 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L6.586 12 5.293 10.707a1 1 0 010-1.414zM15 9a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>;

// FIX: Define an interface for the insight object to include the optional 'isNew' property.
interface Insight {
  titleKey: string;
  summaryKey: string;
  isNew?: boolean;
}

const DataInsightsPage: React.FC = () => {
  const { t } = useTranslation();
  // FIX: Explicitly type the state with the Insight interface.
  const [insights, setInsights] = useState<Insight[]>([
    { titleKey: 'insightTitle1', summaryKey: 'insightSummary1' },
    { titleKey: 'insightTitle2', summaryKey: 'insightSummary2' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateInsight = async () => {
    setIsLoading(true);
    const mockCommunityData = "Recent community reports show increased youth attendance at workshops but lower engagement in sports. Women's groups in coastal areas are successfully launching farming co-ops, while central regions report a need for financial training.";
    const newInsightSummary = await generateInsight(mockCommunityData);
    
    setInsights(prev => [{ titleKey: 'Newly Generated AI Insight', summaryKey: newInsightSummary, isNew: true }, ...prev]);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gole-dark">{t('dataInsightsTitle')}</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{t('dataInsightsDescription')}</p>
        <button 
          onClick={handleGenerateInsight} 
          disabled={isLoading}
          className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gole-green hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gole-green disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('generatingInsights')}
              </>
          ) : (
             <>
                <SparklesIcon/>
                <span className="ml-2">{t('generateNewInsightButton')}</span>
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105">
            <div className="flex items-center mb-2">
                <SparklesIcon />
                <h3 className="ml-2 text-xl font-bold text-gole-dark">
                    {'isNew' in insight && insight.isNew ? insight.titleKey : t(insight.titleKey)}
                </h3>
            </div>
            <p className="text-gray-700">
                {'isNew' in insight && insight.isNew ? insight.summaryKey : t(insight.summaryKey)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataInsightsPage;