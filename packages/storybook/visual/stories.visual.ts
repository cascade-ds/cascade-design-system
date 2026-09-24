import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

type IndexEntry = {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
  tags?: string[];
};

// Baselines are rendered in the Playwright Linux image. Run anywhere else,
// font rendering differs and every screenshot would fail.
if (!process.env.CASCADE_VISUAL_DOCKER) {
  throw new Error('Run the visual tests in Docker: `pnpm test:visual` (or `:update`).');
}

// Tests are generated from the built story index, so every new story is
// covered without touching this file. Tag a story `no-visual` to skip it.
const index = JSON.parse(
  readFileSync(new URL('../storybook-static/index.json', import.meta.url), 'utf-8'),
) as { entries: Record<string, IndexEntry> };

const stories = Object.values(index.entries).filter(
  (entry) => entry.type === 'story' && !entry.tags?.includes('no-visual'),
);

// Must match the dark-mode addon's storage key: the preview decorator reads
// it on load to pick the theme.
const DARK_MODE_STORAGE_KEY = 'sb-addon-themes-3';

for (const theme of ['light', 'dark'] as const) {
  test.describe(theme, () => {
    for (const story of stories) {
      test(`${story.title} › ${story.name}`, async ({ page }) => {
        await page.addInitScript(
          ([key, current]) => localStorage.setItem(key, JSON.stringify({ current })),
          [DARK_MODE_STORAGE_KEY, theme] as const,
        );
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
        await page.locator('#storybook-root > *').first().waitFor();
        await page.evaluate(() => document.fonts.ready);

        // `animations: 'disabled'` finishes CSS transitions and freezes
        // infinite loops (Spinner); JS-driven animations (Motion) settle
        // because toHaveScreenshot waits for two identical frames.
        await expect(page).toHaveScreenshot(`${story.id}--${theme}.png`, {
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  });
}
