import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

// Shared by Badge and Tag: `component.badge` covers "badge / status pill / tag".
export const badgeBaseCss = css`
  display: inline-flex;
  align-items: center;
  gap: ${component.badge.gap};
  box-sizing: border-box;
  padding-block: ${component.badge.paddingBlock};
  border-width: ${semantic.border.width.default};
  border-style: solid;
  border-radius: ${component.badge.radius};
  white-space: nowrap;
  vertical-align: middle;
`;

export const badgeTones = {
  neutral: css`
    background-color: ${component.badge.color.neutral.background};
    border-color: ${component.badge.color.neutral.border};
    color: ${component.badge.color.neutral.text};
  `,
  primary: css`
    background-color: ${component.badge.color.primary.background};
    border-color: ${component.badge.color.primary.border};
    color: ${component.badge.color.primary.text};
  `,
  secondary: css`
    background-color: ${component.badge.color.secondary.background};
    border-color: ${component.badge.color.secondary.border};
    color: ${component.badge.color.secondary.text};
  `,
  success: css`
    background-color: ${component.badge.color.success.background};
    border-color: ${component.badge.color.success.border};
    color: ${component.badge.color.success.text};
  `,
  warning: css`
    background-color: ${component.badge.color.warning.background};
    border-color: ${component.badge.color.warning.border};
    color: ${component.badge.color.warning.text};
  `,
  danger: css`
    background-color: ${component.badge.color.danger.background};
    border-color: ${component.badge.color.danger.border};
    color: ${component.badge.color.danger.text};
  `,
  info: css`
    background-color: ${component.badge.color.info.background};
    border-color: ${component.badge.color.info.border};
    color: ${component.badge.color.info.text};
  `,
};

export const badgeSizes = {
  sm: css`
    min-height: ${component.badge.size.sm.minHeight};
    padding-inline: ${component.badge.size.sm.paddingInline};
    font-family: ${component.badge.size.sm.typography.fontFamily};
    font-size: ${component.badge.size.sm.typography.fontSize};
    font-weight: ${component.badge.size.sm.typography.fontWeight};
    line-height: ${component.badge.size.sm.typography.lineHeight};
    letter-spacing: ${component.badge.size.sm.typography.letterSpacing};
  `,
  md: css`
    min-height: ${component.badge.size.md.minHeight};
    padding-inline: ${component.badge.size.md.paddingInline};
    font-family: ${component.badge.size.md.typography.fontFamily};
    font-size: ${component.badge.size.md.typography.fontSize};
    font-weight: ${component.badge.size.md.typography.fontWeight};
    line-height: ${component.badge.size.md.typography.lineHeight};
    letter-spacing: ${component.badge.size.md.typography.letterSpacing};
  `,
};

export const badgeVariant = cva(badgeBaseCss, {
  variants: {
    tone: badgeTones,
    size: badgeSizes,
  },
  defaultVariants: {
    tone: 'neutral',
    size: 'md',
  },
});
