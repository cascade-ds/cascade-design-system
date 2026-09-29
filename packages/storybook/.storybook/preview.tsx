import { useEffect, type ComponentProps, type ReactNode } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/react-vite';
import { themes } from 'storybook/theming';
import { useDarkMode } from '@vueless/storybook-dark-mode';
import { MotionGlobalConfig } from 'motion/react';
import type { Theme } from '@cds/styles/theme-names';
import { MotionProvider } from '@cds/components/motion';
import { ThemeProvider, useTheme } from '@cds/components';
import '@cds/styles/index.css';
import '@cds/components/styles.css';
// Inter, in the weights `semantic.font.weight.*` uses (regular, medium,
// semibold, bold). The design system doesn't bundle fonts; apps load them.
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
// JetBrains Mono for `semantic.typography.code`, which is regular weight only.
import '@fontsource/jetbrains-mono/400.css';

// Automated browsers (the Playwright visual and a11y tests) set
// `navigator.webdriver`. Jump Motion animations straight to their end state
// there, so screenshots never catch a frame mid-animation. People browsing
// Storybook still see the animations.
if (navigator.webdriver) {
  MotionGlobalConfig.skipAnimations = true;
}

function ThemeSync({ theme, children }: { theme: Theme; children: ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme, setTheme]);

  return children;
}

function DarkModeThemeProvider({ children }: { children: ReactNode }) {
  const theme: Theme = useDarkMode() ? 'dark' : 'light';

  return (
    <ThemeProvider initialMode={theme}>
      <MotionProvider>
        <ThemeSync theme={theme}>{children}</ThemeSync>
      </MotionProvider>
    </ThemeProvider>
  );
}

function ThemedDocsContainer(props: ComponentProps<typeof DocsContainer>) {
  return <DocsContainer {...props} theme={useDarkMode() ? themes.dark : themes.light} />;
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <DarkModeThemeProvider>
        <Story />
      </DarkModeThemeProvider>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          'Foundations',
          [
            'Colors',
            ['Overview', 'Semantic', 'Component', 'Primitives', 'Contrast'],
            'Typography',
            ['Overview', 'Styles', 'Scale'],
          ],
          'CascadeDS',
          '*',
        ],
      },
    },
    darkMode: {
      dark: themes.dark,
      light: themes.light,
    },
    docs: {
      container: ThemedDocsContainer,
    },
    a11y: {
      test: 'error',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
