export function openWhatsAppUrl(url: string): 'popup' | 'redirect' {
  const popup = window.open(url, '_blank', 'noopener,noreferrer');

  if (popup) {
    return 'popup';
  }

  window.setTimeout(() => {
    window.location.href = url;
  }, 800);

  return 'redirect';
}
