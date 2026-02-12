import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle2, Home, Receipt } from 'lucide-react';
import { Separator } from '../components/ui/separator';

export default function ReceiptPage() {
  const { transactionId } = useParams({ from: '/receipt/$transactionId' });
  const navigate = useNavigate();

  // In a real implementation, we would fetch the transaction details
  // For now, we'll show a success message
  const mockTransaction = {
    id: transactionId,
    amount: '50.00',
    recipient: 'John Doe',
    timestamp: new Date().toLocaleString(),
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-emerald-100">
            <CheckCircle2 className="h-16 w-16 text-emerald-600" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-emerald-600">Payment Successful!</h1>
          <p className="text-muted-foreground">Your payment has been processed</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Receipt</CardTitle>
          <CardDescription>Payment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-sm">{mockTransaction.id}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient</span>
              <span className="font-semibold">{mockTransaction.recipient}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-lg">${mockTransaction.amount}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="text-sm">{mockTransaction.timestamp}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate({ to: '/transactions' })} className="flex-1">
          <Receipt className="mr-2 h-4 w-4" />
          View History
        </Button>
        <Button onClick={() => navigate({ to: '/' })} className="flex-1">
          <Home className="mr-2 h-4 w-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
}
