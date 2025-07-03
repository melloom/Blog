import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PostLoading() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Article Header Skeleton */}
        <article className="mb-16">
          {/* Category Skeleton */}
          <div className="mb-4">
            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          </div>

          {/* Title Skeleton */}
          <div className="mb-6">
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Meta Skeleton */}
          <div className="flex items-center mb-8">
            <div className="h-4 bg-gray-200 rounded w-32 mr-4"></div>
            <div className="h-4 bg-gray-200 rounded w-4 mr-4"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Featured Image Skeleton */}
          <div className="mb-8">
            <div className="w-full h-64 lg:h-96 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </article>

        {/* Engagement Section Skeleton */}
        <div className="border-t border-gray-200 pt-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
          </div>
        </div>

        {/* Comments Section Skeleton */}
        <div className="border-t border-gray-200 pt-12">
          <div className="max-w-3xl mx-auto">
            {/* Comments List Skeleton */}
            <div className="mb-12">
              <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment Form Skeleton */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
              <div className="space-y-4">
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 