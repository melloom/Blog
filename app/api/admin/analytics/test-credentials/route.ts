import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if credentials exist
    if (!process.env.GA4_CREDENTIALS_JSON) {
      return NextResponse.json({
        error: 'Missing credentials',
        message: 'GA4_CREDENTIALS_JSON environment variable is not set'
      }, { status: 400 })
    }

    if (!process.env.GA4_PROPERTY_ID) {
      return NextResponse.json({
        error: 'Missing property ID',
        message: 'GA4_PROPERTY_ID environment variable is not set'
      }, { status: 400 })
    }

    // Test JSON parsing
    let credentials
    try {
      credentials = JSON.parse(process.env.GA4_CREDENTIALS_JSON)
    } catch (parseError) {
      return NextResponse.json({
        error: 'JSON parse error',
        message: 'Failed to parse GA4_CREDENTIALS_JSON as JSON',
        details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      }, { status: 400 })
    }

    // Check required fields
    const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email']
    const missingFields = requiredFields.filter(field => !credentials[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        availableFields: Object.keys(credentials)
      }, { status: 400 })
    }

    // Check credential type
    if (credentials.type !== 'service_account') {
      return NextResponse.json({
        error: 'Invalid credential type',
        message: `Expected 'service_account', got '${credentials.type}'`
      }, { status: 400 })
    }

    // Check private key format
    if (!credentials.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
      return NextResponse.json({
        error: 'Invalid private key format',
        message: 'Private key should start with "-----BEGIN PRIVATE KEY-----"'
      }, { status: 400 })
    }

    // Check for newlines in private key (should be escaped)
    if (credentials.private_key.includes('\n') && !credentials.private_key.includes('\\n')) {
      return NextResponse.json({
        error: 'Unescaped newlines',
        message: 'Private key contains unescaped newlines. Use \\n instead of actual newlines.'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Credentials format looks correct!',
      projectId: credentials.project_id,
      clientEmail: credentials.client_email,
      propertyId: process.env.GA4_PROPERTY_ID,
      credentialLength: process.env.GA4_CREDENTIALS_JSON.length
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Unexpected error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
} 