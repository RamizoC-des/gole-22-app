
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from '../../hooks/useTranslation';
import { ParticipationData } from '../../types';

const data: ParticipationData[] = [
  { name: 'Jan', Youth: 40, Women: 24, PWD: 10 },
  { name: 'Feb', Youth: 30, Women: 14, PWD: 22 },
  { name: 'Mar', Youth: 50, Women: 48, PWD: 20 },
  { name: 'Apr', Youth: 47, Women: 39, PWD: 25 },
  { name: 'May', Youth: 59, Women: 48, PWD: 31 },
  { name: 'Jun', Youth: 55, Women: 38, PWD: 29 },
];

const ParticipationChart: React.FC = () => {
    const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-80">
      <h3 className="text-lg font-semibold text-gole-dark mb-4">{t('participationTrends')}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Youth" fill="#2563eb" />
          <Bar dataKey="Women" fill="#3b82f6" />
          <Bar dataKey="PWD" fill="#93c5fd" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParticipationChart;