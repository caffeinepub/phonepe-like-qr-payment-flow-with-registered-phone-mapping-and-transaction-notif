import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQRScanner } from '../qr-code/useQRScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Loader2, Camera, X } from 'lucide-react';
import CameraErrorState from '../components/CameraErrorState';
import { useGetUserProfile, useGetCallerUserProfile } from '../hooks/useProfile';
import { useCreateTransaction } from '../hooks/useTransactions';
import { useSendQRScanNotification } from '../hooks/useNotifications';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function ScanPayPage() {
  const navigate = useNavigate();
  const {
    qrResults,
    isScanning,
    isActive,
    error,
    isLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    clearResults,
    videoRef,
    canvasRef,
    retry,
  } = useQRScanner({
    facingMode: 'environment',
    scanInterval: 100,
    maxResults: 1,
  });

  const [scannedPrincipal, setScannedPrincipal] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: recipientProfile, isLoading: recipientLoading } = useGetUserProfile(scannedPrincipal || '');
  const { data: currentUserProfile } = useGetCallerUserProfile();
  const createTransaction = useCreateTransaction();
  const sendQRScanNotification = useSendQRScanNotification();

  useEffect(() => {
    if (qrResults.length > 0 && !scannedPrincipal) {
      const qrData = qrResults[0].data;
      setScannedPrincipal(qrData);
      stopScanning();

      if (currentUserProfile) {
        sendQRScanNotification.mutate({
          owner: qrData,
          scannerDisplayName: currentUserProfile.displayName,
        });
      }
    }
  }, [qrResults, scannedPrincipal, currentUserProfile]);

  const handleReset = () => {
    setScannedPrincipal(null);
    setAmount('');
    setNote('');
    setErrorMessage(null);
    clearResults();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!scannedPrincipal || !amount || !recipientProfile) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0');
      return;
    }

    try {
      const transaction = await createTransaction.mutateAsync({
        recipient: scannedPrincipal,
        amount: BigInt(Math.floor(amountNum * 100)),
        note: note.trim() || 'Payment',
      });

      navigate({
        to: '/receipt/$transactionId',
        params: { transactionId: transaction.id.toString() },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create transaction');
    }
  };

  if (scannedPrincipal && recipientProfile) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Payment Details</h1>
          <p className="text-muted-foreground">Enter payment amount</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recipient</CardTitle>
            <CardDescription>Sending payment to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-semibold text-lg">{recipientProfile.displayName}</p>
              <p className="text-sm text-muted-foreground">{recipientProfile.phoneNumber}</p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={createTransaction.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={createTransaction.isPending}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createTransaction.isPending} className="flex-1">
              {createTransaction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  if (scannedPrincipal && recipientLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (scannedPrincipal && !recipientProfile) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Invalid QR Code</h1>
          <p className="text-muted-foreground">This QR code is not registered</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                The scanned QR code does not belong to a registered user. Please try scanning a different code.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Button onClick={handleReset} className="w-full">
          Scan Another Code
        </Button>
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
        <h1 className="text-3xl font-bold">Scan & Pay</h1>
        <p className="text-muted-foreground">Scan a QR code to make a payment</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {!isActive && !error && (
            <div className="text-center space-y-4">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Camera is ready to scan</p>
            </div>
          )}

          {error && <CameraErrorState error={error} onRetry={retry} isLoading={isLoading} />}

          {isActive && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  autoPlay
                />
                <div className="absolute inset-0 border-4 border-primary/50 rounded-lg pointer-events-none" />
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <p className="text-center text-sm text-muted-foreground">
                {isScanning ? 'Scanning for QR codes...' : 'Camera active'}
              </p>
            </div>
          )}

          {!isActive && !error && (
            <Button onClick={startScanning} disabled={!canStartScanning || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Camera...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Scanning
                </>
              )}
            </Button>
          )}

          {isActive && (
            <Button onClick={stopScanning} variant="outline" className="w-full">
              <X className="mr-2 h-4 w-4" />
              Stop Camera
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
