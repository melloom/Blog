# Dynamic Blog with Admin Dashboard

A modern, full-featured blog platform built with React, Next.js, and Turso database. Features an admin dashboard for content management, user authentication, and a beautiful responsive design.

## 🚀 Features

### Public Blog
- **Responsive Design**: Beautiful, mobile-first design with Tailwind CSS
- **Blog Posts**: Rich content with markdown support
- **Categories & Tags**: Organized content management
- **Comments System**: User engagement with moderation
- **Search & Filtering**: Find content easily
- **SEO Optimized**: Meta tags, structured data, and performance

### Admin Dashboard
- **Authentication**: Secure admin login with JWT
- **Content Management**: Create, edit, and publish posts
- **Category Management**: Organize content with categories
- **Comment Moderation**: Approve, reject, or mark as spam
- **User Management**: Admin and editor roles
- **Analytics**: Dashboard with blog statistics
- **Settings**: Configure blog appearance and behavior

### Technical Features
- **Turso Database**: Fast, distributed SQLite database
- **Drizzle ORM**: Type-safe database operations
- **Next.js 14**: App Router with server components
- **TypeScript**: Full type safety
- **Authentication**: JWT-based with HTTP-only cookies
- **Markdown Support**: Rich text editing with syntax highlighting
- **Netlify Deployment**: Optimized for Netlify hosting

## 🛠️ Tech Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Database**: Turso (distributed SQLite)
- **ORM**: Drizzle ORM
- **Authentication**: JWT, bcryptjs
- **Content**: React Markdown, Syntax Highlighter
- **Forms**: React Hook Form, Zod validation
- **Hosting**: Netlify

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Turso CLI (for database setup)
- Netlify CLI (for deployment)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd dynamic-blog
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Turso Database

#### Install Turso CLI
```bash
# macOS
brew install tursodatabase/tap/turso

# Windows
powershell -c "irm https://get.tur.so/install.ps1 | iex"

# Linux
curl -sSfL https://get.tur.so/install.sh | bash
```

#### Create Database
```bash
# Login to Turso
turso auth login

# Create a new database
turso db create dynamic-blog

# Get database URL and auth token
turso db show dynamic-blog --url
turso db tokens create dynamic-blog
```

### 4. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Turso Database Configuration
TURSO_DATABASE_URL=your_turso_database_url_here
TURSO_AUTH_TOKEN=your_turso_auth_token_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

### 5. Database Migration
```bash
# Generate and push database schema
npm run db:generate
npm run db:push
```

### 6. Create Admin User
```bash
# Start the development server
npm run dev

# Visit http://localhost:3000/admin/setup to create your first admin user
```

### 7. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your blog!

## 🚀 Netlify Deployment

### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 2. Login to Netlify
```bash
netlify login
```

### 3. Initialize Netlify (Optional)
```bash
netlify init
```

### 4. Set Up Environment Variables in Netlify
Go to your Netlify dashboard → Site settings → Environment variables and add:

```env
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-site-name.netlify.app
JWT_SECRET=your_jwt_secret
```

### 5. Deploy to Netlify

#### Option A: Connect to Git Repository
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Deploy!

#### Option B: Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=.next
```

#### Option C: Netlify Dev (Local Testing)
```bash
# Test Netlify functions locally
npm run netlify:dev
```

### 6. Custom Domain (Optional)
1. Go to Netlify dashboard → Domain settings
2. Add your custom domain
3. Update `NEXTAUTH_URL` environment variable
4. Configure DNS settings

## 📁 Project Structure

```
dynamic-blog/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── Header.tsx        # Main header
│   └── Footer.tsx        # Main footer
├── lib/                  # Utility libraries
│   ├── db/               # Database configuration
│   │   ├── index.ts      # Database connection
│   │   └── schema.ts     # Database schema
│   └── auth.ts           # Authentication utilities
├── types/                # TypeScript type definitions
├── netlify.toml          # Netlify configuration
├── drizzle.config.ts     # Drizzle ORM configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## 🎯 Usage

### Creating Your First Post

1. **Login to Admin Dashboard**
   - Visit `/admin/login`
   - Use your admin credentials

2. **Create a New Post**
   - Go to `/admin/posts/new`
   - Fill in the title, content, and metadata
   - Choose a category and tags
   - Set status to "published" or "draft"

3. **Manage Content**
   - Edit posts at `/admin/posts`
   - Manage categories at `/admin/categories`
   - Moderate comments at `/admin/comments`

### Customizing the Blog

#### Styling
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for custom styles
- Edit component styles in individual component files

#### Content
- Update blog information in `app/layout.tsx`
- Modify navigation in `components/Header.tsx`
- Customize footer links in `components/Footer.tsx`

#### Database Schema
- Edit `lib/db/schema.ts` to modify database structure
- Run `npm run db:generate` and `npm run db:push` to apply changes

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Turso Studio
- `npm run netlify:dev` - Start Netlify dev server

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: XSS protection
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Drizzle ORM parameterized queries
- **CORS Protection**: Configured for production
- **Environment Variables**: Secure configuration management

## 📊 Performance

- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Next.js Image component (unoptimized for Netlify)
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Built-in Next.js caching strategies
- **Turso Database**: Fast, distributed SQLite
- **Netlify CDN**: Global content delivery

## 🚀 Deployment Checklist

Before deploying to Netlify:

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Admin user created
- [ ] Build command tested locally
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate enabled
- [ ] Analytics tracking set up (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our [Discord](https://discord.gg/your-server) for community support

## 🙏 Acknowledgments

- [Turso](https://turso.tech/) for the amazing database
- [Next.js](https://nextjs.org/) team for the framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database operations
- [Netlify](https://netlify.com/) for hosting and deployment

---

Built with ❤️ using modern web technologies 