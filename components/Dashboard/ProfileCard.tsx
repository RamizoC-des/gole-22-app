
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useData } from '../../contexts/DataContext';

interface ProfileCardProps {
  onEdit: () => void;
}

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;

const TwitterIcon = () => <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.523 3.379 4.746 3.419-1.815 1.416-4.12 2.264-6.625 2.264a18.23 18.23 0 01-.624-.036c2.343 1.495 5.13 2.372 8.13 2.372 9.75 0 15.08-8.06 15.08-15.08 0-.23 0-.46-.015-.688a10.835 10.835 0 002.64-2.744z"></path></svg>;
const FacebookIcon = () => <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.835c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"></path></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919 4.919 1.266.058 1.644.07 4.85.07zm0-2.163C8.74 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.286.058 1.694.072 4.947.072s3.667-.014 4.947-.072c4.354-.199 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.667.014 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"></path></svg>;

const ProfileCard: React.FC<ProfileCardProps> = ({ onEdit }) => {
  const { t } = useTranslation();
  const { currentUser } = useData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gole-dark mb-4">{t('yourProfile')}</h3>
        <button onClick={onEdit} className="flex items-center text-sm font-semibold text-gole-blue hover:underline">
          <EditIcon />
          {t('edit')}
        </button>
      </div>

      <div className="flex flex-col items-center">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="h-24 w-24 rounded-full object-cover border-4 border-gole-light-blue"
        />
        <h2 className="text-xl font-bold text-gole-dark mt-3">{currentUser.name}</h2>
      </div>

      <div className="mt-4">
        <label className="text-sm font-bold text-gray-700 block text-left mb-1">{t('bio')}</label>
        <p className="text-sm text-gray-600 text-left">{currentUser.bio}</p>
      </div>

      <div className="mt-4">
        <label className="text-sm font-bold text-gray-700 block text-left mb-2">{t('socialLinks')}</label>
        <div className="flex items-center space-x-4 text-gray-600">
          {currentUser.socialLinks?.twitter && <a href={currentUser.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-gole-blue"><TwitterIcon/></a>}
          {currentUser.socialLinks?.facebook && <a href={currentUser.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gole-blue"><FacebookIcon/></a>}
          {currentUser.socialLinks?.instagram && <a href={currentUser.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gole-blue"><InstagramIcon/></a>}
          {!(currentUser.socialLinks?.twitter || currentUser.socialLinks?.facebook || currentUser.socialLinks?.instagram) && <p className="text-sm text-gray-500">No social links provided.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
