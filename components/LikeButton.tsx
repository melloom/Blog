'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAnonymousUser } from '@/lib/hooks/useAnonymousUser';
import { useSession } from 'next-auth/react';
import { UsernameModal } from './Providers';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

interface LikeButtonProps {
  postId: number;
  initialLikes?: number;
  className?: string;
}

export default function LikeButton({ postId, initialLikes = 0, className = '' }: LikeButtonProps) {
  const { data: session } = useSession();
  const { token, saveToken, hasToken, displayName, hasDisplayName, updateDisplayName } = useAnonymousUser();
  const { trackLike } = useAnalytics();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    // Fetch current like count
    fetch(`/api/likes?postId=${postId}`)
      .then(res => res.json())
      .then(data => setLikes(data.count))
      .catch(console.error);
  }, [postId]);

  const handleLike = async () => {
    if (isLoading) return;
    if (!session?.user?.id && !hasDisplayName) {
      setShowUsernameModal(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          userId: session?.user?.id,
          anonymousToken: !session?.user?.id ? token : undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.anonymousToken && !hasToken) {
          saveToken(data.anonymousToken);
        }
        setLikes(prev => prev + 1);
        setIsLiked(true);
        // Track the like event
        trackLike('post_liked');
      } else if (response.status === 409) {
        setIsLiked(true);
      } else {
        console.error('Failed to like post:', data.error);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isLiked 
            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${className}`}
      >
        {isLiked ? (
          <HeartSolidIcon className="w-5 h-5" />
        ) : (
          <HeartIcon className="w-5 h-5" />
        )}
        <span className="font-medium">{likes}</span>
        {isLoading && <span className="text-sm">...</span>}
      </button>
      <UsernameModal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        onSave={async (username) => {
          await updateDisplayName(username);
        }}
      />
    </>
  );
} 