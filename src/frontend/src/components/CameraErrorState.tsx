import { AlertCircle, Camera, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface CameraError {
  type: 'permission' | 'not-supported' | 'not-found' | 'unknown' | 'timeout';
  message: string;
}

interface CameraErrorStateProps {
  error: CameraError;
  onRetry: () => void;
  isLoading?: boolean;
}

export default function CameraErrorState({ error, onRetry, isLoading }: CameraErrorStateProps) {
  const getErrorContent = () => {
    switch (error.type) {
      case 'permission':
        return {
          icon: <Camera className="h-5 w-5" />,
          title: 'Camera Permission Required',
          description: 'Please allow camera access to scan QR codes. Check your browser settings if needed.',
        };
      case 'not-supported':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          title: 'Camera Not Supported',
          description: 'Your browser or device does not support camera access.',
        };
      case 'not-found':
        return {
          icon: <Camera className="h-5 w-5" />,
          title: 'No Camera Found',
          description: 'No camera device was detected on your device.',
        };
      case 'timeout':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          title: 'Camera Timeout',
          description: 'Camera initialization took too long. Please try again.',
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          title: 'Camera Error',
          description: error.message || 'An unknown error occurred while accessing the camera.',
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <div className="flex items-start gap-3">
          {content.icon}
          <div className="flex-1">
            <AlertTitle>{content.title}</AlertTitle>
            <AlertDescription>{content.description}</AlertDescription>
          </div>
        </div>
      </Alert>
      <Button onClick={onRetry} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Retrying...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </>
        )}
      </Button>
    </div>
  );
}
