import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import wyw from '@wyw-in-js/vite';

export default defineConfig({
  resolve: {
    alias: {
      // Mirrors the "@/*" path alias declared in tsconfig.json.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    wyw({
      include: ['**/*.{ts,tsx}'],
      sourceMap: false,
      // Tokens are plain var() strings and numbers, safe to evaluate at build time; cva is
      // mocked because its result is never needed to extract CSS.
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
