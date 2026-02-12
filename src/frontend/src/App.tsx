import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MyQRPage from './pages/MyQRPage';
import ScanPayPage from './pages/ScanPayPage';
import TransactionsPage from './pages/TransactionsPage';
import NotificationsPage from './pages/NotificationsPage';
import ReceiptPage from './pages/ReceiptPage';
import AuthGate from './components/AuthGate';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <AuthGate>
      <HomePage />
    </AuthGate>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <AuthGate>
      <ProfilePage />
    </AuthGate>
  ),
});

const myQRRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-qr',
  component: () => (
    <AuthGate>
      <MyQRPage />
    </AuthGate>
  ),
});

const scanPayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scan-pay',
  component: () => (
    <AuthGate>
      <ScanPayPage />
    </AuthGate>
  ),
});

const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions',
  component: () => (
    <AuthGate>
      <TransactionsPage />
    </AuthGate>
  ),
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: () => (
    <AuthGate>
      <NotificationsPage />
    </AuthGate>
  ),
});

const receiptRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/receipt/$transactionId',
  component: ReceiptPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileRoute,
  myQRRoute,
  scanPayRoute,
  transactionsRoute,
  notificationsRoute,
  receiptRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
