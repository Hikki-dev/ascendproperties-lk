"use server";

import cloudinary from '@/lib/cloudinary';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  const folder = (formData.get('bucket') as string) || 'ascend-properties'; // Use bucket as folder

  if (!file) {
    return { error: 'No file provided' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using a Promise wrapper
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto', // Detect image/video
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return { url: result.secure_url };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return { error: 'Failed to upload image' };
  }
}
