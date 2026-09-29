import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Each package with its own vitest.config.ts (environment, plugins) is
    // run as its own project; packages without one aren't included here and
    // fall back to being matched directly by this root config instead.
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
