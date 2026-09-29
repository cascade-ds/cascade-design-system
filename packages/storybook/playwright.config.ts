import { defineConfig, devices } from '@playwright/test';

const PORT = 6007;

export default defineConfig({
  testDir: './visual',
  testMatch: '**/*.visual.ts',
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
      // Per-pixel color tolerance (0–1). The default 0.2 lets subtle token changes through; rendering is deterministic on one platform, so keep it strict.
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
    command: `node --experimental-strip-types visual/serve.ts ${PORT}`,
    url: `http://localhost:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
  },
});
