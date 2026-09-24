import { defineConfig, devices } from '@playwright/test';

const PORT = 6007;

// Visual regression over the built Storybook: every story, light and dark.
// Runs inside Docker via `pnpm test:visual`; the image builds Storybook first,
// since the suite reads the built story index to create its tests.
export default defineConfig({
  testDir: './visual',
  testMatch: '**/*.visual.ts',
  // One set of baselines: tests only run in the Playwright Linux image
  // (visual/Dockerfile), so every machine renders identical pixels.
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  outputDir: './visual/test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI
    ? 'github'
    : [['list'], ['html', { open: 'never', outputFolder: './visual/report' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  expect: {
    toHaveScreenshot: {
      // Per-pixel color tolerance (0–1). The default 0.2 lets subtle token
      // changes through (a light-gray border vs. white, two dark grays);
      // rendering is deterministic on one platform, so keep it strict.
      threshold: 0.01,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 800, height: 600 },
        deviceScaleFactor: 1,
      },
    },
  ],
  webServer: {
    // The flag is a no-op on Node versions that strip types by default.
    command: `node --experimental-strip-types visual/serve.ts ${PORT}`,
    url: `http://localhost:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
  },
});
