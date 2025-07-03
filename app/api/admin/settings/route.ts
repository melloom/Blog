import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/admin/settings
export async function GET() {
  try {
    // Try to get the database, but handle the case where it's not available
    let db
    try {
      db = getDb()
    } catch (dbError) {
      console.warn('Database not available during build time, returning default settings')
      // Return default settings when database is not available
      const defaultSettings = {
        siteDescription: 'Exploring the intersection of technology, lifestyle, and modern living',
        adminEmail: 'admin@example.com',
        postsPerPage: 10,
        allowComments: true,
        moderateComments: true,
        autoApproveComments: true,
        enableAnalytics: false,
        googleAnalyticsId: '',
        enableNewsletter: false,
        newsletterProvider: 'mailchimp',
        enableSocialSharing: true,
        enableRSS: true,
        maintenanceMode: false,
        maintenanceMessage: 'Site is under maintenance. Please check back soon.',
        defaultPostStatus: 'draft',
        defaultUserRole: 'editor',
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
        customCss: '',
        customJs: '',
        disqusShortname: '',
        showAuthor: true,
        showReadingTime: true,
        enableDarkMode: false,
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        logoUrl: '',
        faviconUrl: '',
        metaKeywords: '',
        metaDescription: '',
        socialLinks: {
          twitter: '',
          facebook: '',
          instagram: '',
          linkedin: '',
          github: ''
        }
      };
      return NextResponse.json({ settings: defaultSettings });
    }

    const allSettings = await db.select().from(settings).all();
    
    // Convert settings array to object
    const settingsObject: any = {};
    allSettings.forEach(setting => {
      try {
        settingsObject[setting.key] = JSON.parse(setting.value);
      } catch {
        settingsObject[setting.key] = setting.value;
      }
    });
    
    // Default settings if none exist
    const defaultSettings = {
      siteDescription: 'Exploring the intersection of technology, lifestyle, and modern living',
      adminEmail: 'admin@example.com',
      postsPerPage: 10,
      allowComments: true,
      moderateComments: true,
      autoApproveComments: true,
      enableAnalytics: false,
      googleAnalyticsId: '',
      enableNewsletter: false,
      newsletterProvider: 'mailchimp',
      enableSocialSharing: true,
      enableRSS: true,
      maintenanceMode: false,
      maintenanceMessage: 'Site is under maintenance. Please check back soon.',
      defaultPostStatus: 'draft',
      defaultUserRole: 'editor',
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
      customCss: '',
      customJs: '',
      disqusShortname: '',
      showAuthor: true,
      showReadingTime: true,
      enableDarkMode: false,
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      logoUrl: '',
      faviconUrl: '',
      metaKeywords: '',
      metaDescription: '',
      socialLinks: {
        twitter: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        github: ''
      }
    };
    
    const mergedSettings = { ...defaultSettings, ...settingsObject };
    
    return NextResponse.json({ settings: mergedSettings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/admin/settings
export async function PUT(request: NextRequest) {
  try {
    // Try to get the database, but handle the case where it's not available
    let db
    try {
      db = getDb()
    } catch (dbError) {
      console.warn('Database not available during build time, cannot update settings')
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const body = await request.json();
    const newSettings = body;
    
    // Convert settings object to array of key-value pairs
    const settingsArray = Object.entries(newSettings).map(([key, value]) => ({
      key,
      value: JSON.stringify(value)
    }));
    
    // Update or insert each setting
    for (const setting of settingsArray) {
      await db
        .insert(settings)
        .values({
          key: setting.key,
          value: setting.value,
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: settings.key,
          set: {
            value: setting.value,
            updatedAt: new Date()
          }
        });
    }
    
    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
} 