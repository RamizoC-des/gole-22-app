
import React, { useState, useRef, useEffect } from 'react';
import { Post, Comment, User } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { translateText, summarizeText } from '../../services/geminiService';
import ProfileModal from './ProfileModal';
import ShareModal from './ShareModal';
import { useData } from '../../contexts/DataContext';

// FIX: Define the SpeechRecognition interface as it's a browser-specific API
// and its type might not be available in the default TypeScript environment.
interface SpeechRecognition {
  lang: string;
  interimResults: boolean;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
  onresult: ((event: any) => void) | null;
  onstart: (() => void) | null;
  stop: () => void;
  start: () => void;
}

interface FeedItemProps {
  post: Post;
  index: number;
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform transform ${filled ? 'scale-110' : ''}`} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);
const CommentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.862 13.033 9 12.688 9 12.316c0-.372-.138-.717-.316-1.026l4.242-2.121c.178.309.43.564.717.742l-2.12 4.243zm5.328-3.354c-.178-.309-.43-.564-.717-.742l2.12-4.243c.287.178.54.433.717.742l-2.12 4.243zM12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const MicrophoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>;


const FeedItem: React.FC<FeedItemProps> = ({ post, index }) => {
  const { user, content, imageUrl, createdAt, type } = post;
  const { t, language } = useTranslation();
  const { currentUser, toggleLike, addComment } = useData();

  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  
  const [newComment, setNewComment] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shares, setShares] = useState(post.shares);
  
  const isLiked = post.likes.includes(currentUser.id);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleTranslate = async () => {
    setIsTranslating(true);
    const result = await translateText(content, language);
    setTranslatedContent(result);
    setIsTranslating(false);
  };
  
  const handleSummarize = async () => {
    setIsSummarizing(true);
    const result = await summarizeText(content);
    setSummary(result);
    setIsSummarizing(false);
  };

  const handleLike = () => {
    toggleLike(post.id, currentUser.id);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleSuccessfulShare = () => {
    setShares(prev => prev + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
        const newCommentObj: Comment = {
            id: `c${Date.now()}`,
            user: currentUser,
            content: newComment.trim(),
        };
        addComment(post.id, newCommentObj);
        setNewComment('');
    }
  };

  const focusCommentInput = () => {
    commentInputRef.current?.focus();
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
      setNewComment('');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      setNewComment(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };

  const SparklesIcon = () => <svg className="w-4 h-4 text-gole-green inline-block mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm11 1a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1V4a1 1 0 011-1zM5.293 9.293a1 1 0 011.414 0L8 10.586l1.293-1.293a1 1 0 111.414 1.414L9.414 12l1.293 1.293a1 1 0 01-1.414 1.414L8 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L6.586 12 5.293 10.707a1 1 0 010-1.414zM15 9a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>;

  const CommentItem: React.FC<{comment: Comment; onViewProfile: (user: User) => void}> = ({comment, onViewProfile}) => {
    const isAI = comment.isAI;

    const handleViewProfile = () => {
        if (!isAI) {
            onViewProfile(comment.user);
        }
    };

    return (
      <div className="flex items-start space-x-3">
         <button onClick={handleViewProfile} disabled={isAI} className={`flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gole-blue ${isAI ? 'cursor-default' : ''}`}>
          <img src={comment.user.avatar} alt={comment.user.name} className="h-8 w-8 rounded-full" />
        </button>
        <div className={`flex-1 rounded-lg ${isAI ? 'p-3 bg-gole-light-blue/20 border-l-4 border-gole-green' : 'px-3 py-2 bg-gray-100'}`}>
            <div className="flex items-center">
                {isAI && <SparklesIcon />}
                <button onClick={handleViewProfile} disabled={isAI} className={`font-semibold text-sm text-gole-dark text-left ${isAI ? 'cursor-default' : 'hover:underline'}`}>
                    {comment.user.name}
                </button>
            </div>
            <p className="text-sm text-gray-800 mt-1 break-words">{comment.content}</p>
        </div>
      </div>
    );
  };

  const placeholderImage = 'https://picsum.photos/seed/placeholder/600/400';
  const shouldDisplayImage = type === 'image' || type === 'report';
  const displayImageUrl = imageUrl || placeholderImage;


  return (
    <>
      <div 
        className="border-t border-gray-200 pt-6 post-appear"
        style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
      >
        <div className="flex items-start space-x-4">
          <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <div className="flex items-baseline space-x-2">
              <button onClick={() => setViewingUser(user)} className="font-bold text-gole-dark hover:underline text-left">
                {user.name}
              </button>
              <p className="text-xs text-gray-500">{createdAt}</p>
            </div>
            <p className={`px-1 text-xs font-semibold rounded-full w-fit ${
              user.community === 'Women' ? 'bg-indigo-200 text-indigo-800' : 
              user.community === 'Youth' ? 'bg-blue-200 text-blue-800' :
              'bg-cyan-200 text-cyan-800'
            }`}>
              {user.community}
            </p>

            <p className="mt-2 text-gray-800">{content}</p>

            {translatedContent && <div className="mt-2 p-3 bg-gole-sand/30 rounded-lg text-sm text-gray-700 italic">{translatedContent}</div>}

            {shouldDisplayImage && <img src={displayImageUrl} alt="Post content" className="mt-3 rounded-lg w-full object-cover max-h-96" />}
            
            <div className="mt-3 flex items-center space-x-4">
              <button onClick={handleTranslate} disabled={isTranslating} className="text-sm font-semibold text-gole-blue hover:underline disabled:opacity-50">
                  {isTranslating ? t('generating') : t('translate')}
              </button>
              {type === 'report' && (
                  <button onClick={handleSummarize} disabled={isSummarizing} className="text-sm font-semibold text-gole-green hover:underline disabled:opacity-50">
                      {isSummarizing ? t('generating') : t('generateSummary')}
                  </button>
              )}
            </div>
            
            {summary && (
                <div className="mt-4 p-4 bg-green-50 border border-gole-green rounded-lg">
                    <h4 className="font-bold text-gole-green text-sm">AI Summary</h4>
                    <p className="text-sm text-gray-700 mt-1">{summary}</p>
                </div>
            )}
            
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <span>{post.likes.length} {t('likesCount')}</span>
                <span>{post.comments.length} {t('commentsCount')}</span>
                <span>{shares} {t('sharesCount')}</span>
            </div>

            <div className="mt-2 border-t border-b border-gray-200 py-1 flex justify-around">
                <button onClick={handleLike} className={`flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors w-full justify-center ${isLiked ? 'text-red-500 bg-red-100' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <HeartIcon filled={isLiked} />
                    <span>{t('like')}</span>
                </button>
                <button onClick={focusCommentInput} className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 w-full justify-center">
                    <CommentIcon />
                    <span>{t('commentAction')}</span>
                </button>
                <button onClick={handleShare} className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 w-full justify-center">
                    <ShareIcon />
                    <span>{t('share')}</span>
                </button>
            </div>

            <div className="mt-4 space-y-4">
                {post.comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} onViewProfile={setViewingUser} />
                ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center space-x-2">
                <img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 rounded-full" />
                <input 
                    ref={commentInputRef}
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isRecording ? "Listening..." : t('addComment')} 
                    className="flex-1 border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-gole-blue focus:border-gole-blue"
                />
                 <button 
                    type="button" 
                    onClick={handleToggleRecording} 
                    className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gole-blue ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                    aria-label={isRecording ? "Stop recording" : "Record voice comment"}
                >
                    <MicrophoneIcon />
                </button>
                <button type="submit" disabled={!newComment.trim() || isRecording} className="px-4 py-2 text-sm font-semibold text-white bg-gole-blue rounded-full hover:bg-blue-800 disabled:bg-gray-400">
                    {t('commentAction')}
                </button>
            </form>
          </div>
        </div>
      </div>
      {viewingUser && <ProfileModal user={viewingUser} isOpen={!!viewingUser} onClose={() => setViewingUser(null)} />}
      {isShareModalOpen && <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} postUrl={`/post/${post.id}`} onShared={handleSuccessfulShare} />}
    </>
  );
};

export default FeedItem;
