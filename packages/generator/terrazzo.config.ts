import { defineConfig } from '@terrazzo/cli';
import type { Config, Plugin } from '@terrazzo/parser';
import css from '@terrazzo/plugin-css';
import type { Permutation } from '@terrazzo/plugin-css';
import cssInJs from '@terrazzo/plugin-css-in-js';

// Single source of truth for theme names: both the CSS permutations below and
// the `Theme` union type are derived from this array, plus a `theme-names.js`/
// `.d.ts` pair emitted into @cascade-ds/styles for other packages to consume.
//
// Each theme is emitted twice: once driven by the OS preference on `:root`
// (the default), and once under `[data-theme]` so a ThemeProvider with an
// explicit mode overrides the OS for its subtree.
const permutations = [
  {
    input: { theme: 'light' },
    prepare: (contents) => `:root,\n[data-theme='light'] {\n  ${contents}\n}`,
  },
  {
    input: { theme: 'dark' },
    prepare: (contents) =>
      `@media (prefers-color-scheme: dark) {\n  :root {\n    ${contents}\n  }\n}\n\n[data-theme='dark'] {\n  ${contents}\n}`,
  },
] satisfies Permutation[];

export type Theme = (typeof permutations)[number]['input']['theme'];

const themeNames = permutations.map((permutation) => permutation.input.theme);

const emitThemeNames: Plugin = {
  name: 'emit-theme-names',
  build({ outputFile }) {
    outputFile('theme-names.js', `export const THEMES = ${JSON.stringify(themeNames)};\n`);
    outputFile(
      'theme-names.d.ts',
      `export declare const THEMES: readonly [${themeNames.map((name) => `'${name}'`).join(', ')}];\nexport type Theme = (typeof THEMES)[number];\n`,
    );
  },
};

// JS animation libraries (Motion) can't read `var(--…)`, they need numbers.
// Emits the resolved `semantic.motion.*` tokens as `motion.js`/`.d.ts`:
// durations in seconds (Motion's unit), easings as cubic-bezier arrays.
const MOTION_PREFIX = 'semantic.motion.';

type MotionTree = { [key: string]: MotionTree | number | readonly number[] };

function toMotionValue(value: unknown): number | readonly number[] {
  if (Array.isArray(value)) {
    return value as number[];
  }
  const { value: amount, unit } = value as { value: number; unit: 'ms' | 's' };
  return unit === 'ms' ? amount / 1000 : amount;
}

function toMotionType(tree: MotionTree, indent = '  '): string {
  const lines = Object.entries(tree).map(([key, value]) => {
    const type =
      typeof value === 'number'
        ? 'number'
        : Array.isArray(value)
          ? 'readonly [number, number, number, number]'
          : toMotionType(value as MotionTree, `${indent}  `);
    return `${indent}readonly ${JSON.stringify(key)}: ${type};`;
  });
  return `{\n${lines.join('\n')}\n${indent.slice(2)}}`;
}

const emitMotion: Plugin = {
  name: 'emit-motion',
  build({ tokens, outputFile }) {
    const motion: MotionTree = {};

    for (const [id, token] of Object.entries(tokens)) {
      if (!id.startsWith(MOTION_PREFIX)) {
        continue;
      }
      const path = id.slice(MOTION_PREFIX.length).split('.');
      const leaf = path.pop()!;
      let node = motion;
      for (const key of path) {
        node = (node[key] ??= {}) as MotionTree;
      }
      node[leaf] = toMotionValue(token.$value);
    }

    outputFile('motion.js', `export const motion = ${JSON.stringify(motion, null, 2)};\n`);
    outputFile('motion.d.ts', `export declare const motion: ${toMotionType(motion)};\n`);
  },
};

const customConfig: Config = {
  tokens: ['../tokens/design-system.resolver.json'],
  plugins: [
    css({ permutations }),
    cssInJs({
      filename: 'theme.js',
    }),
    emitThemeNames,
    emitMotion,
  ],
  outDir: '../styles/',
  lint: {
    build: {
      enabled: true,
    },
    rules: {
      'core/valid-color': 'error',
      'core/valid-dimension': 'error',
      'core/valid-font-family': 'error',
      'core/valid-font-weight': 'error',
      'core/valid-duration': 'error',
      'core/valid-cubic-bezier': 'error',
      'core/valid-number': 'error',
      'core/valid-link': 'error',
      'core/valid-boolean': 'error',
      'core/valid-string': 'error',
      'core/valid-stroke-style': 'error',
      'core/valid-border': 'error',
      'core/valid-transition': 'error',
      'core/valid-shadow': 'error',
      'core/valid-gradient': 'error',
      'core/valid-typography': 'error',
      'core/consistent-naming': 'warn',
    },
  },
};

export default defineConfig(customConfig);
