import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { PostHog } from 'posthog-node';

export const initTelemetry = () => {
    if (process.env.SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            integrations: [
                nodeProfilingIntegration(),
            ],
            // Performance Monitoring
            tracesSampleRate: 1.0, //  Capture 100% of the transactions
            // Set sampling rate for profiling - this is relative to tracesSampleRate
            profilesSampleRate: 1.0,
        });
        console.log("[Telemetry] Sentry initialized");
    }

    if (process.env.POSTHOG_API_KEY) {
        const posthog = new PostHog(
            process.env.POSTHOG_API_KEY,
            { host: 'https://app.posthog.com' }
        );
        console.log("[Telemetry] PostHog initialized");
        return posthog;
    }
    return null;
};

export const captureException = (error: any) => {
    Sentry.captureException(error);
};
