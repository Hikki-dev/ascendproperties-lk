import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    let query = supabase
      .from('properties')
      .select('*')
      .in('status', ['sale', 'rent'])
      .not('published_at', 'is', null)
      .order('created_at', { ascending: false })

    const type = searchParams.get('type')
    if (type && type !== 'all') {
      query = query.eq('property_type', type)
    }

    const district = searchParams.get('district')
    if (district) {
      query = query.eq('location_district', district)
    }

    const minPrice = searchParams.get('minPrice')
    if (minPrice) {
      query = query.gte('price', parseInt(minPrice))
    }

    const maxPrice = searchParams.get('maxPrice')
    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice))
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ properties: data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}