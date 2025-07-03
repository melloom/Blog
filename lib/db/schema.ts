import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Users table for admin authentication
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'editor'] }).default('editor'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Categories table for blog posts
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Blog posts table
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  template: text('template').default('default'),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft'),
  authorId: integer('author_id').references(() => users.id),
  categoryId: integer('category_id').references(() => categories.id),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  featured: integer('featured', { mode: 'boolean' }).default(false),
});

// Anonymous users table for tracking anonymous interactions
export const anonymousUsers = sqliteTable('anonymous_users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  token: text('token').notNull().unique(), // Permanent token for anonymous users
  displayName: text('display_name'), // Optional display name they can set
  userIp: text('user_ip'), // IP address for moderation
  lastSeen: integer('last_seen', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Comments table
export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email').notNull(),
  postId: integer('post_id').references(() => posts.id),
  userId: integer('user_id').references(() => users.id), // For authenticated users
  anonymousUserId: integer('anonymous_user_id').references(() => anonymousUsers.id), // For anonymous users
  status: text('status', { enum: ['pending', 'approved', 'spam'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Blocked IP addresses table
export const blockedIPs = sqliteTable('blocked_ips', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ipAddress: text('ip_address').notNull().unique(),
  reason: text('reason').notNull(),
  blockedBy: integer('blocked_by').references(() => users.id),
  blockedAt: integer('blocked_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
});

// Security events table for monitoring security incidents
export const securityEvents = sqliteTable('security_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', { enum: ['failed_login', 'suspicious_ip', 'brute_force', 'spam_comment', 'file_access', 'api_abuse'] }).notNull(),
  ip: text('ip').notNull(),
  userAgent: text('user_agent'),
  details: text('details').notNull(),
  severity: text('severity', { enum: ['low', 'medium', 'high', 'critical'] }).notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  resolved: integer('resolved', { mode: 'boolean' }).default(false),
});

// Tags table
export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Post tags junction table
export const postTags = sqliteTable('post_tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').references(() => posts.id),
  tagId: integer('tag_id').references(() => tags.id),
});

// Likes table
export const likes = sqliteTable('likes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').references(() => posts.id),
  userId: integer('user_id').references(() => users.id), // For authenticated users
  anonymousUserId: integer('anonymous_user_id').references(() => anonymousUsers.id), // For anonymous users
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Settings table for blog configuration
export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(), // Store as JSON string for flexibility
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}); 