import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const { t } = useTranslation();

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log(`Password reset link sent to ${email}`);
      setLinkSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gole-sand p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 relative">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gole-blue">{t('appName')}</h1>
        </div>
        
        <h2 className="text-2xl font-semibold text-center text-gole-green mb-4">{t('forgotPasswordTitle')}</h2>

        {!linkSent ? (
          <form onSubmit={handleSendLink}>
            <p className="text-center text-gray-600 mb-6">{t('forgotPasswordInstructions')}</p>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                {t('emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gole-green"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gole-red hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 text-lg"
            >
              {t('sendResetLinkButton')}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-gole-green font-semibold mb-6">{t('checkEmail')}</p>
          </div>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link to="/login" className="font-medium text-gole-blue hover:underline">
            {t('backToSignIn')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
