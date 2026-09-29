import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import wyw from '@wyw-in-js/vite';

export default defineConfig({
  plugins: [
    wyw({
      include: ['**/*.{ts,tsx}'],
      sourceMap: false,
      importOverrides: {
        '@cascade-ds/styles': { unknown: 'allow' },
        '@cascade-ds/styles/motion': { unknown: 'allow' },
        'class-variance-authority': {
          mock: fileURLToPath(new URL('./eval-mocks/class-variance-authority.js', import.meta.url)),
        },
      },
    }),
  ],
  test: {
    environment: 'jsdom',
  },
});
