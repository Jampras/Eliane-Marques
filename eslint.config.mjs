import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextVitals,
  {
    ignores: ['.agent/**', 'dist/**', 'public/uploads/**'],
  },
  {
    files: [
      'components/features/admin/AdminMobileNav.tsx',
      'components/features/home/HeroSection.tsx',
      'components/providers/AnimationProvider.tsx',
      'lib/hooks/useChecklistProgress.ts',
    ],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['tests/e2e/**/*.ts'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];

export default config;
