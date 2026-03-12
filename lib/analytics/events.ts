export const ANALYTICS_EVENT_NAMES = [
  'nav_click',
  'cta_click',
  'whatsapp_click',
  'product_click',
  'lead_submit',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export interface AnalyticsEventPayload {
  name: AnalyticsEventName;
  source: string;
  path?: string;
  productId?: string;
  productSlug?: string;
  productTitle?: string;
  destination?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

export const ANALYTICS_SOURCES = {
  NAVBAR: 'navbar',
  MOBILE_NAV: 'mobile-nav',
  HOME_PRICING: 'home-pricing',
  HOME_SERVICES: 'home-services',
  PRODUCT_DETAIL: 'product-detail',
  PRODUCT_LIST: 'product-list',
  ABOUT_PAGE: 'about-page',
  FLOATING_WHATSAPP: 'floating-whatsapp',
  CONTACT_PAGE: 'contact-page',
  CONTACT_FORM: 'contact-form',
} as const;
