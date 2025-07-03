import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateToken } from '@/lib/auth'
import { trackFailedLogin } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    if (!email || !password) {
      // Track failed login attempt
      await trackFailedLogin(ip, userAgent, 'Missing email or password')
      
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      // Track failed login attempt
      await trackFailedLogin(ip, userAgent, `Failed login attempt for email: ${email}`)
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role ?? '',
    })

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role ?? '',
      },
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    
    // Track failed login attempt due to server error
    const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    await trackFailedLogin(ip, userAgent, 'Server error during login')
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 