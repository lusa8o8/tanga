const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const isCloudinaryConfigured = !!cloudName && cloudName !== 'REPLACE_ME' && !!uploadPreset && uploadPreset !== 'REPLACE_ME';

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!isCloudinaryConfigured) {
    // Fallback: return a local object URL for preview only (not persisted)
    console.warn("Cloudinary is not configured. Falling back to local blob URL.");
    return URL.createObjectURL(file);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset!);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url as string;
}
