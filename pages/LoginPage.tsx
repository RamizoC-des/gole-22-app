import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useData } from '../contexts/DataContext';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .946-3.024 3.49-5.32 6.542-6.198M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.195 4.866A10.033 10.033 0 0112 19c-1.23 0-2.404-.22-3.48-.625m-6.04-2.55A10.007 10.007 0 012.458 12c1.274-4.057 5.064-7 9.542-7 .845 0 1.666.11 2.458.31M19.5 4.5l-15 15" />
    </svg>
);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { loginUser } = useData();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email && password) {
      const result = loginUser(email);
      if (result === 'success') {
        login();
      } else if (result === 'not_confirmed') {
        navigate('/confirm-email', { state: { email } });
      } else {
        setError(t('invalidCredentials'));
      }
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
          <p className="text-gole-dark mt-2">{t('tagline')}</p>
        </div>
        
        <h2 className="text-2xl font-semibold text-center text-gole-green mb-6">{t('loginTitle')}</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
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
              aria-describedby="email-error"
            />
          </div>
          <div>
            <div className="flex justify-between items-baseline">
              <label htmlFor="password" aria-label="Password" className="block text-gray-700 text-sm font-bold mb-2">
                {t('passwordLabel')}
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-gole-blue hover:underline">
                {t('forgotPasswordLink')}
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gole-green"
                aria-describedby="password-error"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gole-dark focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>
          {error && <p id="login-error" className="text-red-500 text-sm text-center" role="alert">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gole-red hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 text-lg"
          >
            {t('signInButton')}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          {t('noAccount')}{' '}
          <Link to="/signup" className="font-medium text-gole-blue hover:underline">
            {t('signUpLink')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;