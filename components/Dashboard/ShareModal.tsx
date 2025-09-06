
import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

// Icons
const TwitterIcon = () => <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.523 3.379 4.746 3.419-1.815 1.416-4.12 2.264-6.625 2.264a18.23 18.23 0 01-.624-.036c2.343 1.495 5.13 2.372 8.13 2.372 9.75 0 15.08-8.06 15.08-15.08 0-.23 0-.46-.015-.688a10.835 10.835 0 002.64-2.744z"></path></svg>;
const FacebookIcon = () => <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.835c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"></path></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postUrl: string;
  onShared: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, postUrl, onShared }) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const previousFocusElement = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
          return;
        }

        if (event.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusableElements || focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      };

      const modalNode = modalRef.current;
      modalNode?.addEventListener('keydown', handleKeyDown);

      return () => {
        modalNode?.removeEventListener('keydown', handleKeyDown);
        previousFocusElement?.focus();
      };
    }
  }, [isOpen, onClose]);

  const handleShareAction = (action: 'twitter' | 'facebook' | 'copy') => {
    if (action === 'copy') {
      navigator.clipboard.writeText(postUrl);
      alert('Link copied to clipboard!');
    }
    // In a real app, you would open a new window for Twitter/Facebook
    onShared();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div ref={modalRef} tabIndex={-1} className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 focus:outline-none" onClick={e => e.stopPropagation()} aria-labelledby="share-modal-title">
        <h3 id="share-modal-title" className="text-xl font-bold text-gole-dark text-center mb-6">{t('shareOn')}...</h3>
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center space-y-2 text-blue-500 hover:text-blue-700 transition-colors" onClick={() => handleShareAction('twitter')}>
            <TwitterIcon />
            <span>Twitter</span>
          </button>
          <button className="flex flex-col items-center space-y-2 text-blue-800 hover:text-blue-900 transition-colors" onClick={() => handleShareAction('facebook')}>
            <FacebookIcon />
            <span>Facebook</span>
          </button>
          <button className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800 transition-colors" onClick={() => handleShareAction('copy')}>
            <LinkIcon />
            <span>Copy Link</span>
          </button>
        </div>
        <button onClick={onClose} className="mt-8 w-full px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">{t('cancel')}</button>
      </div>
    </div>
  );
};

export default ShareModal;
