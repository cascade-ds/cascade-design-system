import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

export const paginationListCss = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${component.pagination.gap};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const baseItemCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: var(--cascade-pagination-size);
  height: var(--cascade-pagination-size);
  margin: 0;
  padding-inline: ${component.pagination.paddingInline};
  border: ${semantic.border.width.default} solid transparent;
  border-radius: ${component.pagination.radius};
  background-color: ${semantic.color.background.transparent};
  color: ${component.pagination.color.text};
  font-family: ${component.pagination.typography.fontFamily};
  font-size: ${component.pagination.typography.fontSize};
  font-weight: ${component.pagination.typography.fontWeight};
  line-height: ${component.pagination.typography.lineHeight};
  letter-spacing: ${component.pagination.typography.letterSpacing};
  font-variant-numeric: tabular-nums;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition-property: background-color, color;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.standard};

  &:hover:not(:disabled):not([aria-disabled='true']):not([aria-current='page']) {
    background-color: ${component.pagination.color.backgroundHover};
    color: ${component.pagination.color.textHover};
  }

  &:active:not(:disabled):not([aria-disabled='true']):not([aria-current='page']) {
    background-color: ${component.pagination.color.backgroundPressed};
  }

  &:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow};
  }

  &[aria-current='page'] {
    background-color: ${component.pagination.color.backgroundCurrent};
    border-color: ${component.pagination.color.borderCurrent};
    color: ${component.pagination.color.textCurrent};
    cursor: default;
  }

  &:disabled,
  &[aria-disabled='true'] {
    color: ${component.pagination.color.textDisabled};
    cursor: not-allowed;
  }

  & > svg {
    width: ${component.pagination.iconSize};
    height: ${component.pagination.iconSize};
  }

  [dir='rtl'] & > svg {
    transform: scaleX(-1);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const sizes = {
  sm: css`
    --cascade-pagination-size: ${component.pagination.size.sm};
  `,
  md: css`
    --cascade-pagination-size: ${component.pagination.size.md};
  `,
};

export const paginationItemVariant = cva(baseItemCss, {
  variants: {
    size: sizes,
  },
  defaultVariants: {
    size: 'md',
  },
});

export const paginationEllipsisVariant = cva(
  css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--cascade-pagination-size);
    height: var(--cascade-pagination-size);
    color: ${component.pagination.color.ellipsis};
    font-family: ${component.pagination.typography.fontFamily};
    font-size: ${component.pagination.typography.fontSize};
    user-select: none;
  `,
  {
    variants: {
      size: sizes,
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
