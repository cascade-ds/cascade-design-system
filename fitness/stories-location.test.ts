import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

const uiPath = 'packages/components/src';
const storiesPath = 'packages/storybook/stories';
const componentFolders = ['Atoms', 'Layout', 'Molecules'];
const storySuffix = '.stories.tsx';

const storyLike = /[._-]stor(y|ies)\b/i;

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function componentNames(): Set<string> {
  return new Set(
    componentFolders.flatMap((folder) =>
      fs
        .readdirSync(path.join(uiPath, folder), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name),
    ),
  );
}

function report(violations: string[]) {
  expect(
    violations,
    `Found ${violations.length} violation(s):\n${violations.join('\n')}`,
  ).toHaveLength(0);
}

describe(`fitness: component stories live in ${storiesPath} as <ComponentName>${storySuffix}`, () => {
  it(`has no story files inside ${uiPath}`, () => {
    const violations = walk(uiPath)
      .filter((file) => storyLike.test(path.basename(file)))
      .map((file) => `${file} is a story inside the component package; move it to ${storiesPath}/`);

    report(violations);
  });

  it(`names every story file <Name>${storySuffix}`, () => {
    const violations = walk(storiesPath)
      .filter((file) => storyLike.test(path.basename(file)) && !file.endsWith(storySuffix))
      .map((file) => `${file} should be named <Name>${storySuffix}`);

    report(violations);
  });

  it(`matches every story at the top of ${storiesPath} to a component folder`, () => {
    const components = componentNames();
    const violations = fs
      .readdirSync(storiesPath, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .flatMap((entry) => {
        const name = entry.name.endsWith(storySuffix)
          ? entry.name.slice(0, -storySuffix.length)
          : undefined;
        if (!name) {
          return [
            `${storiesPath}/${entry.name} isn't a component story; only <ComponentName>${storySuffix} files belong here (docs go in a subfolder, e.g. foundations/)`,
          ];
        }
        return components.has(name)
          ? []
          : [
              `${storiesPath}/${entry.name} has no component folder named ${name} in ${componentFolders.map((f) => `${uiPath}/${f}`).join(', ')}`,
            ];
      });

    report(violations);
  });
});
