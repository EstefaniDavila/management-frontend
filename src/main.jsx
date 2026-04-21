import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import Routes from './routes/routes';
import { ThemeProvider } from './components/theme-provider.jsx';
import { AlertDialogProvider } from './components/custom/alert.jsx';
import { ToastProvider } from './components/ui/toast.jsx';
import { UserProvider } from './providers/UserContext.jsx';
import { TanstackProvider } from './providers/TanstackProvider.jsx';
import { SalesProvider } from './providers/SalesContext.jsx';
import { LeadsProvider } from './providers/advisor/LeadsContext';
import { AdvisorQuotationsProvider } from './providers/advisor/AdvisorQuotationsContext';
import './index.css';
import { Toaster } from './components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToastProvider swipeDirection="top">
        <AlertDialogProvider>
          <UserProvider>
            <TanstackProvider>
              <AdvisorQuotationsProvider>
                <SalesProvider>
                  <LeadsProvider>
                    <Routes />
                  </LeadsProvider>
                </SalesProvider>
              </AdvisorQuotationsProvider>
            </TanstackProvider>
          </UserProvider>
          <Toaster />
        </AlertDialogProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);