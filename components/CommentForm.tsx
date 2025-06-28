'use client';

import { useState } from 'react';
import { useAnonymousUser } from '@/lib/hooks/useAnonymousUser';
import { useSession } from 'next-auth/react';
import { UsernameModal } from './Providers';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

interface CommentFormProps {
  postId: number;
  onCommentAdded?: () => void;
  className?: string;
}

export default function CommentForm({ postId, onCommentAdded, className = '' }: CommentFormProps) {
  const { data: session } = useSession();
  const { token, saveToken, hasToken, displayName, hasDisplayName, updateDisplayName } = useAnonymousUser();
  const { trackComment } = useAnalytics();
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || (!session?.user?.name && !authorName.trim())) {
      return;
    }
    if (!session?.user?.id && !hasDisplayName) {
      setShowUsernameModal(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          authorName: session?.user?.name || authorName.trim() || displayName,
          authorEmail: session?.user?.email || authorEmail,
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
        setContent('');
        if (!session?.user?.name) {
          setAuthorName('');
          setAuthorEmail('');
        }
        trackComment('comment_added');
        onCommentAdded?.();
      } else {
        console.error('Failed to post comment:', data.error);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your thoughts..."
            required
          />
        </div>

        {!session?.user?.name && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                id="authorEmail"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !content.trim() || (!session?.user?.name && !authorName.trim())}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
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