
import React, { useState, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const FileUpload: React.FC = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'complete'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = (fileToUpload: File) => {
    setStatus('uploading');
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('complete');
          setTimeout(() => {
            setFile(null);
            setStatus('idle');
          }, 3000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gole-dark">{t('uploadData')}</h3>
      <p className="text-sm text-gray-500 mb-4">{t('uploadHint')}</p>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button onClick={handleButtonClick} className="bg-gole-green hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors">
          {t('selectFile')}
        </button>
      </div>

      {file && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
          {status === 'uploading' && (
             <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-gole-blue h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
             </div>
          )}
          {status === 'uploading' && <p className="text-sm text-gole-blue mt-1">{t('uploading')}</p>}
          {status === 'complete' && <p className="text-sm text-gole-green mt-1 font-bold">{t('uploadComplete')}</p>}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
