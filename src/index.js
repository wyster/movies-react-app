import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
import './bootstrap.scss';
import * as Sentry from "@sentry/react";

if (window.SENTRY_DSN) {
  Sentry.init({
    dsn: window.SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost"],
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });

  Sentry.captureMessage('test');
}

if (!window.REACT_APP_API_URL) {
  throw new Error('window.REACT_APP_API_URL not defined!');
}

const container =  document.getElementById('root');
if (!container) {
  throw new Error('container not found');
}
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
