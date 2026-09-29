import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import wyw from '@wyw-in-js/vite';

const currentDir = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@vueless/storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Mirrors the "@/*" path alias declared in packages/components/tsconfig.json
      '@': join(currentDir, '../../components/src'),
    };
    config.plugins ??= [];
    config.plugins.push(
      wyw({
        include: ['**/*.{ts,tsx}'],
        sourceMap: process.env.NODE_ENV !== 'production',
        // Tokens are plain var() strings and numbers, safe to evaluate at build time; cva is
        // mocked because its result is never needed to extract CSS.
        importOverrides: {
          '@cascade-ds/styles': { unknown: 'allow' },
          '@cascade-ds/styles/motion': { unknown: 'allow' },
          'class-variance-authority': {
            mock: join(currentDir, '../../components/eval-mocks/class-variance-authority.js'),
          },
        },
      }),
    );
    return config;
  },
};

export default config;
