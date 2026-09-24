import { css } from '@linaria/core';
import { semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseContainerCss = css`
  box-sizing: border-box;
  width: 100%;
  margin-inline: auto;
  padding-inline: ${semantic.layout.gutter};
`;

const sizes = {
  sm: css`
    max-width: ${semantic.layout.container.sm};
  `,
  md: css`
    max-width: ${semantic.layout.container.md};
  `,
  lg: css`
    max-width: ${semantic.layout.container.lg};
  `,
  xl: css`
    max-width: ${semantic.layout.container.xl};
  `,
};

export const containerVariant = cva(baseContainerCss, {
  variants: {
    size: sizes,
  },
  defaultVariants: {
    size: 'xl',
  },
});
