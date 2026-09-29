import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import wyw from '@wyw-in-js/rollup';
import css from 'rollup-plugin-css-only';
import type { InputPluginOption, Plugin, RollupOptions } from 'rollup';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

const externalPackages = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  'react/jsx-runtime',
];
const isExternal = (id: string) =>
  externalPackages.some((dep) => id === dep || id.startsWith(`${dep}/`));

const cssFileName = 'styles.css';
const tokensCssPath = createRequire(import.meta.url).resolve('@cascade-ds/styles/index.css');

// Prepends the design-token custom properties to the component stylesheet so
// consumers import a single file, with tokens guaranteed to load first. The
// tokens CSS already declares the layer order and sits in `cascade.tokens`;
// component styles go in `cascade.components`, so a consumer's unlayered
// `className` always overrides them, whatever order the bundler loads CSS in.
const prependTokensCss = (): Plugin => ({
  name: 'prepend-tokens-css',
  buildStart() {
    this.addWatchFile(tokensCssPath);
  },
  generateBundle(_options, bundle) {
    const stylesheet = bundle[cssFileName];

    if (stylesheet?.type !== 'asset') {
      this.error(`${cssFileName} was not emitted; cannot prepend design tokens.`);
    }

    const tokensCss = readFileSync(tokensCssPath, 'utf-8');
    stylesheet.source = `${tokensCss}\n@layer cascade.components {\n${String(stylesheet.source)}\n}\n`;
  },
});

const config: RollupOptions = {
  // `motion` is a separate entry so the main one never imports the optional
  // `motion` peer.
  input: {
    index: 'src/index.ts',
    motion: 'src/motion.ts',
  },
  external: isExternal,
  // ESM only, like @cascade-ds/styles, whose entries it imports at runtime.
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
    chunkFileNames: 'chunks/[name]-[hash].js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    commonjs(),
    wyw({
      include: ['**/*.{ts,tsx}'],
      // Inline CSS source maps only while watching (`pnpm dev`); the published
      // styles.css ships without them.
      sourceMap: process.env.ROLLUP_WATCH === 'true',
      // Tokens are plain var() strings and numbers, safe to evaluate at build time; cva is
      // mocked because its result is never needed to extract CSS.
      importOverrides: {
        '@cascade-ds/styles': { unknown: 'allow' },
        '@cascade-ds/styles/motion': { unknown: 'allow' },
        'class-variance-authority': {
          mock: path.resolve(__dirname, 'eval-mocks/class-variance-authority.js'),
        },
      },
    }),
    css({ output: cssFileName }) as InputPluginOption,
    prependTokensCss(),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['**/*.test.tsx', 'node_modules/**'],
      compilerOptions: {
        composite: false,
        incremental: false,
        declaration: true,
        declarationDir: 'dist',
        outDir: 'dist',
      },
    }),
  ],
};

export default config;
