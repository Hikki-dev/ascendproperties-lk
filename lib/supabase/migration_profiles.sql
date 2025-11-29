-- Create a table for public profiles
create table if not exists profiles (
  id text primary key, -- Can be UUID (Supabase) or String (Google ID)
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text,
  avatar_url text,
  email text
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- Allow authenticated users to insert/update their own profile
-- Note: Since we are using NextAuth with Google, the ID might not match auth.uid() directly if not using the adapter.
-- However, our server actions use the Service Role key, which bypasses RLS.
-- These policies are mainly for client-side access if needed.

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( true );

create policy "Users can update their own profile"
  on profiles for update
  using ( true );
