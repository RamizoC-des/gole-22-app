
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useData } from '../../contexts/DataContext';
import FeedItem from './FeedItem';

const Feed: React.FC = () => {
  const { t } = useTranslation();
  const { posts } = useData();
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gole-dark mb-4">{t('communityFeed')}</h3>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <FeedItem key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
