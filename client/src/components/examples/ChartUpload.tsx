import { useState } from 'react';
import ChartUpload from '../ChartUpload';

export default function ChartUploadExample() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  return (
    <div className="p-4 bg-background max-w-lg">
      <ChartUpload
        imagePreviewUrl={imageUrl}
        onImageSelect={(file, url) => {
          console.log('Image selected:', file.name);
          setImageUrl(url);
        }}
        onClearImage={() => setImageUrl(null)}
      />
    </div>
  );
}
