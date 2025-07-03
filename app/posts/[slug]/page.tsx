import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { dbNonNull as db } from '@/lib/db';
import { posts, categories, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LikeButton from '@/components/LikeButton';
import CommentForm from '@/components/CommentForm';
import CommentsList from '@/components/CommentsList';
import PostViewTracker from '@/components/PostViewTracker';
import SocialShare from '@/components/SocialShare';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface PostPageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  const post = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      content: posts.content,
      excerpt: posts.excerpt,
      featuredImage: posts.featuredImage,
      template: posts.template,
      status: posts.status,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      authorName: users.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.slug, slug))
    .get();

  return post;
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  // Generate the full URL for sharing
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${post.slug}`;
  
  // Extract hashtags from category and title
  const hashtags = [
    post.categoryName?.toLowerCase().replace(/\s+/g, ''),
    'technology',
    'blog',
    'wiredliving'
  ].filter((tag): tag is string => Boolean(tag));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Analytics Tracker */}
      <PostViewTracker postTitle={post.title} postSlug={post.slug} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Article Header */}
        <article className="mb-16">
          {/* Category */}
          {post.categoryName && (
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {post.categoryName}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight dark:text-gray-100">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center text-gray-600 mb-8 dark:text-gray-400">
            <span className="mr-4">
              By {post.authorName || 'Anonymous'}
            </span>
            <span className="mr-4">•</span>
            <span>
              {formatDistanceToNow(new Date(post.publishedAt || post.createdAt || Date.now()), { addSuffix: true })}
            </span>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <Image
                src={post.featuredImage}
                alt={post.title}
                width={1200}
                height={600}
                className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={true}
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>

        {/* Social Sharing */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
          <SocialShare 
            url={postUrl}
            title={post.title}
            description={post.excerpt || `Check out this post: ${post.title}`}
            hashtags={hashtags}
          />
        </div>

        {/* Engagement Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Engage with this post</h2>
            <LikeButton postId={post.id} className="text-lg" />
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <div className="max-w-3xl mx-auto">
            {/* Comments List */}
            <Suspense fallback={
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 dark:bg-gray-700"></div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4 dark:bg-gray-800">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 dark:bg-gray-700"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1 dark:bg-gray-700"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
                  </div>
                ))}
              </div>
            }>
              <CommentsList postId={post.id} className="mb-12" />
            </Suspense>

            {/* Comment Form */}
            <div className="bg-gray-50 rounded-xl p-8 dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 dark:text-gray-100">Leave a Comment</h3>
              <CommentForm 
                postId={post.id} 
                className="max-w-none"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 