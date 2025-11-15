import { NextRequest, NextResponse } from 'next/server'
// CHANGED: Import the correct server-side admin client
import { createAdminClient } from '@/lib/supabase/server' 

export async function POST(request: NextRequest) {
  try {
    // CHANGED: Instantiate the client inside the function
    const supabaseAdmin = await createAdminClient(); 
    const body = await request.json()
    
    const { full_name, phone, email, message, lead_type } = body
    if (!full_name || !phone || !email || !lead_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Insert lead
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([body]) // 'body' should be fine if its structure matches the table
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      message: 'Thank you! We will contact you within 24 hours.',
      lead_id: data.id 
    }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}