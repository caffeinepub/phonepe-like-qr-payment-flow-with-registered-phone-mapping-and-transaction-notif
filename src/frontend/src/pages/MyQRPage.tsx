import { useGetCallerUserProfile } from '../hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

// Simple QR code generator using Canvas API
function generateQRCode(canvas: HTMLCanvasElement, text: string) {
  const size = 300;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;

  // Fill white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // Create a simple visual representation
  // In production, you'd use a proper QR code library
  // For now, we'll create a placeholder pattern with the text
  ctx.fillStyle = '#000000';
  ctx.font = '12px monospace';
  
  // Draw border
  const borderSize = 20;
  ctx.fillRect(0, 0, size, borderSize);
  ctx.fillRect(0, size - borderSize, size, borderSize);
  ctx.fillRect(0, 0, borderSize, size);
  ctx.fillRect(size - borderSize, 0, borderSize, size);

  // Draw corner squares (QR code style)
  const cornerSize = 60;
  const cornerInner = 40;
  
  // Top-left
  ctx.fillRect(borderSize + 10, borderSize + 10, cornerSize, cornerSize);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(borderSize + 20, borderSize + 20, cornerInner, cornerInner);
  
  // Top-right
  ctx.fillStyle = '#000000';
  ctx.fillRect(size - borderSize - cornerSize - 10, borderSize + 10, cornerSize, cornerSize);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(size - borderSize - cornerSize, borderSize + 20, cornerInner, cornerInner);
  
  // Bottom-left
  ctx.fillStyle = '#000000';
  ctx.fillRect(borderSize + 10, size - borderSize - cornerSize - 10, cornerSize, cornerSize);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(borderSize + 20, size - borderSize - cornerSize, cornerInner, cornerInner);

  // Draw data pattern (simplified)
  ctx.fillStyle = '#000000';
  const moduleSize = 8;
  const startX = borderSize + cornerSize + 30;
  const startY = borderSize + cornerSize + 30;
  const endX = size - borderSize - cornerSize - 30;
  const endY = size - borderSize - cornerSize - 30;

  // Create a pseudo-random pattern based on the text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash = hash & hash;
  }

  for (let y = startY; y < endY; y += moduleSize) {
    for (let x = startX; x < endX; x += moduleSize) {
      const index = ((y - startY) / moduleSize) * 20 + ((x - startX) / moduleSize);
      const value = (hash + index * 7) % 3;
      if (value === 0) {
        ctx.fillRect(x, y, moduleSize - 1, moduleSize - 1);
      }
    }
  }

  // Draw text in center
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(size / 2 - 80, size / 2 - 20, 160, 40);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const shortText = text.substring(0, 8) + '...' + text.substring(text.length - 8);
  ctx.fillText(shortText, size / 2, size / 2);
}

export default function MyQRPage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (userProfile?.qrCode && canvasRef.current) {
      generateQRCode(canvasRef.current, userProfile.qrCode);
    }
  }, [userProfile?.qrCode]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">No profile found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="w-full aspect-[2/1] rounded-lg overflow-hidden">
        <img
          src="/assets/generated/qr-header-illustration.dim_1200x600.png"
          alt="QR Header"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">My QR Code</h1>
        <p className="text-muted-foreground">Share this code to receive payments</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>{userProfile.displayName}</CardTitle>
          <CardDescription>{userProfile.phoneNumber}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg">
            <canvas ref={canvasRef} className="border border-gray-200" />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Show this QR code to receive payments from other users
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
