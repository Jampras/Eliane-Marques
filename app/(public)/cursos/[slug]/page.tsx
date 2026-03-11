export const revalidate = 300;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailView } from '@/components/features/products/ProductDetailView';
import { getProductDetailPath } from '@/lib/core/product-paths';
import { getWhatsAppConfig } from '@/lib/data/config';
import { getProductBySlug } from '@/lib/data/products';

type CoursePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.type !== 'CURSO') {
    return { title: 'Curso nao encontrado' };
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

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const [product, waConfig] = await Promise.all([getProductBySlug(slug), getWhatsAppConfig()]);

  if (!product || product.type !== 'CURSO') {
    notFound();
  }

  return <ProductDetailView product={product} waConfig={waConfig} />;
}
