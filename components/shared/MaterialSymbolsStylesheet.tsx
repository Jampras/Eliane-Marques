'use client';

import { useEffect } from 'react';

const MATERIAL_SYMBOLS_HREF =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';

export function MaterialSymbolsStylesheet() {
  useEffect(() => {
    if (document.querySelector('link[data-material-symbols="true"]')) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = MATERIAL_SYMBOLS_HREF;
    link.dataset.materialSymbols = 'true';
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, []);

  return null;
}
