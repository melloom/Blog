import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { settings, posts, categories, tags } from '@/lib/db/schema';

export async function GET() {
  try {
    // Test database connection and basic queries
    const results = {
      settings: await db.select().from(settings).all(),
      posts: await db.select().from(posts).all(),
      categories: await db.select().from(categories).all(),
      tags: await db.select().from(tags).all(),
    };
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        settingsCount: results.settings.length,
        postsCount: results.posts.length,
        categoriesCount: results.categories.length,
        tagsCount: results.tags.length,
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 