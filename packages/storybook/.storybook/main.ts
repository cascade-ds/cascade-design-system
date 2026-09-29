import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import wyw from '@wyw-in-js/vite';
import remarkGfm from 'remark-gfm';

const currentDir = dirname(fileURLToPath(import.meta.url));

// `@cds/components` and `@cds/styles` are how Storybook imports the design
// system. CDS_SOURCE picks what they resolve to:
//   workspace (default): the source in this repo, so Storybook shows unreleased code.
//   package: the published packages in node_modules, so it shows what shipped.
const source = process.env.CDS_SOURCE ?? 'workspace';
if (source !== 'workspace' && source !== 'package') {
  throw new Error(`CDS_SOURCE must be "workspace" or "package", got "${source}"`);
}
const useWorkspace = source === 'workspace';
const components = join(currentDir, '../../components');
const styles = join(currentDir, '../../styles');

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.tsx'],
  addons: [
    {
      // GitHub-flavored Markdown (tables, strikethrough) in the MDX docs pages.
      name: '@storybook/addon-docs',
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@vueless/storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve ??= {};
    if (useWorkspace) {
      const existing = config.resolve.alias ?? [];
      const current = Array.isArray(existing)
        ? existing
        : Object.entries(existing).map(([find, replacement]) => ({ find, replacement }));
      config.resolve.alias = [
        ...current,
        // Prefixes are matched, so the specific paths come first.
        { find: /^@cds\/components\/styles\.css$/, replacement: join(currentDir, 'empty.css') },
        { find: /^@cds\/components\/motion$/, replacement: join(components, 'src/motion.ts') },
        { find: /^@cds\/components$/, replacement: join(components, 'src/index.ts') },
        { find: /^@cds\/styles(\/.*)?$/, replacement: `${styles}$1` },
      ];
    }
    config.plugins ??= [];
    config.plugins.push(
      wyw({
        include: ['**/*.{ts,tsx}'],
        sourceMap: process.env.NODE_ENV !== 'production',
        // Tokens are plain var() strings and numbers, safe to evaluate at build time; cva is
        // mocked because its result is never needed to extract CSS.
        importOverrides: {
          '@cascade-ds/styles': { unknown: 'allow' },
          '@cascade-ds/styles/motion': { unknown: 'allow' },
          '@cds/styles': { unknown: 'allow' },
          '@cds/styles/motion': { unknown: 'allow' },
          'class-variance-authority': {
            mock: join(components, 'eval-mocks/class-variance-authority.js'),
          },
        },
      }),
    );
    return config;
  },
};

export default config;
