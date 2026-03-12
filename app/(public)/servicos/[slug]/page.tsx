export const revalidate = 300;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailView } from '@/components/features/products/ProductDetailView';
import { StructuredDataScript } from '@/components/seo/StructuredDataScript';
import { getProductDetailPath } from '@/lib/core/product-paths';
import { getWhatsAppConfig } from '@/lib/data/config';
import { getProductBySlug } from '@/lib/data/products';
import { buildProductJsonLd } from '@/lib/seo/schema';

type ServicePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.type !== 'CONSULTORIA') {
    return { title: 'Servico nao encontrado' };
  }

  const canonicalPath = getProductDetailPath(product.type, product.slug);

  return {
    title: `${product.title} | Eliane Marques`,
    description: product.shortDesc,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: product.title,
      description: product.shortDesc,
      url: canonicalPath,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const [product, waConfig] = await Promise.all([getProductBySlug(slug), getWhatsAppConfig()]);

  if (!product || product.type !== 'CONSULTORIA') {
    notFound();
  }

  return (
    <>
      <StructuredDataScript
        data={buildProductJsonLd({
          name: product.title,
          description: product.shortDesc,
          path: getProductDetailPath(product.type, product.slug),
          image: product.coverImage,
          price: product.price,
        })}
      />
      <ProductDetailView product={product} waConfig={waConfig} />
    </>
  );
}
