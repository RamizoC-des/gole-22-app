

import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { isValidUrl, isValidEmail, isValidPhone } from '../../utils/validation';
import { useData } from '../../contexts/DataContext';

// SVG Icons
const TwitterIcon = () => <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.523 3.379 4.746 3.419-1.815 1.416-4.12 2.264-6.625 2.264a18.23 18.23 0 01-.624-.036c2.343 1.495 5.13 2.372 8.13 2.372 9.75 0 15.08-8.06 15.08-15.08 0-.23 0-.46-.015-.688a10.835 10.835 0 002.64-2.744z"></path></svg>;
const FacebookIcon = () => <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.835c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"></path></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919 4.919 1.266.058 1.644.07 4.85.07zm0-2.163C8.74 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.286.058 1.694.072 4.947.072s3.667-.014 4.947-.072c4.354-.199 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.667.014 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"></path></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 15h2v2H7v-2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 12l-6-6" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;

interface ProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const defaultAvatar = 'https://picsum.photos/seed/default-avatar/100/100';
const defaultCover = 'https://picsum.photos/seed/default-cover/800/300';

const ProfileModal: React.FC<ProfileModalProps> = ({ user, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { currentUser, updateUser } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState<User>(user);
  const [interestsInput, setInterestsInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [activeTab, setActiveTab] = useState<'about' | 'contact'>('about');
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFor, setCameraFor] = useState<'avatar' | 'coverPhoto' | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setEditableUser(user);
    setInterestsInput(user.interests?.join(', ') || '');
    if (!isEditing) {
        setErrors({});
    }
  }, [user, isEditing]);

  useEffect(() => {
    if (isOpen) {
      const previousFocusElement = document.activeElement as HTMLElement;
      // Set focus to the modal container.
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

          if (event.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else { // Tab
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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({ ...prev, [name]: value }));
    if (name === 'name' || name === 'username') {
      if (!value.trim()) {
          setErrors(prev => ({ ...prev, [name]: t(name === 'name' ? 'nameRequired' : 'usernameRequired') }));
      } else {
          setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestsInput(e.target.value);
  };
  
  const handleImageClick = (type: 'avatar' | 'cover') => {
    if (isEditing) {
        if(type === 'avatar') avatarInputRef.current?.click();
        if(type === 'cover') coverInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'coverPhoto') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditableUser(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setEditableUser(prev => ({ ...prev, avatar: defaultAvatar }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));

    if (name === 'email') {
        if (value && !isValidEmail(value)) {
            setErrors(prev => ({...prev, email: t('invalidEmail')}));
        } else {
            setErrors(prev => ({...prev, email: undefined}));
        }
    } else if (name === 'phone') {
        if (value && !isValidPhone(value)) {
            setErrors(prev => ({...prev, phone: t('invalidPhone')}));
        } else {
            setErrors(prev => ({...prev, phone: undefined}));
        }
    } else if (value && !isValidUrl(value)) {
        setErrors(prev => ({ ...prev, [name]: t('invalidUrl') }));
    } else {
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSave = () => {
    if (!editableUser.name.trim() || !editableUser.username.trim()) {
        setErrors(prev => ({
            ...prev,
            name: !editableUser.name.trim() ? t('nameRequired') : undefined,
            username: !editableUser.username.trim() ? t('usernameRequired') : undefined,
        }));
        return;
    }
    const updatedUser: User = {
        ...editableUser,
        interests: interestsInput.split(',').map(i => i.trim()).filter(Boolean)
    };
    updateUser(updatedUser);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
      setEditableUser(user);
      setIsEditing(false);
      setErrors({});
  }

  const openCamera = async (target: 'avatar' | 'coverPhoto') => {
    setCameraFor(target);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support camera access.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          alert("Camera access was denied. To use this feature, please enable camera permissions in your browser settings.");
        } else if (err.name === "NotFoundError") {
          alert("No camera was found on your device.");
        } else {
          alert("Could not access the camera. Please check permissions and ensure it's not in use by another app.");
        }
      } else {
        alert("Could not access the camera. An unexpected error occurred.");
      }
    }
  };
  
  const takePicture = () => {
    if (videoRef.current && cameraFor) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setEditableUser(prev => ({ ...prev, [cameraFor]: dataUrl }));
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setCameraFor(null);
  };

  if (!isOpen) return null;

  const isFormValid = Object.values(errors).every(error => !error) && !!editableUser.name.trim() && !!editableUser.username.trim();
  const canEdit = currentUser.id === user.id;

  const TabButton: React.FC<{tabName: 'about' | 'contact', children: React.ReactNode}> = ({tabName, children}) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg flex items-center space-x-2 ${
            activeTab === tabName ? 'border-b-2 border-gole-blue text-gole-blue' : 'text-gray-500 hover:bg-gray-100'
        }`}
    >
        {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity" onClick={onClose} role="dialog" aria-modal="true">
      <div ref={modalRef} tabIndex={-1} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all max-h-[95vh] overflow-y-auto focus:outline-none" onClick={e => e.stopPropagation()} aria-labelledby="profile-modal-title">
         {isCameraOpen && (
          <div className="absolute inset-0 bg-black z-10 flex flex-col items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            <button onClick={takePicture} className="absolute bottom-16 bg-white rounded-full p-4 focus:outline-none ring-4 ring-white ring-opacity-50">
              <CameraIcon />
            </button>
            <button onClick={closeCamera} className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        <div className="relative">
             <div 
                className="h-48 bg-cover bg-center"
                style={{backgroundImage: `url(${editableUser.coverPhoto || defaultCover})`}}
            >
                {isEditing && (
                    <div className="absolute top-2 right-2 flex flex-col space-y-2">
                        <button onClick={() => handleImageClick('cover')} className="bg-black bg-opacity-50 text-white rounded-md px-2 py-1 text-xs flex items-center space-x-1 hover:bg-opacity-75">
                            <CameraIcon />
                            <span>{t('changeCoverPhoto')}</span>
                        </button>
                         <button onClick={() => openCamera('coverPhoto')} className="bg-black bg-opacity-50 text-white rounded-md px-2 py-1 text-xs flex items-center space-x-1 hover:bg-opacity-75">
                            <CameraIcon />
                            <span>Use Camera</span>
                        </button>
                    </div>
                )}
            </div>
            <input type="file" ref={coverInputRef} onChange={(e) => handleFileChange(e, 'coverPhoto')} className="hidden" accept="image/*"/>
             
            <div className="absolute -bottom-16 left-6">
                <div className="relative group">
                    <img 
                      src={editableUser.avatar || defaultAvatar} 
                      alt={editableUser.name} 
                      className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    {isEditing && (
                         <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleImageClick('avatar')} className="text-xs flex items-center space-x-1 p-1 hover:bg-black/20 rounded-md"><CameraIcon /><span>Upload</span></button>
                            <button onClick={() => openCamera('avatar')} className="text-xs flex items-center space-x-1 p-1 hover:bg-black/20 rounded-md"><CameraIcon /><span>Camera</span></button>
                        </div>
                    )}
                </div>
            </div>
            <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" accept="image/*"/>

            <div className="absolute top-2 left-2">
                 <button onClick={onClose} className="bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75" aria-label="Close profile">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>

        <div className="pt-20 px-6 pb-6">
            <div className="flex justify-between items-start">
                 <div id="profile-modal-title">
                    {isEditing ? (
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="name"
                                value={editableUser.name}
                                onChange={handleInputChange}
                                className="text-3xl font-bold text-gole-dark w-full border-b-2 border-gray-200 focus:border-gole-blue focus:outline-none bg-transparent"
                                placeholder={t('name')}
                                aria-label={t('name')}
                                aria-required="true"
                                aria-invalid={!!errors.name}
                             />
                             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                             <input
                                type="text"
                                name="username"
                                value={editableUser.username}
                                onChange={handleInputChange}
                                className="text-lg text-gray-500 w-full border-b-2 border-gray-200 focus:border-gole-blue focus:outline-none bg-transparent"
                                placeholder={t('usernameLabel')}
                                aria-label={t('usernameLabel')}
                                aria-required="true"
                                aria-invalid={!!errors.username}
                             />
                             {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-3xl font-bold text-gole-dark">{editableUser.name}</h2>
                            <p className="text-md text-gray-500">@{editableUser.username}</p>
                        </div>
                        
                    )}
                     <p className={`mt-2 px-2 py-0.5 text-xs font-semibold rounded-full w-fit ${
                        editableUser.community === 'Women' ? 'bg-indigo-200 text-indigo-800' : 
                        editableUser.community === 'Youth' ? 'bg-blue-200 text-blue-800' :
                        'bg-cyan-200 text-cyan-800'
                    }`}>{editableUser.community}</p>
                 </div>
                 {isEditing ? (
                    <div className="flex space-x-2 flex-shrink-0">
                        <button onClick={handleCancel} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">{t('cancel')}</button>
                        <button 
                            onClick={handleSave} 
                            disabled={!isFormValid}
                            className="px-4 py-2 text-sm font-semibold text-white bg-gole-green rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {t('save')}
                        </button>
                    </div>
                ) : (
                   canEdit && <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-semibold text-white bg-gole-blue rounded-lg hover:bg-blue-800 flex-shrink-0">{t('editProfile')}</button>
                )}
            </div>

            <div className="mt-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {/* FIX: Corrected closing tag for TabButton from Tab_Button to TabButton. */}
                    <TabButton tabName="about"><UserCircleIcon /><span>{t('aboutTab')}</span></TabButton>
                    <TabButton tabName="contact"><LinkIcon /><span>{t('contactTab')}</span></TabButton>
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'about' && (
                     <div className="space-y-4">
                        <h4 className="font-bold text-gray-800">{t('bio')}</h4>
                        {isEditing ? (
                            <div>
                                <textarea 
                                    name="bio"
                                    value={editableUser.bio} 
                                    onChange={handleInputChange} 
                                    className="w-full h-24 p-2 border rounded-md focus:ring-2 focus:ring-gole-blue focus:outline-none bg-gray-50"
                                    aria-label="Edit bio"
                                    placeholder="Tell us about yourself..."
                                />
                                 <button onClick={handleRemoveImage} className="mt-2 text-sm text-gole-red hover:underline">{t('removePicture')}</button>
                            </div>
                        ) : (
                            <p className="text-gray-700">{editableUser.bio || 'No bio provided.'}</p>
                        )}

                        <h4 className="font-bold text-gray-800">{t('locationLabel')}</h4>
                         {isEditing ? (
                            <input type="text" name="location" value={editableUser.location || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-gole-blue focus:outline-none" placeholder="e.g. Nairobi, Kenya"/>
                        ) : (
                            <div className="flex items-center space-x-2 text-gray-700">
                                <MapPinIcon/>
                                <span>{editableUser.location || 'No location provided.'}</span>
                            </div>
                        )}
                        
                        <h4 className="font-bold text-gray-800">{t('interestsLabel')}</h4>
                         {isEditing ? (
                             <input type="text" name="interests" value={interestsInput} onChange={handleInterestsChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-gole-blue focus:outline-none" placeholder={t('interestsPlaceholder')}/>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {editableUser.interests && editableUser.interests.length > 0 ? (
                                    editableUser.interests.map(interest => (
                                        <span key={interest} className="bg-gole-light-blue text-gole-dark text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{interest}</span>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No interests provided.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'contact' && (
                     <div>
                        {isEditing ? (
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3">
                                    <span className="text-gray-500"><MailIcon/></span>
                                    <input type="email" name="email" value={editableUser.socialLinks.email || ''} onChange={handleSocialChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-gole-blue focus:outline-none" placeholder={t('email')}/>
                                </label>
                                {errors.email && <p className="text-red-500 text-xs mt-1 ml-9">{errors.email}</p>}
                                <label className="flex items-center space-x-3">
                                    <span className="text-gray-500"><PhoneIcon/></span>
                                    <input type="tel" name="phone" value={editableUser.socialLinks.phone || ''} onChange={handleSocialChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-gole-blue focus:outline-none" placeholder={t('phoneLabel')}/>
                                </label>
                                {errors.phone && <p className="text-red-500 text-xs mt-1 ml-9">{errors.phone}</p>}
                                <label className="flex items-center space-x-3">
                                    <span className="text-gray-500"><TwitterIcon/></span>
                                    <input type="text" name="twitter" value={editableUser.socialLinks.twitter || ''} onChange={handleSocialChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-gole-blue focus:outline-none" placeholder={t('twitter')}/>
                                </label>
                                {errors.twitter && <p className="text-red-500 text-xs mt-1 ml-9">{errors.twitter}</p>}
                                <label className="flex items-center space-x-3">
                                    <span className="text-gray-500"><FacebookIcon/></span>
                                    <input type="text" name="facebook" value={editableUser.socialLinks.facebook || ''} onChange={handleSocialChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-gole-blue focus:outline-none" placeholder={t('facebook')}/>
                                </label>
                                {errors.facebook && <p className="text-red-500 text-xs mt-1 ml-9">{errors.facebook}</p>}
                                <label className="flex items-center space-x-3">
                                    <span className="text-gray-500"><InstagramIcon/></span>
                                    <input type="text" name="instagram" value={editableUser.socialLinks.instagram || ''} onChange={handleSocialChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-gole-blue focus:outline-none" placeholder={t('instagram')}/>
                                </label>
                                 {errors.instagram && <p className="text-red-500 text-xs mt-1 ml-9">{errors.instagram}</p>}
                            </div>
                        ) : (
                            <div className="space-y-4 text-gray-600">
                                {editableUser.socialLinks.email ? <a href={`mailto:${editableUser.socialLinks.email}`} className="flex items-center space-x-3 hover:text-gole-blue hover:underline"><MailIcon/><span>{editableUser.socialLinks.email}</span></a> : null}
                                {editableUser.socialLinks.phone ? <a href={`tel:${editableUser.socialLinks.phone}`} className="flex items-center space-x-3 hover:text-gole-blue hover:underline"><PhoneIcon/><span>{editableUser.socialLinks.phone}</span></a> : null}
                                {editableUser.socialLinks.twitter ? <a href={editableUser.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:text-gole-blue hover:underline"><TwitterIcon/><span>{editableUser.socialLinks.twitter}</span></a> : null}
                                {editableUser.socialLinks.facebook ? <a href={editableUser.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:text-gole-blue hover:underline"><FacebookIcon/><span>{editableUser.socialLinks.facebook}</span></a>: null}
                                {editableUser.socialLinks.instagram ? <a href={editableUser.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:text-gole-blue hover:underline"><InstagramIcon/><span>{editableUser.socialLinks.instagram}</span></a>: null}
                                {Object.values(editableUser.socialLinks).every(v => !v) && <p className="text-sm text-gray-500">No contact information provided.</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;