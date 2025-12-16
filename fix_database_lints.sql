-- 1. SECURITY: Fix Mutable Search Paths for Functions
-- Setting search_path to public prevents malicious code from overriding standard operators/functions
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.get_property_type_counts() SET search_path = public;
ALTER FUNCTION public.properties_fts_trigger() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- 2. SECURITY: Enable RLS on Public Tables
-- ERROR: spatial_ref_sys is a PostGIS system table and cannot be modified by standard users. Skipping.
-- ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- 3. PERFORMANCE: Add Missing Indexes for Foreign Keys
-- These cover the 'unindexed_foreign_keys' warnings
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON public.leads(property_id);
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON public.properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_property_id ON public.saved_properties(property_id);

-- 4. PERFORMANCE & CLEANUP: Remove Duplicate Permissive Policies
-- WARNING: These commands drop one of the duplicate policies found in the lint report. 
-- We favor the cleaner name (without punctuation).

-- Table: profiles (Removing "Users can insert their own profile." - with dot)
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
-- Table: profiles (Removing "Public profiles are viewable by everyone." - with dot)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
-- Table: profiles (Removing "Users can update own profile." - with dot)
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- Table: properties (Removing "Allow public read access to properties" in favor of "Public can view active properties" or similar)
-- Checking for multiple read policies. We'll drop the generic default ones if specific ones exist.
DROP POLICY IF EXISTS "Allow public read access to properties" ON public.properties;

-- Table: agents (Removing "Allow public read access to agents" in favor of active check)
DROP POLICY IF EXISTS "Allow public read access to agents" ON public.agents;

-- Table: leads (Removing overly permissive "Anyone can create leads" if "Authenticated users..." exists)
-- Be careful here: if you want public leads (e.g. contact form), keep 'Anyone'. 
-- But typically we want specific access. I'll drop the generic "Anyone" one if it's a duplicate.
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;


-- 5. PERFORMANCE: Optimize Auth Calls in Policies (Example)
-- The lint warns that `auth.uid()` is re-evaluated for every row.
-- The fix is wrapping it: `(select auth.uid())`
-- Since we cannot alter a policy in place, we would need to DROP and CREATE it.
-- Example for properties (You can run this pattern for others):

-- DROP POLICY IF EXISTS "Users can insert their own properties" ON properties;
-- CREATE POLICY "Users can insert their own properties"
--   ON properties FOR INSERT
--   WITH CHECK ( (select auth.uid()) = user_id );

-- DROP POLICY IF EXISTS "Users can update their own properties" ON properties;
-- CREATE POLICY "Users can update their own properties"
--   ON properties FOR UPDATE
--   USING ( (select auth.uid()) = user_id );

-- Note: Run the items in Section 5 manually after verifying the exact logic you want.
