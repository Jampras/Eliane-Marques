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
    label: 'Ameixa Nobre',
    description: 'Base rosada suave com acentos ameixa para um tom premium e autoral.',
    mood: 'Editorial',
    swatches: ['#F7EFF2', '#E9D9E2', '#8D5C72', '#2F2230'],
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
    label: 'Grafite Dourado',
    description:
      'Neutro refinado com grafite quente e ouro queimado para um visual mais contemporaneo.',
    mood: 'Urbano',
    swatches: ['#F3F1EE', '#E2DDD6', '#96795C', '#262728'],
  },
];

export function isThemePresetKey(value: string | undefined | null): value is ThemePresetKey {
  return THEME_PRESET_KEYS.includes((value ?? '') as ThemePresetKey);
}
