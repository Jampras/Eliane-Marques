type HighlightCandidate = {
  featured?: boolean | null;
  bestSeller?: boolean | null;
};

export const EDITORIAL_POLICY = {
  featured:
    'Use featured para prioridade editorial em home, listagens e vitrines onde a marca quer dar mais foco visual.',
  bestSeller:
    'Use bestSeller para prova comercial. Esse selo deve sinalizar oferta com maior tracao ou prioridade de venda.',
} as const;

function findFirstIndex(
  items: HighlightCandidate[],
  predicate: (item: HighlightCandidate) => boolean
) {
  const index = items.findIndex(predicate);
  return index >= 0 ? index : -1;
}

function getMiddleFallbackIndex(items: HighlightCandidate[]) {
  if (items.length === 0) {
    return -1;
  }

  return Math.min(1, items.length - 1);
}

export function getServicesFeaturedIndex(items: HighlightCandidate[]) {
  const featuredIndex = findFirstIndex(items, (item) => Boolean(item.featured));
  if (featuredIndex >= 0) {
    return featuredIndex;
  }

  const bestSellerIndex = findFirstIndex(items, (item) => Boolean(item.bestSeller));
  if (bestSellerIndex >= 0) {
    return bestSellerIndex;
  }

  return getMiddleFallbackIndex(items);
}

export function getPricingFeaturedIndex(items: HighlightCandidate[]) {
  const bestSellerIndex = findFirstIndex(items, (item) => Boolean(item.bestSeller));
  if (bestSellerIndex >= 0) {
    return bestSellerIndex;
  }

  const featuredIndex = findFirstIndex(items, (item) => Boolean(item.featured));
  if (featuredIndex >= 0) {
    return featuredIndex;
  }

  return getMiddleFallbackIndex(items);
}

export function isServicesFeatured(items: HighlightCandidate[], index: number) {
  return index === getServicesFeaturedIndex(items);
}

export function isPricingFeatured(items: HighlightCandidate[], index: number) {
  return index === getPricingFeaturedIndex(items);
}
