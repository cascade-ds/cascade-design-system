// Runs the visual tests inside the Playwright Linux image (see Dockerfile).
// Usage: `node visual/docker.ts [playwright test args…]`, e.g.
// `--update-snapshots`. Run directly with Node's built-in TypeScript support.
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const IMAGE = 'cascade-ds-visual';
const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
const visualDir = fileURLToPath(new URL('./', import.meta.url));

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (spawnSync('docker', ['info'], { stdio: 'ignore' }).status !== 0) {
  console.error('Docker is not running. Start Docker Desktop and try again.');
  process.exit(1);
}

run('docker', [
  'build',
  '--file',
  join(visualDir, 'Dockerfile'),
  '--tag',
  IMAGE,
  repoRoot,
]);

// Screenshots go in, the report and diffs come back out.
const mounts = ['__screenshots__', 'report', 'test-results'].flatMap((folder) => {
  const source = join(visualDir, folder);
  mkdirSync(source, { recursive: true });
  return [
    '--mount',
    `type=bind,source=${source},target=/repo/packages/storybook/visual/${folder}`,
  ];
});

run('docker', ['run', '--rm', '--ipc=host', ...mounts, IMAGE, ...process.argv.slice(2)]);
