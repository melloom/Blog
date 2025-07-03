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
      // Build credentials from individual env vars (same as main route)
      const credentials = {
        type: process.env.GA4_TYPE,
        project_id: process.env.GA4_PROJECT_ID,
        private_key_id: process.env.GA4_PRIVATE_KEY_ID,
        private_key: process.env.GA4_PRIVATE_KEY,
        client_email: process.env.GA4_CLIENT_EMAIL,
        client_id: process.env.GA4_CLIENT_ID,
        auth_uri: process.env.GA4_AUTH_URI,
        token_uri: process.env.GA4_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GA4_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GA4_CLIENT_X509_CERT_URL,
        universe_domain: process.env.GA4_UNIVERSE_DOMAIN
      }
      
      console.log('Credential fields found:', Object.keys(credentials))
      console.log('Has type:', !!credentials.type)
      console.log('Has project_id:', !!credentials.project_id)
      console.log('Has private_key_id:', !!credentials.private_key_id)
      console.log('Has private_key:', !!credentials.private_key)
      console.log('Has client_email:', !!credentials.client_email)
      
      // Check private key format
      if (credentials.private_key) {
        console.log('Private key length:', credentials.private_key.length)
        console.log('Private key contains \\n:', credentials.private_key.includes('\\n'))
        console.log('Private key contains actual newlines:', credentials.private_key.includes('\n'))
        console.log('Private key starts with:', credentials.private_key.substring(0, 50))
        console.log('Private key ends with:', credentials.private_key.substring(credentials.private_key.length - 50))
        
        // Test private key cleaning (same as main route)
        let cleanPrivateKey = credentials.private_key
        
        // Remove any extra escaping that might have been added
        if (cleanPrivateKey.includes('\\n')) {
          cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n')
        }
        
        // Additional cleaning for potential double escaping
        if (cleanPrivateKey.includes('\\\\n')) {
          cleanPrivateKey = cleanPrivateKey.replace(/\\\\n/g, '\n')
        }
        
        // Ensure the private key has proper PEM format
        if (!cleanPrivateKey.includes('-----BEGIN PRIVATE KEY-----')) {
          console.error('Private key does not have proper PEM format')
          return NextResponse.json({
            success: false,
            error: 'Invalid private key format',
            message: 'Private key format is invalid - missing PEM headers'
          })
        }
        
        // Ensure proper line breaks in PEM format
        if (!cleanPrivateKey.includes('\n-----BEGIN PRIVATE KEY-----')) {
          cleanPrivateKey = cleanPrivateKey.replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
        }
        if (!cleanPrivateKey.includes('-----END PRIVATE KEY-----\n')) {
          cleanPrivateKey = cleanPrivateKey.replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----')
        }
        
        console.log('Cleaned private key length:', cleanPrivateKey.length)
        console.log('Cleaned private key starts with:', cleanPrivateKey.substring(0, 50))
        console.log('Cleaned private key ends with:', cleanPrivateKey.substring(cleanPrivateKey.length - 50))
        
        // Check PEM format
        const hasPemHeaders = cleanPrivateKey.includes('-----BEGIN PRIVATE KEY-----') && cleanPrivateKey.includes('-----END PRIVATE KEY-----')
        console.log('Has proper PEM headers:', hasPemHeaders)
        
        // Create clean credentials object (same as main route)
        const cleanCredentials = {
          type: credentials.type,
          project_id: credentials.project_id,
          private_key_id: credentials.private_key_id,
          private_key: cleanPrivateKey,
          client_email: credentials.client_email,
          client_id: credentials.client_id,
          auth_uri: credentials.auth_uri,
          token_uri: credentials.token_uri,
          auth_provider_x509_cert_url: credentials.auth_provider_x509_cert_url,
          client_x509_cert_url: credentials.client_x509_cert_url
        }
        
        console.log('Clean credentials object created')
        
        // Try to initialize the Google Analytics client
        try {
          console.log('Attempting to initialize Google Analytics client...')
          const analyticsDataClient = new BetaAnalyticsDataClient({ credentials: cleanCredentials })
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
                hasPemHeaders: cleanPrivateKey.includes('-----BEGIN PRIVATE KEY-----'),
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
              hasPemHeaders: cleanPrivateKey.includes('-----BEGIN PRIVATE KEY-----'),
              startsWith: credentials.private_key.substring(0, 50),
              endsWith: credentials.private_key.substring(credentials.private_key.length - 50)
            }
          })
        }
      } else {
        return NextResponse.json({
          success: false,
          error: 'Private key missing',
          message: 'GA4_PRIVATE_KEY environment variable is not set'
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