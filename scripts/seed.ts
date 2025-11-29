
import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';

// Load environment variables from .env.local
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const sampleProperties = [
  {
    title: 'Luxury 3BR Apartment - Park View',
    slug: 'luxury-3br-apartment-park-view',
    description: 'Stunning 3-bedroom apartment with panoramic views of Viharamahadevi Park. Features modern amenities, rooftop pool, and 24/7 security.',
    price: 45000000, // 45M LKR
    status: 'sale',
    property_type: 'apartment',
    location_city: 'Colombo 7',
    location_district: 'Colombo',
    bedrooms: 3,
    bathrooms: 2,
    size_sqft: 1850,
    amenities: ['Air Conditioning', 'Swimming Pool', 'Gym', 'Parking', 'Security', 'Elevator'],
    photos: ['https://placehold.co/800x600/1a1a1a/ffffff?text=Luxury+Apartment'],
    is_featured: true,
  },
  {
    title: 'Modern 4BR Villa with Pool',
    slug: 'modern-4br-villa-with-pool',
    description: 'Architecturally designed 4-bedroom villa in a quiet residential area. Includes a private pool, landscaped garden, and spacious living areas.',
    price: 85000000, // 85M LKR
    status: 'sale',
    property_type: 'house',
    location_city: 'Nugegoda',
    location_district: 'Colombo',
    bedrooms: 4,
    bathrooms: 4,
    size_sqft: 3200,
    amenities: ['Swimming Pool', 'Garden', 'Solar Power', 'Maids Room', 'CCTV'],
    photos: ['https://placehold.co/800x600/2a2a2a/ffffff?text=Modern+Villa'],
    is_featured: true,
  },
  {
    title: 'Prime Office Space - Liberty Plaza',
    slug: 'prime-office-space-liberty-plaza',
    description: 'Premium office space located in the heart of Colombo 3. Fully furnished with meeting rooms and high-speed internet infrastructure.',
    price: 500000, // 500k LKR (Rent)
    status: 'rent',
    property_type: 'commercial',
    location_city: 'Colombo 3',
    location_district: 'Colombo',
    bedrooms: 0,
    bathrooms: 2,
    size_sqft: 1500,
    amenities: ['Central AC', 'Parking', 'Security', 'Backup Generator'],
    photos: ['https://placehold.co/800x600/3a3a3a/ffffff?text=Office+Space'],
    is_featured: false,
  },
  {
    title: 'Beachfront 5BR House - Negombo',
    slug: 'beachfront-5br-house-negombo',
    description: 'Exquisite beachfront property with direct access to the ocean. Perfect for a holiday home or boutique villa.',
    price: 125000000, // 125M LKR
    status: 'sale',
    property_type: 'house',
    location_city: 'Negombo',
    location_district: 'Gampaha',
    bedrooms: 5,
    bathrooms: 5,
    size_sqft: 4500,
    amenities: ['Beach Access', 'Pool', 'Garden', 'Staff Quarters'],
    photos: ['https://placehold.co/800x600/4a4a4a/ffffff?text=Beach+House'],
    is_featured: true,
  },
  {
    title: '10 Perch Land - Kandy City',
    slug: '10-perch-land-kandy-city',
    description: 'Prime residential land plot within walking distance to Kandy city center. Elevated land with scenic views.',
    price: 15000000, // 15M LKR
    status: 'sale',
    property_type: 'land',
    location_city: 'Kandy',
    location_district: 'Kandy',
    bedrooms: 0,
    bathrooms: 0,
    size_sqft: 2722, // approx for 10 perches
    amenities: ['Water', 'Electricity', 'Road Access'],
    photos: ['https://placehold.co/800x600/5a5a5a/ffffff?text=Land+Plot'],
    is_featured: false,
  },
  {
    title: '2BR Apartment - Sea View',
    slug: '2br-apartment-sea-view',
    description: 'Cozy 2-bedroom apartment with stunning sea views in Mount Lavinia. Fully furnished and ready to move in.',
    price: 100000, // 100k LKR (Rent)
    status: 'rent',
    property_type: 'apartment',
    location_city: 'Mount Lavinia',
    location_district: 'Colombo',
    bedrooms: 2,
    bathrooms: 1,
    size_sqft: 950,
    amenities: ['Sea View', 'Balcony', 'AC', 'Hot Water'],
    photos: ['https://placehold.co/800x600/6a6a6a/ffffff?text=Sea+View+Apt'],
    is_featured: false,
  },
  {
    title: 'Luxury Penthouse - 360° City Views',
    slug: 'luxury-penthouse-360-city-views',
    description: 'Exclusive penthouse suite offering breathtaking 360-degree views of the Colombo skyline. The epitome of luxury living.',
    price: 95000000, // 95M LKR
    status: 'sale',
    property_type: 'apartment',
    location_city: 'Colombo 4',
    location_district: 'Colombo',
    bedrooms: 4,
    bathrooms: 4,
    size_sqft: 3500,
    amenities: ['Private Elevator', 'Jacuzzi', 'Roof Terrace', 'Concierge'],
    photos: ['https://placehold.co/800x600/7a7a7a/ffffff?text=Penthouse'],
    is_featured: true,
  },
  {
    title: 'Colonial Villa - Galle Fort Area',
    slug: 'colonial-villa-galle-fort-area',
    description: 'Beautifully restored colonial-era villa near the historic Galle Fort. A unique property with immense character.',
    price: 55000000, // 55M LKR
    status: 'sale',
    property_type: 'house',
    location_city: 'Galle Fort',
    location_district: 'Galle',
    bedrooms: 3,
    bathrooms: 2,
    size_sqft: 2200,
    amenities: ['Courtyard', 'Antique Furniture', 'Veranda'],
    photos: ['https://placehold.co/800x600/8a8a8a/ffffff?text=Colonial+Villa'],
    is_featured: false,
  },
  {
    title: 'Modern 2BR Apartment - Rajagiriya',
    slug: 'modern-2br-apartment-rajagiriya',
    description: 'Contemporary 2-bedroom apartment in a newly built complex in Rajagiriya. Convenient location near schools and supermarkets.',
    price: 28000000, // 28M LKR
    status: 'sale',
    property_type: 'apartment',
    location_city: 'Rajagiriya',
    location_district: 'Colombo',
    bedrooms: 2,
    bathrooms: 2,
    size_sqft: 1100,
    amenities: ['Gym', 'Pool', 'Car Park'],
    photos: ['https://placehold.co/800x600/9a9a9a/ffffff?text=Modern+Apt'],
    is_featured: false,
  },
  {
    title: 'Warehouse - Kelaniya',
    slug: 'warehouse-kelaniya',
    description: 'Large warehouse space suitable for logistics or manufacturing. High ceilings and container access.',
    price: 300000, // 300k LKR (Rent)
    status: 'rent',
    property_type: 'commercial',
    location_city: 'Kelaniya',
    location_district: 'Gampaha',
    bedrooms: 0,
    bathrooms: 2,
    size_sqft: 5000,
    amenities: ['3 Phase Electricity', 'Loading Bay', 'Office Room'],
    photos: ['https://placehold.co/800x600/aa1a1a/ffffff?text=Warehouse'],
    is_featured: false,
  },
  {
    title: 'Budget-Friendly 1BR Apartment',
    slug: 'budget-friendly-1br-apartment',
    description: 'Affordable 1-bedroom apartment in Wellawatte. Ideal for a single professional or student.',
    price: 10000000, // 10M LKR (Wait, maybe 100k rent? Let's say rent for budget)
    status: 'rent',
    property_type: 'apartment',
    location_city: 'Wellawatte',
    location_district: 'Colombo',
    bedrooms: 1,
    bathrooms: 1,
    size_sqft: 600,
    amenities: ['Security', 'Lift'],
    photos: ['https://placehold.co/800x600/bb2a2a/ffffff?text=Budget+Apt'],
    is_featured: false,
  },
  {
    title: '3BR House - Quiet Neighborhood',
    slug: '3br-house-quiet-neighborhood',
    description: 'Charming 3-bedroom house in a peaceful residential lane in Kottawa. Great for families.',
    price: 38000000, // 38M LKR
    status: 'sale',
    property_type: 'house',
    location_city: 'Kottawa',
    location_district: 'Colombo',
    bedrooms: 3,
    bathrooms: 2,
    size_sqft: 1600,
    amenities: ['Garden', 'Garage'],
    photos: ['https://placehold.co/800x600/cc3a3a/ffffff?text=Quiet+House'],
    is_featured: false,
  },
  {
    title: '20 Perch Land - Gampaha',
    slug: '20-perch-land-gampaha',
    description: 'Spacious 20 perch land block in Gampaha town limits. Clear deeds.',
    price: 12000000, // 12M LKR
    status: 'sale',
    property_type: 'land',
    location_city: 'Gampaha',
    location_district: 'Gampaha',
    bedrooms: 0,
    bathrooms: 0,
    size_sqft: 5445, // 20 perches
    amenities: ['Water', 'Electricity'],
    photos: ['https://placehold.co/800x600/dd4a4a/ffffff?text=Land+Gampaha'],
    is_featured: false,
  },
  {
    title: '3BR Apartment Near Zoo',
    slug: '3br-apartment-near-zoo',
    description: 'Conveniently located 3-bedroom apartment near the Dehiwala Zoo. Close to Galle Road.',
    price: 100000, // 100k Rent
    status: 'rent',
    property_type: 'apartment',
    location_city: 'Dehiwala',
    location_district: 'Colombo',
    bedrooms: 3,
    bathrooms: 2,
    size_sqft: 1300,
    amenities: ['AC', 'Parking'],
    photos: ['https://placehold.co/800x600/ee5a5a/ffffff?text=Apt+Dehiwala'],
    is_featured: false,
  }
];

async function seed() {
  console.log('🌱 Seeding properties...');

  // Optional: Clear existing properties? 
  // For now, let's just upsert based on slug to avoid duplicates
  
  for (const property of sampleProperties) {
    const { error } = await supabase
      .from('properties')
      .upsert(property, { onConflict: 'slug' });

    if (error) {
      console.error(`Error seeding ${property.title}:`, error.message);
    } else {
      console.log(`✅ Seeded: ${property.title}`);
    }
  }

  console.log('✨ Seeding complete!');
}

seed().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
