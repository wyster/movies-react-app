import 'whatwg-fetch'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import './bootstrap.scss'
import * as Sentry from '@sentry/react'

if (window.SENTRY_DSN) {
  Sentry.init({
    dsn: window.SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration({
        tracePropagationTargets: ['localhost'],
      } as Parameters<typeof Sentry.browserTracingIntegration>[0]),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })

  Sentry.captureMessage('test')
}

if (!window.REACT_APP_API_URL) {
  throw new Error('window.REACT_APP_API_URL not defined!')
}

const container = document.getElementById('root')
if (!container) {
  throw new Error('container not found')
}

const root = createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
