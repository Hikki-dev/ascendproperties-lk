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
    const checkStatus = async () => {
      if (session?.user?.email) {
        try {
          const saved = await checkIsSaved(propertyId, session.user.email);
          setIsSaved(saved);
        } catch (err) {
          console.error("Error checking status:", err);
        }
      }
    };
    checkStatus();
  }, [propertyId, session]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      alert("Please login to save properties");
      return;
    }

    if (!session.user?.email) return;

    // Optimistic update
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    try {
      const result = await toggleSaveProperty(propertyId, session.user.email);
      
      // If server result differs from optimistic state, revert
      if (result.saved !== newSavedState) {
        setIsSaved(result.saved);
      }
      
      router.refresh();
    } catch (error) {
      console.error("Error saving property", error);
      // Revert on error
      setIsSaved(!newSavedState);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all active:scale-90"
      onClick={handleToggle}
      disabled={loading}
    >
      <Heart 
        className={cn(
          "w-5 h-5 transition-all duration-300", 
          isSaved 
            ? "fill-accent-error text-accent-error animate-heart-pop" 
            : "fill-white/70 text-black hover:scale-110"
        )} 
      />
    </Button>
  );
}
