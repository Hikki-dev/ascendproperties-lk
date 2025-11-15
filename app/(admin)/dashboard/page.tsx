import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient(); // <-- add await here
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
      <p className="text-text-secondary mt-2">
        Welcome back, {user?.email}!
      </p>
      <div className="mt-6 bg-card p-6 rounded-lg border border-border-light">
        <p>You can add new properties, manage leads, and update site settings here.</p>
      </div>
    </div>
  );
}
