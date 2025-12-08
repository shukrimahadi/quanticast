import { useState, useRef, useCallback } from 'react';
import { Upload, Camera, Image as ImageIcon, X, ZoomIn } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ChartUploadProps {
  imagePreviewUrl: string | null;
  onImageSelect: (file: File, previewUrl: string) => void;
  onClearImage: () => void;
  isProcessing?: boolean;
}

export default function ChartUpload({
  imagePreviewUrl,
  onImageSelect,
  onClearImage,
  isProcessing = false
}: ChartUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onImageSelect(file, url);
    }
  }, [onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageSelect(file, url);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            onImageSelect(file, url);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  if (showCamera) {
    return (
      <Card className="p-4 space-y-4">
        <div className="relative aspect-video bg-black rounded-md overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={capturePhoto} data-testid="button-capture">
            <Camera className="w-4 h-4 mr-2" />
            Capture
          </Button>
          <Button variant="outline" onClick={stopCamera} data-testid="button-cancel-camera">
            Cancel
          </Button>
        </div>
      </Card>
    );
  }

  if (imagePreviewUrl) {
    return (
      <Card className="p-4 space-y-4">
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden group">
          <img
            src={imagePreviewUrl}
            alt="Chart preview"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" variant="secondary" data-testid="button-zoom">
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <img
                  src={imagePreviewUrl}
                  alt="Chart full size"
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>
            <Button 
              size="icon" 
              variant="destructive" 
              onClick={onClearImage}
              disabled={isProcessing}
              data-testid="button-clear-image"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Chart loaded successfully. Select a strategy and analyze.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        data-testid="input-file"
      />
      
      <div
        className={`
          border-2 border-dashed rounded-md p-8 text-center transition-colors cursor-pointer
          ${isDragging 
            ? 'border-fin-accent bg-fin-accent/5' 
            : 'border-border hover:border-muted-foreground'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        data-testid="dropzone"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Drop your chart here</p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse files
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>PNG, JPG, WEBP</span>
            <span>Max 10MB</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button variant="outline" onClick={startCamera} data-testid="button-camera">
          <Camera className="w-4 h-4 mr-2" />
          Use Camera
        </Button>
      </div>
    </Card>
  );
}
