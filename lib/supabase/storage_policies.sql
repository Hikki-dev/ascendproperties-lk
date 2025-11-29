-- Enable RLS on storage.objects (usually enabled by default in Supabase)
-- alter table storage.objects enable row level security;

-- AVATARS BUCKET POLICIES
-- Allow public read access to avatars
create policy "Public Access Avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload avatars
create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Allow users to update/delete their own avatars
create policy "Users can update own avatars"
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.uid() = owner );

create policy "Users can delete own avatars"
  on storage.objects for delete
  using ( bucket_id = 'avatars' and auth.uid() = owner );


-- PROPERTIES BUCKET POLICIES
-- Allow public read access to properties
create policy "Public Access Properties"
  on storage.objects for select
  using ( bucket_id = 'properties' );

-- Allow authenticated users to upload property images
create policy "Authenticated users can upload property images"
  on storage.objects for insert
  with check ( bucket_id = 'properties' and auth.role() = 'authenticated' );

-- Allow users to update/delete their own property images
create policy "Users can update own property images"
  on storage.objects for update
  using ( bucket_id = 'properties' and auth.uid() = owner );

create policy "Users can delete own property images"
  on storage.objects for delete
  using ( bucket_id = 'properties' and auth.uid() = owner );
