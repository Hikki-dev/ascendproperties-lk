export interface Property {
  id: string
  title: string
  slug: string
  property_type: 'apartment' | 'house' | 'land' | 'commercial'
  status: 'sale' | 'rent' | 'sold' | 'off_market'
  price: number
  location_district: string
  location_city: string
  address?: string
  bedrooms?: number
  bathrooms?: number
  size_sqft?: number
  description?: string
  photos: string[]
  amenities?: string[]
  is_featured: boolean
  views_count: number
  created_at: string
}

export interface Lead {
  id: string
  full_name: string
  phone: string
  email: string
  message?: string
  lead_type: 'seller' | 'buyer' | 'landlord' | 'tenant' | 'investor' | 'developer' | 'other'
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
  property_location?: string
  budget_range?: string
  created_at: string
}