import React, { useState, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useData } from '../../contexts/DataContext';
import { NewPost } from '../../types';

const TextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 11-2 0V4H6a1 1 0 110-2zm4 12a1 1 0 001-1V7a1 1 0 10-2 0v8a1 1 0 001 1z" clipRule="evenodd" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>;
const PollIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1zm5 0a1 1 0 011-1h5a1 1 0 110 2H8a1 1 0 01-1-1zM2 5a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1zm5 0a1 1 0 011-1h5a1 1 0 110 2H8a1 1 0 01-1-1z" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

type PostType = 'text' | 'image' | 'poll';

const CreatePost: React.FC = () => {
    const { t } = useTranslation();
    const { currentUser, addPost } = useData();
    const [activeTab, setActiveTab] = useState<PostType>('text');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const handleTabClick = (tab: PostType) => {
        setActiveTab(tab);
        // Reset fields when switching tabs
        setContent('');
        setImage(null);
        setPollOptions(['', '']);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const addPollOption = () => setPollOptions([...pollOptions, '']);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newPost: NewPost = {
            type: activeTab,
            content: content
        };

        // Validation and data preparation
        if (activeTab === 'image') {
            if (!image) {
                alert('Please upload or capture an image for your post.');
                return;
            }
            newPost.imageUrl = image;
        } else if (activeTab === 'poll') {
            const validOptions = pollOptions.filter(opt => opt.trim());
            if (!content.trim() || validOptions.length < 2) {
                alert('A poll requires a question and at least two valid options.');
                return;
            }
            newPost.pollOptions = validOptions;
        } else if (activeTab === 'text') {
            if (!content.trim()) return; // Don't post empty text
        }

        addPost(newPost);
        
        // Show confirmation message and reset form
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
        handleTabClick('text');
    };

    const openCamera = async () => {
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
            console.error("Camera error:", err);
            if (err instanceof DOMException) {
                if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                    alert("Camera access was denied. To use this feature, please enable camera permissions in your browser settings.");
                } else if (err.name === "NotFoundError") {
                    alert("No camera was found on your device.");
                } else {
                    alert("Could not access camera. Please check permissions and ensure it's not in use by another app.");
                }
            } else {
                alert("Could not access camera. An unexpected error occurred.");
            }
        }
    };

    const takePicture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            setImage(canvas.toDataURL('image/png'));
            closeCamera();
        }
    };
    
    const closeCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
    };

    const TabButton: React.FC<{ tab: PostType, icon: React.ReactNode, label: string }> = ({ tab, icon, label }) => (
        <button
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center p-3 text-sm font-semibold rounded-t-lg transition-colors ${
                activeTab === tab
                ? 'bg-white text-gole-blue border-b-2 border-gole-blue'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
        >
            {icon} {label}
        </button>
    );

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6 relative">
             {isCameraOpen && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                    <button onClick={takePicture} className="absolute bottom-16 bg-white rounded-full p-4 focus:outline-none ring-4 ring-white ring-opacity-50"><CameraIcon /></button>
                    <button onClick={closeCamera} className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2">Close</button>
                </div>
            )}
            {showConfirmation && (
                <div 
                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-gole-green text-white text-sm font-semibold py-2 px-5 rounded-full shadow-md z-10"
                    role="alert"
                    aria-live="assertive"
                >
                    {t('postSuccess')}
                </div>
            )}
            <div className="flex items-center space-x-3 border-b pb-3 mb-3">
                <img src={currentUser.avatar} alt="avatar" className="h-10 w-10 rounded-full" />
                <div className="flex-1 text-left">
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.community}</p>
                </div>
            </div>

            <div className="flex bg-gray-100 rounded-t-lg">
                <TabButton tab="text" icon={<TextIcon />} label={t('createPost')} />
                <TabButton tab="image" icon={<ImageIcon />} label="Image" />
                <TabButton tab="poll" icon={<PollIcon />} label={t('poll')} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white rounded-b-lg -mt-px">
                {activeTab === 'text' && (
                    <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t('whatsOnYourMind')} className="w-full h-24 p-2 border rounded-md" />
                )}
                {activeTab === 'image' && (
                    <div>
                        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Say something about this image..." className="w-full p-2 border rounded-md mb-2"/>
                        <div className="flex items-center space-x-2">
                           <button type="button" onClick={() => imageInputRef.current?.click()} className="flex-1 bg-gray-200 p-2 rounded-md hover:bg-gray-300 text-sm flex items-center justify-center"><ImageIcon/> Upload</button>
                           <button type="button" onClick={openCamera} className="flex-1 bg-gray-200 p-2 rounded-md hover:bg-gray-300 text-sm flex items-center justify-center"><CameraIcon /> Use Camera</button>
                        </div>
                        <input type="file" ref={imageInputRef} onChange={handleFileChange} className="hidden" accept="image/*"/>
                        {image && <img src={image} alt="preview" className="mt-4 rounded-lg max-h-60 w-auto mx-auto" />}
                    </div>
                )}
                {activeTab === 'poll' && (
                    <div>
                        <input value={content} onChange={e => setContent(e.target.value)} placeholder={t('pollQuestion')} className="w-full p-2 border rounded-md mb-2" />
                        <div className="space-y-2">
                            {pollOptions.map((opt, i) => (
                                <input key={i} value={opt} onChange={e => handlePollOptionChange(i, e.target.value)} placeholder={`${t('option')} ${i + 1}`} className="w-full p-2 border rounded-md"/>
                            ))}
                        </div>
                        <button type="button" onClick={addPollOption} className="mt-2 text-sm font-semibold text-gole-blue hover:underline">{t('addOption')}</button>
                    </div>
                )}
                <button type="submit" className="w-full mt-4 bg-gole-blue hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg">{t('post')}</button>
            </form>
        </div>
    );
};

export default CreatePost;