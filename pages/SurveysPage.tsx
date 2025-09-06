
import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useData } from '../contexts/DataContext';
import { Survey } from '../types';

const SurveysPage: React.FC = () => {
  const { t } = useTranslation();
  const { surveys, addSurvey, currentUser } = useData();
  
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSurvey: Survey = {
      id: `s${Date.now()}`,
      title,
      question,
      createdBy: currentUser.id,
      options: options.filter(opt => opt.trim() !== '').map((opt, i) => ({ id: `o${i}`, text: opt, votes: 0 })),
    };
    if (newSurvey.options.length < 2) {
        alert("Please provide at least two valid options.");
        return;
    }
    addSurvey(newSurvey);
    // Reset form
    setTitle('');
    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gole-dark mb-4">{t('createSurveyTitle')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="survey-title" className="block text-sm font-bold text-gray-700 mb-1">{t('surveyTitleLabel')}</label>
            <input type="text" id="survey-title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-gole-blue focus:border-gole-blue"/>
          </div>
          <div>
            <label htmlFor="survey-question" className="block text-sm font-bold text-gray-700 mb-1">{t('surveyQuestionLabel')}</label>
            <input type="text" id="survey-question" value={question} onChange={e => setQuestion(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-gole-blue focus:border-gole-blue"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('surveyOptionsLabel')}</label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="text" value={option} onChange={e => handleOptionChange(index, e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-gole-blue focus:border-gole-blue"/>
                  <button type="button" onClick={() => handleRemoveOption(index)} disabled={options.length <= 2} className="px-3 py-2 text-white bg-gole-red rounded-md hover:bg-red-800 disabled:bg-gray-300">&times;</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddOption} className="mt-2 text-sm font-semibold text-gole-blue hover:underline">{t('addOptionButton')}</button>
          </div>
          <button type="submit" className="w-full bg-gole-green hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300">{t('createSurveyButton')}</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gole-dark mb-4">{t('yourSurveysTitle')}</h2>
        <div className="space-y-6">
          {surveys.map(survey => {
            const totalVotes = survey.options.reduce((sum, opt) => sum + opt.votes, 0);
            return (
              <div key={survey.id} className="border-b pb-4 last:border-b-0">
                <h3 className="font-bold text-lg text-gole-dark">{survey.title}</h3>
                <p className="text-gray-700 mb-3">{survey.question}</p>
                <div className="space-y-2">
                  {survey.options.map(option => {
                    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                    return (
                      <div key={option.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-800">{option.text}</span>
                          <span className="text-gray-500">{option.votes} votes ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-gole-blue h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SurveysPage;
