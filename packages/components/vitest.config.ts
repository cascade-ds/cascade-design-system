import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import wyw from '@wyw-in-js/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    // Resolves the "#/*" paths from tsconfig.json. tsconfig.test.json is used because the
    // main tsconfig excludes test files, and the plugin skips files a project doesn't include.
    tsconfigPaths({ projects: ['./tsconfig.test.json'] }),
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
