import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
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

Sentry.init({
  dsn: "https://07d2721451db39cab39d7db2b886294d@o4511669773795328.ingest.us.sentry.io/4511669950349312",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  tracesSampleRate: 1.0, 
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0, 
});

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