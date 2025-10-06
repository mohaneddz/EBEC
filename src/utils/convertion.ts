import imageCompression from 'browser-image-compression';

export async function compressToAvif(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,         // target below 1MB
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    fileType: 'image/avif',
    initialQuality: 0.8,  // adjust for higher compression
  };
  return await imageCompression(file, options);
}
