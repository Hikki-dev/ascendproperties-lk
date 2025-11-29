"use client";

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || 'https://placehold.co/800x600/F1F3F6/6E6E6E?text=No+Image');

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={selectedImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
              selectedImage === image ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/50"
            )}
          >
            <Image
              src={image}
              alt={`${title} - Photo ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
