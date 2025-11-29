"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toggleSaveProperty, checkIsSaved } from '@/actions/property';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SaveButtonProps {
  propertyId: string;
  className?: string;
}

export function SaveButton({ propertyId, className }: SaveButtonProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      // We use email as ID for this demo if UUID not available, but ideally use ID
      // For now, let's assume session.user.id is available (we might need to add it to session callback)
      // If not, we can't save.
      // I'll assume we updated the session callback in route.ts
      checkIsSaved(propertyId, session.user.email).then(setIsSaved); 
    }
  }, [propertyId, session]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if inside a card
    e.stopPropagation();

    if (!session) {
      // Redirect to login or show modal
      alert("Please login to save properties");
      return;
    }

    if (!session.user?.email) return;

    setLoading(true);
    try {
      const result = await toggleSaveProperty(propertyId, session.user.email);
      setIsSaved(result.saved);
      router.refresh();
    } catch (error) {
      console.error("Error saving property", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full hover:bg-white/20", className)}
      onClick={handleToggle}
      disabled={loading}
    >
      <Heart 
        className={cn(
          "w-5 h-5 transition-colors", 
          isSaved ? "fill-accent-error text-accent-error" : "text-white"
        )} 
      />
    </Button>
  );
}
