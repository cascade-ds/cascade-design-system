/**
 * Shared chrome for the Foundations docs pages (colors, typography): a themed
 * card that follows the Storybook toolbar, and the text styles used inside it.
 * Everything reads semantic tokens, so the docs work in light and dark.
 */
import type { ReactNode } from 'react';
import { css, cx } from '@linaria/core';
import { semantic } from '@cds/styles';
import { useDarkMode } from '@vueless/storybook-dark-mode';

type ThemeName = 'light' | 'dark';

const c = semantic.color;

const scopeCss = css`
  background-color: ${c.background.default};
  color: ${c.text.primary};
  font-family: ${semantic.font.family.body};
  font-size: ${semantic.typography.bodyMd.fontSize};
  line-height: ${semantic.typography.bodyMd.lineHeight};
  border: ${semantic.border.width.default} solid ${c.border.default};
  border-radius: ${semantic.round.lg};
  padding: ${semantic.padding.lg};
  margin-block: ${semantic.stack.md};
  box-sizing: border-box;

  & *,
  & *::before,
  & *::after {
    box-sizing: inherit;
  }
`;

/**
 * Themes a docs block to match the Storybook toolbar. MDX pages render outside
 * the story decorators, so each block sets `data-theme` itself.
 */
export function DocsScope({ children }: { children: ReactNode }) {
  const theme: ThemeName = useDarkMode() ? 'dark' : 'light';
  return (
    <div data-theme={theme} className={cx('sb-unstyled', scopeCss)}>
      {children}
    </div>
  );
}

export const codeCss = css`
  font-family: ${semantic.font.family.code};
  font-size: ${semantic.typography.code.fontSize};
  overflow-wrap: anywhere;
`;

export const mutedCss = css`
  color: ${c.text.secondary};
  font-size: ${semantic.typography.bodySm.fontSize};
  line-height: ${semantic.typography.bodySm.lineHeight};
`;

export const groupHeadingCss = css`
  font-family: ${semantic.font.family.heading};
  font-size: ${semantic.typography.h4.fontSize};
  font-weight: ${semantic.typography.h4.fontWeight};
  line-height: ${semantic.typography.h4.lineHeight};
  margin: 0;
`;

export const subgroupHeadingCss = css`
  font-family: ${semantic.font.family.heading};
  font-size: ${semantic.typography.h6.fontSize};
  font-weight: ${semantic.typography.h6.fontWeight};
  line-height: ${semantic.typography.h6.lineHeight};
  margin: 0;
`;

export const stackCss = css`
  display: flex;
  flex-direction: column;
  gap: ${semantic.gap.md};
`;

export const tightStackCss = css`
  display: flex;
  flex-direction: column;
  gap: ${semantic.gap.xs};
`;
