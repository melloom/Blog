# 🌟 Wired Living - Technology & Lifestyle Blog

A modern, feature-rich blog built with Next.js 14, featuring comprehensive admin tools, analytics, security monitoring, and a beautiful user experience.

**Live Site**: [wiredliving.blog](https://wiredliving.blog)

## ✨ Features

### 🎨 **User Experience**
- **Modern Design**: Clean, responsive design with dark/light mode support
- **Reading Progress Bar**: Visual progress indicator for long articles
- **Reading Time Calculator**: Automatic reading time estimation
- **Save for Later**: Bookmark posts for future reading
- **Like System**: Interactive like buttons with real-time updates
- **Social Sharing**: Share posts across multiple platforms
- **Search Functionality**: Advanced search with filters and categories
- **Newsletter Signup**: Email subscription system
- **Random Post Discovery**: Discover new content randomly

### 📊 **Admin Dashboard**
- **Comprehensive Analytics**: Real-time blog performance metrics
- **Security Monitoring**: Threat detection and IP blocking
- **Post Management**: Create, edit, preview, and manage posts
- **AI-Powered Content**: Generate posts using AI assistance
- **Category & Tag Management**: Organize content effectively
- **Comment System**: Moderate and manage user comments
- **Settings Panel**: Customize blog appearance and behavior
- **Backup System**: Database backup and restore functionality
- **User Management**: Admin user roles and permissions

### 🔒 **Security Features**
- **Real-time Security Monitoring**: Track security events and threats
- **IP Blocking**: Automatic blocking of suspicious IP addresses
- **Failed Login Tracking**: Monitor and prevent brute force attacks
- **Security Score**: Real-time security health assessment
- **Threat Detection**: Integration with external security APIs
- **Database Health Monitoring**: Ensure data integrity

### 📈 **Analytics & Insights**
- **Blog Performance Metrics**: Views, likes, comments tracking
- **User Engagement Analytics**: Detailed user behavior insights
- **Top Content Analysis**: Identify most popular posts and categories
- **Real-time Charts**: Visual data representation
- **SEO Analytics**: Search performance and optimization insights

### 🛠️ **Technical Features**
- **Next.js 14**: Latest React framework with App Router
- **TypeScript**: Full type safety and better development experience
- **Turso Database**: Fast, reliable SQLite database
- **NextAuth.js**: Secure authentication system
- **Drizzle ORM**: Type-safe database operations
- **Tailwind CSS**: Utility-first styling framework
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags, structured data, and performance
- **PWA Ready**: Progressive Web App capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Turso database account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/melloom/Blog.git
   cd Blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   # Database
   TURSO_DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_auth_token
   
   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Google Analytics (optional)
   NEXT_PUBLIC_GA_ID=your_ga_id
   ```

4. **Set up the database**
   ```bash
   npx drizzle-kit push:sqlite
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Blog-main/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── posts/             # Blog post pages
│   └── ...                # Other pages
├── components/            # React components
├── lib/                   # Utilities and configurations
│   ├── db/               # Database schema and migrations
│   ├── hooks/            # Custom React hooks
│   └── ...               # Other utilities
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🎯 Key Features Breakdown

### **Blog Management**
- **AI-Powered Content Generation**: Create posts with AI assistance
- **Rich Text Editor**: WYSIWYG editor for post creation
- **Post Preview**: Preview posts before publishing
- **Draft System**: Save and manage draft posts
- **Scheduling**: Schedule posts for future publication
- **SEO Optimization**: Built-in SEO tools and meta tags

### **Content Organization**
- **Categories**: Organize posts by topics
- **Tags**: Flexible tagging system
- **Featured Posts**: Highlight important content
- **Trending Posts**: Show popular content
- **Related Posts**: Suggest similar content

### **User Engagement**
- **Comments System**: User comments with moderation
- **Like System**: Interactive like buttons
- **Social Sharing**: Share on social media platforms
- **Newsletter**: Email subscription system
- **Save for Later**: Bookmark functionality

### **Admin Tools**
- **Dashboard Overview**: Key metrics and insights
- **Post Management**: Full CRUD operations
- **User Management**: Admin user roles
- **Settings Panel**: Blog customization
- **Backup System**: Data backup and restore
- **Security Dashboard**: Threat monitoring
- **Analytics**: Performance insights

### **Security & Performance**
- **Authentication**: Secure login system
- **IP Blocking**: Automatic threat prevention
- **Rate Limiting**: Prevent abuse
- **SSL/HTTPS**: Secure connections
- **Performance Optimization**: Fast loading times
- **SEO Optimization**: Search engine friendly

## 🌐 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### **Custom Domain Setup**
1. Add domain in Vercel dashboard
2. Configure DNS records:
   - **A Record**: `@` → `76.76.21.21`
   - **CNAME Record**: `www` → `cname.vercel-dns.com`

## 🔧 Configuration

### **Blog Settings**
- Site title and description
- Posts per page
- Comment moderation
- Social media links
- Analytics integration
- Newsletter settings

### **Security Settings**
- Failed login attempts threshold
- IP blocking rules
- Security monitoring preferences
- Backup frequency

## 📊 Analytics & Monitoring

### **Real-time Metrics**
- Page views and unique visitors
- Popular posts and categories
- User engagement rates
- Comment activity
- Like interactions

### **Security Monitoring**
- Failed login attempts
- Suspicious IP activity
- Security event tracking
- Database health status
- Threat detection alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Turso** for the fast database solution
- **Tailwind CSS** for the utility-first styling
- **Drizzle ORM** for type-safe database operations
- **NextAuth.js** for secure authentication

## 📞 Support

For support, email admin@wiredliving.blog or create an issue in the GitHub repository.

---

**Built with ❤️ for the modern web** # Force Vercel deployment - Thu Jul  3 00:43:26 EDT 2025
