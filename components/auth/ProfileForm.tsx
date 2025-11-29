"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { updateProfile } from "@/app/(public)/profile/actions";
import { useSession } from "next-auth/react";
import { User, Mail, Save } from "lucide-react";

export function ProfileForm({ user }: { user: any }) {
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState<string[]>(user.image ? [user.image] : []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    if (avatar.length > 0) {
      formData.set('avatarUrl', avatar[0]);
    }

    // We need the user ID from the session, but it might not be in the 'user' object passed as prop depending on NextAuth config
    // Assuming we can get it or use the server session to identify.
    // Actually, updateProfile needs userId. Let's pass it from the server component or use session.
    // Wait, client side 'user' object usually doesn't have ID unless configured.
    // Let's assume user.id exists (I added it to session callback earlier).
    
    const result = await updateProfile(user.id, formData);
    
    if (result.message.startsWith('Success')) {
      // Update client-side session
      await update({
        ...user,
        name: formData.get('fullName'),
        image: avatar[0]
      });
    }

    setMessage(result.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.startsWith('Success') ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-error/20 text-accent-error'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <label className="block text-sm font-bold text-text-primary">Profile Picture</label>
        <div className="flex justify-center">
          <div className="w-32">
            <ImageUpload 
              value={avatar} 
              onChange={(urls) => setAvatar([urls[urls.length - 1]])} // Keep only the last uploaded image
              bucket="avatars"
              maxFiles={1}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-text-primary">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            name="fullName"
            defaultValue={user.name}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text-primary bg-white"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-text-primary">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            value={user.email}
            disabled
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light bg-gray-50 text-text-secondary cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-text-secondary">Email cannot be changed.</p>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="ghost" className="w-full" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
