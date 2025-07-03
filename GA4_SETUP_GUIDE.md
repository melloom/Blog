# Google Analytics 4 Setup Guide

This guide will help you set up Google Analytics 4 credentials for your blog application.

## Prerequisites
- A Google account
- A Google Analytics 4 property (or create one)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project"
4. Enter a project name (e.g., "my-blog-analytics")
5. Click "Create"

### 2. Enable Google Analytics Data API

1. In your project, go to **APIs & Services** > **Library**
2. Search for "Google Analytics Data API"
3. Click on it and press **Enable**

### 3. Create a Service Account

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Fill in the details:
   - **Service account name**: `analytics-service-account`
   - **Service account ID**: Will auto-generate
   - **Description**: `Service account for Google Analytics API access`
4. Click **Create and Continue**
5. Skip the optional steps and click **Done**

### 4. Generate JSON Key

1. In the **Credentials** page, find your service account and click on it
2. Go to the **Keys** tab
3. Click **Add Key** > **Create new key**
4. Select **JSON** format
5. Click **Create**
6. The JSON file will download automatically

### 5. Get Your GA4 Property ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property (or create one if needed)
3. Go to **Admin** (gear icon) > **Property Settings**
4. Copy the **Property ID** (it's a number like `123456789`)

### 6. Grant Access to GA4

1. In Google Analytics, go to **Admin** > **Property** > **Property access management**
2. Click the **+** button > **Add users**
3. Add your service account email (found in the JSON file under `client_email`)
4. Give it **Viewer** permissions
5. Click **Add**

### 7. Format Credentials for Your App

1. Place the downloaded JSON file in your project root directory
2. Run the helper script:
   ```bash
   node scripts/setup-ga4.js your-credentials-file.json
   ```
3. Copy the output to your `.env.local` file

### 8. Update Environment Variables

Replace the Google Analytics section in your `.env.local` file:

```env
# ───── Google Analytics ─────
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-YOUR_MEASUREMENT_ID
ANALYTICS_PROVIDER=google
GA4_PROPERTY_ID=YOUR_PROPERTY_ID_HERE
GA4_CREDENTIALS_JSON="YOUR_FORMATTED_JSON_HERE"
```

### 9. Test the Setup

1. Restart your development server
2. Go to `/admin/analytics` in your app
3. You should see analytics data instead of errors

## Troubleshooting

### Common Issues

1. **"Invalid Google Analytics credentials format"**
   - Make sure the JSON is properly escaped in `.env.local`
   - Use the helper script to format it correctly

2. **"Permission denied"**
   - Ensure the service account email has access to your GA4 property
   - Check that the Property ID is correct

3. **"No data available"**
   - Make sure your GA4 property has data
   - Check that the date range is appropriate

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure the service account has proper permissions

## Security Notes

- Never commit your JSON credentials to version control
- Keep your service account keys secure
- Consider using environment variables in production 