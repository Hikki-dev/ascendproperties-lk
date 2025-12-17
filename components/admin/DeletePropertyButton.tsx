"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteProperty } from '@/app/actions/admin';

export function DeletePropertyButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const result = await deleteProperty(id);

      if (result.error) throw new Error(result.error);

      // No need to manually refresh if the server action revalidates path
      // router.refresh(); 
    } catch (error) {
      console.error('Error deleting property:', error);
      // @ts-ignore
      alert(error.message || 'Error deleting property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8 text-accent-error hover:text-accent-error hover:bg-accent-error/10"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
