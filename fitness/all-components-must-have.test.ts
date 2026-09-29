import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

const uiPath = 'packages/components/src';
const storiesPath = 'packages/storybook/stories';
const includedFolders = ['/Atoms', '/Layout', '/Molecules'];

const excluded = ['Box'];
const requiredSuffixes = ['.style.ts', '.test.tsx'];
const storySuffix = '.stories.tsx';

describe('fitness: every component must have style, test and story files', () => {
  it.each(includedFolders)(
    `has ${requiredSuffixes.join(', ')} beside, and ${storiesPath}/<Name>${storySuffix} for, every component folder in %s except ${excluded.join(', ')}`,
    (folder) => {
      const folderPath = path.join(uiPath, folder);
      const componentDirs = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !excluded.includes(entry.name));
      const stories = fs.readdirSync(storiesPath);

      const violations: string[] = [];

      for (const dir of componentDirs) {
        const componentPath = path.join(folderPath, dir.name);
        const files = fs.readdirSync(componentPath);

        for (const suffix of requiredSuffixes) {
          const expectedFile = `${dir.name}${suffix}`;

          if (!files.includes(expectedFile)) {
            violations.push(`${componentPath} is missing ${expectedFile}`);
          }
        }

        const expectedStory = `${dir.name}${storySuffix}`;

        if (!stories.includes(expectedStory)) {
          violations.push(`${componentPath} is missing ${storiesPath}/${expectedStory}`);
        }
      }

      expect(
        violations,
        `Found ${violations.length} violation(s):\n${violations.join('\n')}`,
      ).toHaveLength(0);
    },
  );
});
