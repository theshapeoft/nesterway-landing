/**
 * Analytics Events Integration
 *
 * Centralized event tracking utility for Travelama.
 * Currently logs to console in development and is ready for
 * analytics provider integration (Posthog, Mixpanel, etc.)
 */

// Event type definitions for type safety
export type AnalyticsEvent =
  // Dashboard events
  | { name: "dashboard_viewed"; data: { property_count: number } }
  // Property events
  | { name: "property_created"; data: { property_id: string; template_id?: string } }
  | { name: "property_edited"; data: { property_id: string; section: string } }
  | { name: "property_published"; data: { property_id: string } }
  | { name: "property_unpublished"; data: { property_id: string } }
  | { name: "property_deleted"; data: { property_id: string } }
  | { name: "property_duplicated"; data: { property_id: string; source_property_id: string } }
  // QR Code events
  | { name: "qr_downloaded"; data: { property_id: string; format: "png" | "svg" | "pdf"; size: "small" | "medium" | "large" } }
  | { name: "qr_template_downloaded"; data: { property_id: string; template: "tent-card" | "wall-sign" } }
  | { name: "qr_link_copied"; data: { property_id: string } }
  // Preview events
  | { name: "preview_opened"; data: { property_id: string } }
  | { name: "preview_toggled"; data: { property_id: string; visible: boolean } }
  // Guest page events
  | { name: "qr_scan"; data: { property_id: string; slug: string } }
  | { name: "property_viewed"; data: { property_id: string; slug: string } }
  | { name: "wifi_copied"; data: { property_id: string } }
  // Auth events
  | { name: "signup_started"; data: { method: "email" | "google" } }
  | { name: "signup_completed"; data: { method: "email" | "google"; user_id?: string } }
  | { name: "signup_failed"; data: { method: "email" | "google"; error: string } }
  | { name: "login_started"; data: { method: "email" | "google" } }
  | { name: "login_completed"; data: { method: "email" | "google"; user_id?: string } }
  | { name: "login_failed"; data: { method: "email" | "google"; error: string } }
  | { name: "logout"; data: Record<string, never> }
  | { name: "password_reset_requested"; data: { email: string } }
  | { name: "password_reset_completed"; data: Record<string, never> };

// Extract event names for convenience
export type AnalyticsEventName = AnalyticsEvent["name"];

// Environment check
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Track an analytics event
 *
 * In development: logs to console
 * In production: ready for analytics provider integration
 *
 * @example
 * trackEvent({ name: "property_created", data: { property_id: "123" } })
 * // or with the convenience function:
 * track("property_created", { property_id: "123" })
 */
export function trackEvent(event: AnalyticsEvent): void {
  const timestamp = new Date().toISOString();

  if (isDevelopment) {
    // Console logging in development
    console.log(
      `%c[Analytics] ${event.name}`,
      "color: #6366f1; font-weight: bold;",
      {
        ...event.data,
        timestamp,
      }
    );
  }

  // Production analytics provider integration point
  // Uncomment and configure when ready to integrate:

  // PostHog example:
  // if (typeof window !== "undefined" && window.posthog) {
  //   window.posthog.capture(event.name, event.data);
  // }

  // Mixpanel example:
  // if (typeof window !== "undefined" && window.mixpanel) {
  //   window.mixpanel.track(event.name, event.data);
  // }

  // Amplitude example:
  // if (typeof window !== "undefined" && window.amplitude) {
  //   window.amplitude.track(event.name, event.data);
  // }

  // Custom backend logging example:
  // fetch("/api/analytics", {
  //   method: "POST",
  //   body: JSON.stringify({ event: event.name, data: event.data, timestamp }),
  // }).catch(() => {}); // Fire and forget
}

/**
 * Convenience function for tracking events with separate name and data args
 *
 * @example
 * track("dashboard_viewed", { property_count: 5 })
 */
export function track<T extends AnalyticsEvent>(
  name: T["name"],
  data: Extract<AnalyticsEvent, { name: T["name"] }>["data"]
): void {
  trackEvent({ name, data } as AnalyticsEvent);
}

/**
 * Identify a user for analytics
 * Call this after successful login/signup
 */
export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (isDevelopment) {
    console.log(
      "%c[Analytics] Identify user",
      "color: #6366f1; font-weight: bold;",
      { userId, traits }
    );
  }

  // Production analytics provider integration point:
  // PostHog: window.posthog?.identify(userId, traits);
  // Mixpanel: window.mixpanel?.identify(userId); window.mixpanel?.people.set(traits);
  // Amplitude: window.amplitude?.setUserId(userId); window.amplitude?.identify(traits);
}

/**
 * Reset user identity (call on logout)
 */
export function resetUser(): void {
  if (isDevelopment) {
    console.log(
      "%c[Analytics] Reset user",
      "color: #6366f1; font-weight: bold;"
    );
  }

  // Production analytics provider integration point:
  // PostHog: window.posthog?.reset();
  // Mixpanel: window.mixpanel?.reset();
  // Amplitude: window.amplitude?.reset();
}
