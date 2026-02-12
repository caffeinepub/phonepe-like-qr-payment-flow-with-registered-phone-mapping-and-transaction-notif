import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { QrCode, Scan, Receipt, Bell, User } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useProfile';
import ProfileSetupModal from '../components/ProfileSetupModal';
import { useGetUserNotifications } from '../hooks/useNotifications';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: notifications } = useGetUserNotifications();

  const showProfileSetup = !profileLoading && isFetched && userProfile === null;
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const menuItems = [
    {
      title: 'My QR Code',
      description: 'View and share your payment QR code',
      icon: QrCode,
      path: '/my-qr',
      color: 'text-amber-600',
    },
    {
      title: 'Scan & Pay',
      description: 'Scan a QR code to make a payment',
      icon: Scan,
      path: '/scan-pay',
      color: 'text-emerald-600',
    },
    {
      title: 'Transactions',
      description: 'View your payment history',
      icon: Receipt,
      path: '/transactions',
      color: 'text-orange-600',
    },
    {
      title: 'Notifications',
      description: `${unreadCount > 0 ? `${unreadCount} unread` : 'View all alerts'}`,
      icon: Bell,
      path: '/notifications',
      color: 'text-rose-600',
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      title: 'Profile',
      description: 'Manage your account details',
      icon: User,
      path: '/profile',
      color: 'text-indigo-600',
    },
  ];

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} />
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to PayQR</h1>
          <p className="text-muted-foreground">Your secure payment companion</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {menuItems.map((item) => (
            <Card
              key={item.path}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate({ to: item.path })}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="text-sm">{item.description}</CardDescription>
                    </div>
                  </div>
                  {item.badge && (
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-destructive rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
