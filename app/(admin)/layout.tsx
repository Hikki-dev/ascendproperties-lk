import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogOut, LayoutDashboard, PlusCircle } from "lucide-react";

// Server Action for logging out
async function logout() {
  "use server";
  const supabase = await createClient(); 
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient(); 
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-hover">
      <nav className="w-64 bg-card p-6 flex flex-col shadow-lg border-r border-border-light">
        <div className="text-xl font-bold text-text-primary mb-8">Admin Panel</div>
        <ul className="space-y-2">
          <li>
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-primary">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/add-property" className="flex items-center gap-2 text-text-secondary hover:text-primary">
              <PlusCircle className="w-5 h-5" />
              Add Property
            </Link>
          </li>
        </ul>
        <div className="mt-auto">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 text-text-secondary hover:text-accent-error w-full"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </form>
        </div>
      </nav>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}