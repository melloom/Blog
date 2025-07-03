import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Privacy Policy</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          Last updated: June 2024
        </p>
        <section className="space-y-8 text-gray-700 dark:text-gray-300">
          <div>
            <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you subscribe to our newsletter or contact us. We may also collect information automatically through cookies and analytics tools.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">2. How We Use Information</h2>
            <p>We use your information to provide, maintain, and improve our services, communicate with you, and personalize your experience on our site.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">3. Sharing of Information</h2>
            <p>We do not sell or share your personal information with third parties except as necessary to provide our services or as required by law.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">4. Cookies</h2>
            <p>We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can control cookies through your browser settings.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">5. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. Contact us if you wish to exercise these rights.</p>
          </div>
        </section>
        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">Back to Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  )
} 