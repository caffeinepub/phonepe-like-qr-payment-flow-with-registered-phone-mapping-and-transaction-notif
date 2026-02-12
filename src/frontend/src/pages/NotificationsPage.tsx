import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, Check } from 'lucide-react';
import { useGetUserNotifications, useMarkNotificationRead } from '../hooks/useNotifications';
import { Badge } from '../components/ui/badge';

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useGetUserNotifications();
  const markAsRead = useMarkNotificationRead();

  const handleMarkAsRead = async (notificationId: bigint) => {
    await markAsRead.mutateAsync(notificationId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your activity</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <img
                src="/assets/generated/empty-state-illustration.dim_900x600.png"
                alt="No notifications"
                className="w-64 h-auto opacity-75"
              />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">No Notifications</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  You're all caught up! Notifications about your transactions and QR scans will appear here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your activity</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id.toString()}
            className={notification.isRead ? 'opacity-60' : 'border-primary/50'}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{notification.message}</p>
                    {!notification.isRead && <Badge variant="default">New</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(Number(notification.timestamp) / 1000000).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={markAsRead.isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
