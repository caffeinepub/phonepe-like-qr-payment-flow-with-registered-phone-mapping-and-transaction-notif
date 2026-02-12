import { Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Home, QrCode, Scan, Receipt, Bell, User, LogOut } from 'lucide-react';

export default function AppLayout() {
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/app-logo.dim_512x512.png"
              alt="App Logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-xl font-bold text-foreground">PayQR</h1>
          </div>
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loginStatus === 'logging-in'}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 max-w-4xl mx-auto">
        <Outlet />
      </main>

      {isAuthenticated && (
        <nav className="sticky bottom-0 z-50 w-full border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="container flex items-center justify-around px-4 py-3 max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate({ to: '/' })}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate({ to: '/my-qr' })}
            >
              <QrCode className="h-5 w-5" />
              <span className="text-xs">My QR</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate({ to: '/scan-pay' })}
            >
              <Scan className="h-5 w-5" />
              <span className="text-xs">Scan</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate({ to: '/transactions' })}
            >
              <Receipt className="h-5 w-5" />
              <span className="text-xs">History</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate({ to: '/notifications' })}
            >
              <Bell className="h-5 w-5" />
              <span className="text-xs">Alerts</span>
            </Button>
          </div>
        </nav>
      )}

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
