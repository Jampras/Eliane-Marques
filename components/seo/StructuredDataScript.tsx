import { headers } from 'next/headers';
import { serializeJsonLd } from '@/lib/seo/schema';

export async function StructuredDataScript({ data }: { data: unknown }) {
  const nonce = (await headers()).get('x-nonce') || undefined;

  return (
    <script
      nonce={nonce}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
