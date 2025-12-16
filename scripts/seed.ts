
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const properties = [
  {
    title: "Modern Sea View Apartment",
    slug: "modern-sea-view-apartment-colombo-03",
    property_type: "apartment",
    status: "sale",
    price: 85000000,
    location_district: "Colombo",
    location_city: "Colombo 03",
    address: "Marine Drive, Colombo 03",
    bedrooms: 3,
    bathrooms: 2,
    size_sqft: 1600,
    amenities: ["Sea View", "Gym", "Rooftop Pool", "Parking", "24/7 Security"],
    description: "Experience luxury living with breathtaking ocean views in this modern 3-bedroom apartment on Marine Drive. Featuring high-end finishes, a spacious balcony, and access to premium building amenities including a rooftop infinity pool.",
    photos: [
      "https://images.unsplash.com/photo-1512918760532-3edbed71747b?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"
    ],
    is_featured: true
  },
  {
    title: "Luxury Suite at Galle Face",
    slug: "luxury-suite-galle-face",
    property_type: "apartment",
    status: "rent",
    price: 450000, // Monthly rent
    location_district: "Colombo",
    location_city: "Galle Face",
    address: "Galle Face Centre Road, Colombo",
    bedrooms: 2,
    bathrooms: 2,
    size_sqft: 1400,
    amenities: ["Ocean View", "Concierge", "Spa", "Pool", "Furnished"],
    description: "A prestigious address right opposite the Galle Face Green. This fully furnished exquisite suite offers unmatched convenience and style for the discerning professional.",
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502005229766-3450ccc0346d?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=800&q=80"
    ],
    is_featured: true
  },
  {
    title: "Spacious Family Home in Rajagiriya",
    slug: "spacious-family-home-rajagiriya",
    property_type: "house",
    status: "sale",
    price: 125000000,
    location_district: "Colombo",
    location_city: "Rajagiriya",
    address: "Parliament Road, Rajagiriya",
    bedrooms: 4,
    bathrooms: 4,
    size_sqft: 3500,
    amenities: ["Garden", "Garage", "Maids Room", "Solar Power", "Quiet Neighborhood"],
    description: "A beautiful architect-designed home in a quiet residential lane in Rajagiriya. Features a large landscaped garden, double height ceilings, and modern fittings throughout. Perfect for a growing family.",
    photos: [
      "https://images.unsplash.com/photo-1600596542815-2a4d04774c13?w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    ],
    is_featured: false
  },
  {
    title: "Commercial Space in Colombo 03",
    slug: "commercial-space-colombo-03",
    property_type: "commercial",
    status: "rent",
    price: 850000,
    location_district: "Colombo",
    location_city: "Colombo 03",
    address: "Duplication Road, Colombo 03",
    bedrooms: 0,
    bathrooms: 2,
    size_sqft: 2200,
    amenities: ["Central AC", "Lift", "Backup Generator", "Main Road Facing"],
    description: "Prime office listing on Duplication Road. Open plan layout, ideal for a tech company or showroom. Excellent visibility and accessibility.",
    photos: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80"
    ],
    is_featured: false
  },
    {
    title: "Cozy Studio in Colombo 7",
    slug: "cozy-studio-colombo-7",
    property_type: "apartment",
    status: "rent",
    price: 150000,
    location_district: "Colombo",
    location_city: "Colombo 7",
    address: "Ward Place, Colombo 7",
    bedrooms: 1,
    bathrooms: 1,
    size_sqft: 650,
    amenities: ["Furnished", "AC", "Wifi", "Hot Water"],
    description: "Charming studio apartment in the heart of Cinnamon Gardens. Fully furnished with modern decor. Bills included.",
    photos: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80"
    ],
    is_featured: false
  }
];

async function seed() {
  console.log('🌱 Starting seed...');
  
  const { data, error } = await supabase
    .from('properties')
    .insert(properties)
    .select();

  if (error) {
    console.error('❌ Error seeding data:', error);
  } else {
    console.log(`✅ Successfully inserted ${data.length} properties!`);
  }
}

seed();
