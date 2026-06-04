/** Privacy-safe analytics — log only in development; plug PostHog later with counsel. */
export function trackEvent(
  event: string,
  properties?: Record<string, string | number | boolean>,
) {
  if (process.env.NODE_ENV === 'development') {
    console.info('[analytics]', event, properties ?? {});
  }
}
