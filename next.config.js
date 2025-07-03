/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: true, // Required for Netlify deployment
  },
  env: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Netlify specific configuration
  trailingSlash: false,
  generateBuildId: async () => {
    // You can set this to a commit hash or timestamp
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig 