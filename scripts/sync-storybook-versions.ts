import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), 'utf8');
const write = (path: string, content: string) => writeFileSync(new URL(path, root), content);

const packages = [
  { name: '@cascade-ds/components', alias: '@cds/components', dir: 'packages/components' },
  { name: '@cascade-ds/styles', alias: '@cds/styles', dir: 'packages/styles' },
];

const storybookPath = 'packages/storybook/package.json';
const workspacePath = 'pnpm-workspace.yaml';

let storybook = read(storybookPath);
let workspace = read(workspacePath);

for (const { name, alias, dir } of packages) {
  const { version } = JSON.parse(read(`${dir}/package.json`)) as { version: string };

  const dependency = new RegExp(`("${alias}": "npm:${name}@)[^"]+(")`);
  if (!dependency.test(storybook)) throw new Error(`${alias} not found in ${storybookPath}`);
  storybook = storybook.replace(dependency, `$1${version}$2`);

  // pnpm's minimumReleaseAge blocks a just-published version unless it is listed here
  const exclusion = new RegExp(`^(\\s*- '${name}@)([^']+)(')$`, 'm');
  const listed = workspace.match(exclusion)?.[2];
  if (listed === undefined) {
    throw new Error(`${name} not found in ${workspacePath} minimumReleaseAgeExclude`);
  }
  const versions = listed.split(' || ');
  if (!versions.includes(version)) {
    workspace = workspace.replace(exclusion, `$1${[...versions, version].join(' || ')}$3`);
  }

  console.log(`${alias} -> ${version}`);
}

write(storybookPath, storybook);
write(workspacePath, workspace);
