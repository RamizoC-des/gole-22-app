
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { StatCardData } from '../../types';

interface StatCardProps {
    data: StatCardData;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const { t } = useTranslation();
  const { titleKey, value, icon, color } = data;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:-translate-y-1">
      <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('text-', 'bg-')}`}>
        <span className={color}>{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{t(titleKey)}</p>
        <p className="text-2xl font-bold text-gole-dark">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
