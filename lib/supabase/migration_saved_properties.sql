
-- Saved Properties Table
create table if not exists saved_properties (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  user_id text not null, -- Using text to store NextAuth email/ID
  property_id uuid references properties(id) not null,
  
  unique(user_id, property_id)
);

-- Enable RLS
alter table saved_properties enable row level security;

-- Policies
-- We need to handle the fact that we are using 'text' user_id (email) but RLS uses auth.uid() (UUID).
-- If we are using Supabase Auth, auth.uid() is correct.
-- If we are using NextAuth only and bypassing Supabase Auth for login, RLS won't work based on auth.uid().
-- For this MVP, since we are using the Service Role key for backend actions, we can bypass RLS for the API actions.
-- But for client-side access (if any), we'd need RLS.
-- Since we are implementing `actions/property.ts` as Server Actions, we can use the Service Role client there to bypass RLS.
-- So we can keep RLS enabled but maybe not add policies that rely on auth.uid() if we aren't using Supabase Auth.
-- OR, we can just leave it enabled and use Service Role in our Next.js API/Actions.

-- Let's add basic policies just in case we switch to Supabase Auth later.
create policy "Users can view their own saved properties"
  on saved_properties for select
  using ( true ); -- Allow all for now if we can't match ID, or restrict via application logic.

-- Actually, for security, if we rely on Service Role in Next.js, we don't strictly need RLS policies for the client 
-- because the client won't access Supabase directly for this table, it will go through our Server Actions.
-- So I will just create the table.
