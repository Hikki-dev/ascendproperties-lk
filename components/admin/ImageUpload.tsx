"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { ImageCropper } from '@/components/ui/image-cropper';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  bucket?: string;
}

export function ImageUpload({ value, onChange, disabled, bucket = 'properties' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPendingFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => setCroppingImage(reader.result as string));
      reader.readAsDataURL(file);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const onCropComplete = async (croppedBlob: Blob) => {
    if (!pendingFile) return;
    
    setIsUploading(true);
    setCroppingImage(null); // Close cropper
    
    try {
      const fileExt = pendingFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Create a File from Blob
      const fileToUpload = new File([croppedBlob], fileName, { type: 'image/jpeg' });

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange([...value, data.publicUrl]);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
      setPendingFile(null);
    }
  };

  const onRemove = (url: string) => {
    onChange(value.filter((current) => current !== url));
  };

  return (
    <div className="space-y-4">
      {croppingImage && (
        <ImageCropper
          imageSrc={croppingImage}
          onCropComplete={onCropComplete}
          onCancel={() => {
            setCroppingImage(null);
            setPendingFile(null);
          }}
          aspect={bucket === 'avatars' ? 1 : 16 / 9}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url) => (
          <div key={url} className="relative aspect-video rounded-lg overflow-hidden border border-border-light group">
            <Image
              fill
              src={url}
              alt="Uploaded Image"
              className="object-cover"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={onSelectFile}
          disabled={disabled || isUploading}
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          variant="outline"
          className="w-full h-24 border-dashed border-2 border-border-light hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-2 text-text-secondary hover:text-primary transition-colors"
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <ImagePlus className="h-6 w-6" />
          )}
          <span className="font-medium">
            {isUploading ? 'Uploading...' : 'Click to upload image'}
          </span>
        </Button>
      </div>
    </div>
  );
}
