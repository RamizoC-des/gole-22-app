import React, { useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import { MockEmail } from '../types';

interface MockInboxProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gole-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const MockInbox: React.FC<MockInboxProps> = ({ isOpen, onClose, userEmail }) => {
  const { getMockEmailsFor } = useData();
  const { t } = useTranslation();
  const emails = getMockEmailsFor(userEmail);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const renderEmailBody = (body: string) => {
    const codeRegex = /(\d{6})/;
    const parts = body.split(codeRegex);

    return (
        <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (part.match(codeRegex)) {
                    return (
                        <strong key={index} className="text-lg text-gole-red tracking-widest bg-gole-sand px-1 rounded">
                            {part}
                        </strong>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </p>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inbox-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 focus:outline-none max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 id="inbox-title" className="text-2xl font-bold text-gole-dark flex items-center">
            <MailIcon />
            <span className="ml-2">{t('inboxTitle')}</span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close inbox">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {emails.length > 0 ? (
            <ul className="space-y-4">
              {emails.map((email) => (
                <li key={email.id} className="bg-gole-sand p-4 rounded-lg border border-gole-light-blue">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>To: {email.to}</span>
                    <span>{new Date(email.timestamp).toLocaleString()}</span>
                  </div>
                  <h3 className="font-bold text-gole-dark">{email.subject}</h3>
                  <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap p-3 bg-white rounded-md">
                    {renderEmailBody(email.body)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>{t('noEmails')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInbox;