import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Packages with their own vitest.config.ts run as separate projects; the rest are matched by this root config.
    projects: [
      'packages/*/vitest.config.ts',
      {
        extends: true,
        test: {
          name: 'fitness',
          include: ['fitness/**/*.{test,spec}.{ts,tsx}'],
        },
      },
    ],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['packages/components/src/**/*.{ts,tsx}'],
      exclude: [
        'packages/components/src/**/*.test.{ts,tsx}',
        'packages/components/src/**/index.ts',
        'packages/components/src/ThemeProvider',
      ],
      reportsDirectory: './coverage/',
    },
  },
});
