import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Terms of Service</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          Last updated: June 2024
        </p>
        <section className="space-y-8 text-gray-700 dark:text-gray-300">
          <div>
            <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this site.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">2. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. You should check this page regularly. Continued use of the website after any such changes shall constitute your consent to such changes.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">3. User Conduct</h2>
            <p>You agree not to use the site for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the site in any way that could damage the site, services, or general business of the website owner.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">4. Intellectual Property</h2>
            <p>All content on this site is the property of the website owner unless otherwise stated. You may not reproduce, distribute, or create derivative works from any content without express written permission.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">5. Disclaimer</h2>
            <p>This site and its content are provided "as is" and without warranties of any kind, either express or implied. The website owner does not warrant that the site will be available at all times or that the content is accurate, reliable, or current.</p>
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