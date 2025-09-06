import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useData } from '../contexts/DataContext';
import { User } from '../types';

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

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [community, setCommunity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUpUser } = useData();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (name && email && password && community) {
      const communityMap: { [key: string]: User['community'] } = {
        youth: 'Youth',
        women: 'Women',
        pwd: 'PWD',
      };
      
      const userEmail = signUpUser({
        name,
        email,
        community: communityMap[community],
      });
      navigate('/confirm-email', { state: { email: userEmail } });
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
        
        <h2 className="text-2xl font-semibold text-center text-gole-green mb-6">{t('signUpTitle')}</h2>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">{t('fullNameLabel')}</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">{t('emailLabel')}</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" />
          </div>
          <div>
            <label htmlFor="password" aria-label="Password" className="block text-gray-700 text-sm font-bold mb-2">{t('passwordLabel')}</label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field pr-10" />
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
          <div>
            <label htmlFor="confirmPassword" aria-label="Confirm Password" className="block text-gray-700 text-sm font-bold mb-2">{t('confirmPasswordLabel')}</label>
            <div className="relative">
              <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input-field pr-10" />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-500 hover:text-gole-dark focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
              </div>
            </div>
          </div>
           <div>
            <label htmlFor="community" className="block text-gray-700 text-sm font-bold mb-2">{t('communityLabel')}</label>
            <select id="community" value={community} onChange={(e) => setCommunity(e.target.value)} required className="input-field">
              <option value="" disabled>{t('communityLabel')}</option>
              <option value="youth">{t('youthOption')}</option>
              <option value="women">{t('womenOption')}</option>
              <option value="pwd">{t('pwdOption')}</option>
            </select>
          </div>
          <style>{`.input-field { box-shadow: none; appearance: none; border: 1px solid #d1d5db; border-radius: 0.25rem; width: 100%; padding: 0.75rem 1rem; color: #374151; line-height: 1.25; } .input-field:focus { outline: none; box-shadow: 0 0 0 2px #3b82f6; }`}</style>
          <button
            type="submit"
            className="w-full bg-gole-red hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 text-lg"
          >
            {t('signUpButton')}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          {t('haveAccount')}{' '}
          <Link to="/login" className="font-medium text-gole-blue hover:underline">
            {t('signInLink')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;