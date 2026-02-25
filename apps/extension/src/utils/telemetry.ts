import * as Sentry from "@sentry/react";
import posthog from 'posthog-js';

export const initExtensionTelemetry = () => {
    if (process.env.PLASMO_PUBLIC_SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.PLASMO_PUBLIC_SENTRY_DSN,
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration(),
            ],
            // Performance Monitoring
            tracesSampleRate: 1.0,
            // Session Replay
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
        });
        console.log("[Telemetry] Extension Sentry initialized");
    }

    if (process.env.PLASMO_PUBLIC_POSTHOG_KEY) {
        posthog.init(process.env.PLASMO_PUBLIC_POSTHOG_KEY, {
            api_host: 'https://app.posthog.com',
            autocapture: true,
        });
        console.log("[Telemetry] Extension PostHog initialized");
    }
};
