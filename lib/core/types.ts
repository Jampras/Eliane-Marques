export const PRODUCT_TYPES = ['CONSULTORIA', 'CURSO', 'EBOOK', 'CHECKLIST'] as const;
export const AUDIENCES = ['PESSOAS', 'EMPRESAS', 'AMBOS'] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];
export type Audience = (typeof AUDIENCES)[number];

export interface Service {
  title: string;
  desc: string;
  price: string;
  slug?: string;
  featured?: boolean;
  bestSeller?: boolean;
  type?: ProductType;
}
