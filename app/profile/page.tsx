import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/auth/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Profile Settings</h1>
        
        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border-light">
          <ProfileForm user={session.user} />
        </div>
      </div>
    </div>
  );
}
