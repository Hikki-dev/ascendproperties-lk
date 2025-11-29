"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { ImageCropper } from '@/components/ui/image-cropper';
import { uploadImage } from '@/app/actions/upload';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  bucket?: string;
  maxFiles?: number;
}

export function ImageUpload({ value, onChange, disabled, bucket = 'properties', maxFiles }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // If multiple files (or just one but we want to skip crop for bulk), upload all directly
      // For now, let's keep crop ONLY if exactly 1 file is selected AND we are not in a "bulk mode" explicitly?
      // Actually, standard behavior: 1 file -> crop. >1 files -> bulk upload no crop.
      
      if (files.length === 1) {
        const file = files[0];
        setPendingFile(file);
        const reader = new FileReader();
        reader.addEventListener('load', () => setCroppingImage(reader.result as string));
        reader.readAsDataURL(file);
      } else {
        // Bulk upload
        setIsUploading(true);
        try {
          const newUrls: string[] = [];
          
          for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;
            
            const formData = new FormData();
            formData.append('file', file, fileName); // Direct file, no crop
            formData.append('bucket', bucket);
            formData.append('path', filePath);

            const result = await uploadImage(formData);
            if (result.error) throw new Error(result.error);
            if (result.url) newUrls.push(result.url);
          }

          onChange([...value, ...newUrls]);
        } catch (error) {
          console.error('Error uploading images:', error);
          alert('Error uploading images: ' + (error as Error).message);
        } finally {
          setIsUploading(false);
        }
      }
      
      // Reset input
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
      
      const formData = new FormData();
      formData.append('file', croppedBlob, fileName);
      formData.append('bucket', bucket);
      formData.append('path', filePath);

      const result = await uploadImage(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.url) {
        if (maxFiles === 1) {
          onChange([result.url]); // Replace existing
        } else {
          onChange([...value, result.url]); // Append
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
      setPendingFile(null);
    }
  };

  const onRemove = (url: string) => {
    onChange(value.filter((current) => current !== url));
  };

  const isSingleMode = maxFiles === 1;
  const hasImage = value.length > 0;

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

      {/* Hidden Input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={onSelectFile}
        disabled={disabled || isUploading}
        multiple={maxFiles !== 1}
      />

      {/* Single Image Mode */}
      {isSingleMode && hasImage ? (
        <div 
          className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-border-light group cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image
            fill
            src={value[0]}
            alt="Uploaded Image"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="text-white flex flex-col items-center gap-2">
               <ImagePlus className="h-8 w-8" />
               <span className="font-medium">Click to change</span>
             </div>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        /* Multiple Image Mode or Empty Single Mode */
        <>
          {value.length > 0 && !isSingleMode && (
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
          )}
          
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
        </>
      )}
    </div>
  );
}
