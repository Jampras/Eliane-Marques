import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Cormorant_Garamond, Jost, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { BRAND } from '@/lib/core/constants';
import { getSiteIdentity } from '@/lib/data/site';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const DEFAULT_DESCRIPTION =
  'Consultoria de imagem, branding pessoal e etiqueta corporativa para posicionamento de alto valor.';

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  display: 'swap',
  variable: '--font-sans',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-ornament',
});

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteIdentity();
  const brandName = siteName || BRAND.name;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${brandName} | Branding e Etiqueta`,
      template: `%s | ${brandName}`,
    },
    description: DEFAULT_DESCRIPTION,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      title: `${brandName} | Branding e Etiqueta`,
      description: DEFAULT_DESCRIPTION,
      siteName: brandName,
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brandName} | Branding e Etiqueta`,
      description: DEFAULT_DESCRIPTION,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { siteName, instagramUrl } = await getSiteIdentity();
  const nonce = (await headers()).get('x-nonce') || undefined;
  const brandName = siteName || BRAND.name;
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brandName,
    url: SITE_URL,
    sameAs: [instagramUrl],
  };

  return (
    <html lang="pt-BR">
      <head>
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${playfairDisplay.variable} ${jost.variable} ${cormorantGaramond.variable} bg-bg text-text-primary selection:bg-primary font-sans antialiased selection:text-white`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
