export const THEME_PRESET_KEYS = [
  'classico',
  'brisa-fria',
  'terracota-editorial',
  'savia-dourada',
  'neblina-mineral',
] as const;

export type ThemePresetKey = (typeof THEME_PRESET_KEYS)[number];

export const DEFAULT_THEME_PRESET: ThemePresetKey = 'classico';

export const THEME_PRESETS: Array<{
  key: ThemePresetKey;
  label: string;
  description: string;
  mood: string;
  swatches: [string, string, string, string];
}> = [
  {
    key: 'classico',
    label: 'Classico',
    description: 'Base atual quente, editorial e premium.',
    mood: 'Quente',
    swatches: ['#F7F0E6', '#EFE5D3', '#B8845A', '#3A2418'],
  },
  {
    key: 'brisa-fria',
    label: 'Brisa Fria',
    description: 'Paleta fria, leve e sofisticada.',
    mood: 'Frio',
    swatches: ['#F2F5F7', '#E3EBEF', '#7B93A6', '#2D3A44'],
  },
  {
    key: 'terracota-editorial',
    label: 'Terracota Editorial',
    description: 'Mais calor e contraste, sem fugir do tom institucional.',
    mood: 'Quente',
    swatches: ['#FAF1E7', '#EED9C5', '#B46C43', '#44271D'],
  },
  {
    key: 'savia-dourada',
    label: 'Savia Dourada',
    description: 'Verde suave com dourado opaco e base neutra.',
    mood: 'Natural',
    swatches: ['#F4F1E8', '#E5E0D0', '#9AA286', '#354033'],
  },
  {
    key: 'neblina-mineral',
    label: 'Neblina Mineral',
    description: 'Neutro mineral, elegante e um pouco mais urbano.',
    mood: 'Neutro',
    swatches: ['#F4F2EE', '#E4E0D8', '#8B7E74', '#312A28'],
  },
];

export function isThemePresetKey(value: string | undefined | null): value is ThemePresetKey {
  return THEME_PRESET_KEYS.includes((value ?? '') as ThemePresetKey);
}

