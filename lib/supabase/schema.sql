-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Properties Table
create table properties (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  title text not null,
  slug text not null unique,
  description text,
  
  property_type text not null check (property_type in ('House', 'Apartment', 'Land', 'Commercial')),
  status text not null default 'sale' check (status in ('sale', 'rent', 'sold', 'off_market')),
  
  price numeric not null,
  
  location_city text not null,
  location_district text not null,
  address text,
  
  bedrooms integer,
  bathrooms integer,
  size_sqft numeric,
  
  photos text[] default array[]::text[],
  amenities text[] default array[]::text[],
  
  is_featured boolean default false,
  views_count integer default 0,
  
  user_id uuid references auth.users(id)
);

-- Enable RLS
alter table properties enable row level security;

-- Policies
create policy "Public properties are viewable by everyone"
  on properties for select
  using ( status != 'off_market' );

create policy "Users can insert their own properties"
  on properties for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own properties"
  on properties for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own properties"
  on properties for delete
  using ( auth.uid() = user_id );


-- Enquiries Table
create table enquiries (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  property_id uuid references properties(id),
  user_id uuid references auth.users(id), -- Optional, if logged in
  
  name text not null,
  email text not null,
  phone text not null,
  message text,
  
  status text default 'new' check (status in ('new', 'contacted', 'closed'))
);

-- Enable RLS
alter table enquiries enable row level security;

-- Policies
create policy "Users can insert enquiries"
  on enquiries for insert
  with check ( true );

create policy "Users can view their own enquiries"
  on enquiries for select
  using ( auth.uid() = user_id );

-- Saved Properties Table
create table saved_properties (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  user_id text not null,
  property_id uuid references properties(id) not null,
  
  unique(user_id, property_id)
);

-- Enable RLS
alter table saved_properties enable row level security;

-- Policies
create policy "Users can view their own saved properties"
  on saved_properties for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own saved properties"
  on saved_properties for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own saved properties"
  on saved_properties for delete
  using ( auth.uid() = user_id );
  
-- Function for property type counts
create or replace function get_property_type_counts()
returns table (property_type text, count bigint)
language sql
as $$
  select 
    property_type,
    count(*) as count
  from properties
  where status != 'off_market'
  group by property_type;
$$;
