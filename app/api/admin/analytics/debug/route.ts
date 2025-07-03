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
    console.log('GA4_CREDENTIALS_JSON exists:', !!process.env.GA4_CREDENTIALS_JSON)
    console.log('GA4_PROPERTY_ID exists:', !!process.env.GA4_PROPERTY_ID)
    
    if (process.env.GA4_CREDENTIALS_JSON) {
      console.log('GA4_CREDENTIALS_JSON length:', process.env.GA4_CREDENTIALS_JSON.length)
      console.log('GA4_CREDENTIALS_JSON first 50 chars:', process.env.GA4_CREDENTIALS_JSON.substring(0, 50))
      console.log('GA4_CREDENTIALS_JSON last 50 chars:', process.env.GA4_CREDENTIALS_JSON.substring(process.env.GA4_CREDENTIALS_JSON.length - 50))
      
      // Try to parse
      try {
        const credentials = JSON.parse(process.env.GA4_CREDENTIALS_JSON)
        console.log('JSON parse successful')
        console.log('Credential fields:', Object.keys(credentials))
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
          
          // Test private key cleaning
          let cleanPrivateKey = credentials.private_key
          if (cleanPrivateKey.includes('\\n')) {
            cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n')
            console.log('Cleaned private key length:', cleanPrivateKey.length)
            console.log('Cleaned private key starts with:', cleanPrivateKey.substring(0, 50))
            console.log('Cleaned private key ends with:', cleanPrivateKey.substring(cleanPrivateKey.length - 50))
          }
          
          // Check PEM format
          const hasPemHeaders = cleanPrivateKey.includes('-----BEGIN PRIVATE KEY-----') && cleanPrivateKey.includes('-----END PRIVATE KEY-----')
          console.log('Has proper PEM headers:', hasPemHeaders)
        }
        
        // Try to create clean credentials object
        let cleanPrivateKey = credentials.private_key
        if (cleanPrivateKey.includes('\\n')) {
          cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n')
        }
        
        // Additional cleaning for potential double escaping
        if (cleanPrivateKey.includes('\\\\n')) {
          cleanPrivateKey = cleanPrivateKey.replace(/\\\\n/g, '\n')
        }
        
        // Ensure proper line breaks in PEM format
        if (!cleanPrivateKey.includes('\n-----BEGIN PRIVATE KEY-----')) {
          cleanPrivateKey = cleanPrivateKey.replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
        }
        if (!cleanPrivateKey.includes('-----END PRIVATE KEY-----\n')) {
          cleanPrivateKey = cleanPrivateKey.replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----')
        }
        
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
                rows: testResponse[0].rows?.length || 0
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
      } catch (parseError) {
        console.log('JSON parse failed:', parseError)
        return NextResponse.json({
          success: false,
          error: 'JSON parse failed',
          message: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        })
      }
    } else {
      console.log('GA4_CREDENTIALS_JSON is not set')
      return NextResponse.json({
        success: false,
        error: 'Credentials not set',
        message: 'GA4_CREDENTIALS_JSON environment variable is not set'
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