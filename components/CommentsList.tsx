'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'spam';
}

interface CommentsListProps {
  postId: number;
  className?: string;
}

export default function CommentsList({ postId, className = '' }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      
      if (response.ok) {
        // Only show approved comments
        const approvedComments = data.comments.filter((comment: Comment) => comment.status === 'approved');
        setComments(approvedComments);
      } else {
        setError(data.error || 'Failed to load comments');
      }
    } catch (error) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">
        Comments ({comments.length})
      </h3>
      
      {comments.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{comment.authorName}</p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 