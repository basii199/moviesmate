// app/api/auth/sync/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Properly await the cookie operations
    const { data: { session } } = await supabase.auth.getSession()
    
    return NextResponse.json({ 
      success: true,
      session: session 
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sync session' },
      { status: 500 }
    )
  }
}