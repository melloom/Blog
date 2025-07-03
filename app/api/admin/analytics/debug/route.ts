import { NextRequest, NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

export async function GET(
  request: NextRequest,
  { searchParams }: { searchParams: URLSearchParams }
) {
  try {
    // Handle case where searchParams might be undefined during static generation
    const provider = searchParams?.get('provider') || 'google'
    
    console.log('=== DEBUG START ===')
    console.log('Provider:', provider)
    
    // Check for individual environment variables (consistent with main route)
    const hasIndividualVars = !!(
      process.env.GA4_TYPE && 
      process.env.GA4_PROJECT_ID && 
      process.env.GA4_PRIVATE_KEY_ID && 
      process.env.GA4_PRIVATE_KEY && 
      process.env.GA4_CLIENT_EMAIL && 
      process.env.GA4_CLIENT_ID && 
      process.env.GA4_AUTH_URI && 
      process.env.GA4_TOKEN_URI && 
      process.env.GA4_AUTH_PROVIDER_X509_CERT_URL && 
      process.env.GA4_CLIENT_X509_CERT_URL && 
      process.env.GA4_UNIVERSE_DOMAIN && 
      process.env.GA4_PROPERTY_ID
    )
    
    console.log('Individual GA4 variables exist:', hasIndividualVars)
    console.log('GA4_PROPERTY_ID exists:', !!process.env.GA4_PROPERTY_ID)
    
    if (hasIndividualVars) {
      // Create credentials object with properly formatted private key
      const credentials = {
        type: process.env.GA4_TYPE,
        project_id: process.env.GA4_PROJECT_ID,
        private_key_id: process.env.GA4_PRIVATE_KEY_ID,
        private_key: process.env.GA4_PRIVATE_KEY || '',
        client_email: process.env.GA4_CLIENT_EMAIL,
        client_id: process.env.GA4_CLIENT_ID,
        auth_uri: process.env.GA4_AUTH_URI,
        token_uri: process.env.GA4_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GA4_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GA4_CLIENT_X509_CERT_URL,
        universe_domain: process.env.GA4_UNIVERSE_DOMAIN
      }
      
      // Simple private key formatting
      let cleanPrivateKey = credentials.private_key
      if (cleanPrivateKey.includes('\\n')) {
        cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n')
      }
      
      // Ensure proper PEM format
      if (!cleanPrivateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
        cleanPrivateKey = '-----BEGIN PRIVATE KEY-----\n' + cleanPrivateKey
      }
      if (!cleanPrivateKey.endsWith('-----END PRIVATE KEY-----')) {
        cleanPrivateKey = cleanPrivateKey + '\n-----END PRIVATE KEY-----'
      }
      
      credentials.private_key = cleanPrivateKey
      
      console.log('Credential fields found:', Object.keys(credentials))
      console.log('Has type:', !!credentials.type)
      console.log('Has project_id:', !!credentials.project_id)
      console.log('Has private_key_id:', !!credentials.private_key_id)
      console.log('Has private_key:', !!credentials.private_key)
      console.log('Has client_email:', !!credentials.client_email)
      
      // Try to initialize the Google Analytics client
      try {
        console.log('Attempting to initialize Google Analytics client...')
        const analyticsDataClient = new BetaAnalyticsDataClient({ credentials: credentials })
        console.log('Google Analytics client initialized successfully')
        
        // Try a simple API call
        if (process.env.GA4_PROPERTY_ID) {
          console.log('Attempting simple API call...')
          console.log('Property format:', `properties/${process.env.GA4_PROPERTY_ID}`)
          console.log('Service account email:', credentials.client_email)
          
          const testResponse = await analyticsDataClient.runReport({
            property: `properties/${process.env.GA4_PROPERTY_ID}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }]
          })
          console.log('API call successful:', testResponse[0].rows?.length || 0, 'rows')
          
          return NextResponse.json({
            success: true,
            message: 'Google Analytics connection successful',
            fields: Object.keys(credentials),
            hasRequiredFields: {
              type: !!credentials.type,
              project_id: !!credentials.project_id,
              private_key_id: !!credentials.private_key_id,
              private_key: !!credentials.private_key,
              client_email: !!credentials.client_email
            },
            privateKeyInfo: {
              length: credentials.private_key.length,
              hasEscapedNewlines: credentials.private_key.includes('\\n'),
              hasActualNewlines: credentials.private_key.includes('\n'),
              hasPemHeaders: credentials.private_key.includes('-----BEGIN PRIVATE KEY-----') && credentials.private_key.includes('-----END PRIVATE KEY-----'),
              startsWith: credentials.private_key.substring(0, 50),
              endsWith: credentials.private_key.substring(credentials.private_key.length - 50)
            },
            apiTest: {
              success: true,
              rows: testResponse[0].rows?.length || 0,
              propertyId: process.env.GA4_PROPERTY_ID,
              serviceAccountEmail: credentials.client_email
            }
          })
        } else {
          return NextResponse.json({
            success: false,
            error: 'Property ID missing',
            message: 'GA4_PROPERTY_ID environment variable is not set'
          })
        }
      } catch (clientError) {
        console.error('Google Analytics client initialization failed:', clientError)
        return NextResponse.json({
          success: false,
          error: 'Client initialization failed',
          message: clientError instanceof Error ? clientError.message : 'Unknown client error',
          fields: Object.keys(credentials),
          hasRequiredFields: {
            type: !!credentials.type,
            project_id: !!credentials.project_id,
            private_key_id: !!credentials.private_key_id,
            private_key: !!credentials.private_key,
            client_email: !!credentials.client_email
          },
          privateKeyInfo: {
            length: credentials.private_key.length,
            hasEscapedNewlines: credentials.private_key.includes('\\n'),
            hasActualNewlines: credentials.private_key.includes('\n'),
            hasPemHeaders: credentials.private_key.includes('-----BEGIN PRIVATE KEY-----') && credentials.private_key.includes('-----END PRIVATE KEY-----'),
            startsWith: credentials.private_key.substring(0, 50),
            endsWith: credentials.private_key.substring(credentials.private_key.length - 50)
          }
        })
      }
    } else {
      console.log('Individual GA4 variables are not set')
      return NextResponse.json({
        success: false,
        error: 'Credentials not set',
        message: 'Individual GA4 environment variables are not set. Please configure GA4_TYPE, GA4_PROJECT_ID, GA4_PRIVATE_KEY_ID, GA4_PRIVATE_KEY, GA4_CLIENT_EMAIL, GA4_CLIENT_ID, GA4_AUTH_URI, GA4_TOKEN_URI, GA4_AUTH_PROVIDER_X509_CERT_URL, GA4_CLIENT_X509_CERT_URL, GA4_UNIVERSE_DOMAIN, and GA4_PROPERTY_ID environment variables'
      })
    }
  } catch (error) {
    console.log('Unexpected error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 