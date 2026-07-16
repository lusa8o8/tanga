export async function uploadImage(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let errMessage = response.statusText;
    try {
      const errData = await response.json();
      errMessage = errData.error || errMessage;
    } catch (e) {
      // Ignore json parse error
    }
    throw new Error(`Upload failed: ${errMessage}`);
  }

  const data = await response.json();
  return data.url;
}
