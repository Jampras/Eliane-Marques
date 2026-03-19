export const ANALYTICS_EVENT_NAMES = [
  'nav_click',
  'cta_click',
  'whatsapp_click',
  'product_click',
  'lead_submit',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];
export const ANALYTICS_SOURCES = {
  NAVBAR: 'navbar',
  MOBILE_NAV: 'mobile-nav',
  HOME_HERO: 'home-hero',
  HOME_IDENTITY: 'home-identity',
  HOME_METHOD: 'home-method',
  HOME_AUTHORITY: 'home-authority',
  HOME_FAQ: 'home-faq',
  HOME_PROGRESS: 'home-progress',
  HOME_MOBILE_DOCK: 'home-mobile-dock',
  HOME_PRICING: 'home-pricing',
  HOME_SERVICES: 'home-services',
  PRODUCT_DETAIL: 'product-detail',
  PRODUCT_LIST: 'product-list',
  POST_DETAIL: 'post-detail',
  ABOUT_PAGE: 'about-page',
  FLOATING_WHATSAPP: 'floating-whatsapp',
  WHATSAPP_BUTTON: 'whatsapp-button',
  WHATSAPP_LINK: 'whatsapp-link',
  CONTACT_PAGE: 'contact-page',
  CONTACT_FORM: 'contact-form',
} as const;

export const ANALYTICS_SOURCE_NAMES = [
  ANALYTICS_SOURCES.NAVBAR,
  ANALYTICS_SOURCES.MOBILE_NAV,
  ANALYTICS_SOURCES.HOME_HERO,
  ANALYTICS_SOURCES.HOME_IDENTITY,
  ANALYTICS_SOURCES.HOME_METHOD,
  ANALYTICS_SOURCES.HOME_AUTHORITY,
  ANALYTICS_SOURCES.HOME_FAQ,
  ANALYTICS_SOURCES.HOME_PROGRESS,
  ANALYTICS_SOURCES.HOME_MOBILE_DOCK,
  ANALYTICS_SOURCES.HOME_PRICING,
  ANALYTICS_SOURCES.HOME_SERVICES,
  ANALYTICS_SOURCES.PRODUCT_DETAIL,
  ANALYTICS_SOURCES.PRODUCT_LIST,
  ANALYTICS_SOURCES.POST_DETAIL,
  ANALYTICS_SOURCES.ABOUT_PAGE,
  ANALYTICS_SOURCES.FLOATING_WHATSAPP,
  ANALYTICS_SOURCES.WHATSAPP_BUTTON,
  ANALYTICS_SOURCES.WHATSAPP_LINK,
  ANALYTICS_SOURCES.CONTACT_PAGE,
  ANALYTICS_SOURCES.CONTACT_FORM,
] as const;

export type AnalyticsSource = (typeof ANALYTICS_SOURCE_NAMES)[number];

export interface AnalyticsEventPayload {
  name: AnalyticsEventName;
  source: AnalyticsSource;
  path?: string;
  productId?: string;
  productSlug?: string;
  productTitle?: string;
  destination?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}
