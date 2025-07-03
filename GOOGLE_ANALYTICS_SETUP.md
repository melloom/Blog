# Google Analytics Setup Guide

This guide will help you set up Google Analytics 4 (GA4) for your Next.js blog.

## Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Follow the setup wizard to create your account
4. Create a new property for your blog
5. Choose "Web" as your platform
6. Enter your website details:
   - Website name: "WiredLiving"
   - Website URL: Your blog URL
   - Industry category: "Technology"
   - Reporting time zone: Your timezone

## Step 2: Get Your Measurement ID

1. After creating the property, you'll get a Measurement ID
2. It will look like: `G-XXXXXXXXXX`
3. Copy this ID - you'll need it for the next step

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist) and add:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

## Step 4: Verify Installation

1. Start your development server: `npm run dev`
2. Open your blog in the browser
3. Open Developer Tools (F12)
4. Go to the Network tab
5. Look for requests to `google-analytics.com` or `googletagmanager.com`
6. You should see analytics requests being sent

## Step 5: Test Custom Events

The blog is already configured to track:
- Page views (automatic)
- Post views
- Comments (add, approve, delete)
- Likes/unlikes
- Search queries

## Step 6: View Analytics Data

1. Go back to your Google Analytics dashboard
2. Navigate to "Reports" → "Realtime"
3. You should see your current session
4. Data may take 24-48 hours to appear in standard reports

## Step 7: Set Up Goals (Optional)

In Google Analytics, you can set up goals to track:
- Newsletter signups
- Comment submissions
- Time on site
- Pages per session

## Step 8: Privacy Considerations

- Add a privacy policy to your blog
- Consider adding a cookie consent banner
- Ensure compliance with GDPR/CCPA if applicable

## Troubleshooting

### No data appearing?
1. Check that your Measurement ID is correct
2. Ensure the environment variable is set
3. Clear browser cache and cookies
4. Check browser console for errors

### Events not tracking?
1. Verify the `useAnalytics` hook is being used
2. Check that `window.gtag` is available
3. Ensure you're not in an ad blocker

### Development vs Production
- Analytics work in both environments
- Use different properties for dev/prod if needed
- Test in production for most accurate results

## Advanced Configuration

### Custom Dimensions
You can add custom dimensions to track:
- Post categories
- Author information
- User types (anonymous vs registered)

### Enhanced Ecommerce
For future e-commerce features, you can enable enhanced ecommerce tracking.

## Support

If you encounter issues:
1. Check the Google Analytics Help Center
2. Verify your implementation with Google Tag Assistant
3. Check the browser console for JavaScript errors 