import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import MockInbox from '../components/MockInbox';

const ConfirmationPage: React.FC = () => {
  const { state } = useLocation();
  const email = state?.email;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  
  const { login } = useAuth();
  const { confirmUser, resendConfirmationCode } = useData();
  const { t } = useTranslation();

  useEffect(() => {
    if (!email) {
        // Redirect to login if email is not available, maybe user landed here directly
        // For simplicity, we just show an error. In a real app, redirection is better.
        setError("No email address provided. Please start from the sign-up or login page.");
    }
  }, [email]);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6) {
        setError('Please enter the 6-digit code.');
        return;
    }
    setError('');
    setMessage('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
        const success = confirmUser(email, code);
        if (success) {
            login(); // This will trigger the redirect to the dashboard
        } else {
            setError(t('invalidCode'));
        }
        setIsLoading(false);
    }, 1000);
  };
  
  const handleResend = () => {
      setError('');
      setMessage('');
      resendConfirmationCode(email);
      setMessage(t('codeResent'));
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gole-sand p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 relative">
          <div className="absolute top-4 right-4">
            <LanguageSwitcher />
          </div>
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gole-blue">{t('appName')}</h1>
          </div>
          
          <h2 className="text-2xl font-semibold text-center text-gole-green mb-4">{t('confirmTitle')}</h2>

          <form onSubmit={handleConfirm}>
              <p className="text-center text-gray-600 mb-6">{t('confirmInstructions').replace('{email}', email || 'your email')}</p>
              <div className="mb-4">
                  <label htmlFor="code" className="block text-gray-700 text-sm font-bold mb-2">
                      {t('confirmationCodeLabel')}
                  </label>
                  <input
                      id="code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      required
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gole-green text-center tracking-[0.5em]"
                  />
              </div>

              {error && <p className="text-red-500 text-sm text-center mb-4" role="alert">{error}</p>}
              {message && <p className="text-gole-green text-sm text-center mb-4" role="status">{message}</p>}
              
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gole-red hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 text-lg disabled:bg-gray-400"
              >
                  {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                  ) : t('confirmButton')}
              </button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-6 space-x-2">
              <button onClick={handleResend} className="font-medium text-gole-blue hover:underline">
                  {t('resendCodeLink')}
              </button>
              <span>or</span>
              <button onClick={() => setIsInboxOpen(true)} className="font-medium text-gole-blue hover:underline">
                  {t('openInboxLink')}
              </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
              <Link to="/login" className="font-medium text-gole-blue hover:underline">
                  {t('backToSignIn')}
              </Link>
          </p>
        </div>
      </div>
      {isInboxOpen && <MockInbox isOpen={isInboxOpen} onClose={() => setIsInboxOpen(false)} userEmail={email} />}
    </>
  );
};

export default ConfirmationPage;