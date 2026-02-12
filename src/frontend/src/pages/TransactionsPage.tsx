import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Badge } from '../components/ui/badge';

export default function TransactionsPage() {
  const { identity } = useInternetIdentity();

  // Note: Backend doesn't have getUserTransactions method yet
  const transactions: any[] = [];
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Your payment history</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <img
                src="/assets/generated/empty-state-illustration.dim_900x600.png"
                alt="No transactions"
                className="w-64 h-auto opacity-75"
              />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">No Transactions Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Your payment history will appear here once you start making or receiving payments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPrincipal = identity?.getPrincipal().toString();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Your payment history</p>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => {
          const isDebit = transaction.payer.toString() === currentPrincipal;
          const amount = Number(transaction.amount) / 100;

          return (
            <Card key={transaction.id.toString()}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        isDebit ? 'bg-destructive/10 text-destructive' : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {isDebit ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold">{isDebit ? 'Payment Sent' : 'Payment Received'}</p>
                      <p className="text-sm text-muted-foreground">{transaction.note}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(Number(transaction.timestamp) / 1000000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isDebit ? 'text-destructive' : 'text-emerald-600'}`}>
                      {isDebit ? '-' : '+'}${amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
