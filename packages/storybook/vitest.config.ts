import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const configDir = fileURLToPath(new URL('.storybook', import.meta.url));

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      allowExternal: true,
      include: ['**/components/src/**/*.{ts,tsx}'],
      exclude: [
        '**/components/src/**/*.test.{ts,tsx}',
        '**/components/src/**/index.ts',
        '**/components/src/ThemeProvider',
      ],
    },
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['vitest.setup.ts'],
        },
      },
    ],
  },
});
