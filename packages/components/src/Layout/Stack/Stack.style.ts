import { css } from '@linaria/core';
import { semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseStackCss = css`
  display: flex;
  min-width: 0;
`;

const directions = {
  column: css`
    flex-direction: column;
  `,
  row: css`
    flex-direction: row;
  `,
};

const gaps = {
  none: css`
    gap: 0;
  `,
  xs: css`
    gap: ${semantic.stack.xs};
  `,
  sm: css`
    gap: ${semantic.stack.sm};
  `,
  md: css`
    gap: ${semantic.stack.md};
  `,
  lg: css`
    gap: ${semantic.stack.lg};
  `,
  xl: css`
    gap: ${semantic.stack.xl};
  `,
  '2xl': css`
    gap: ${semantic.stack['2xl']};
  `,
};

const aligns = {
  start: css`
    align-items: flex-start;
  `,
  center: css`
    align-items: center;
  `,
  end: css`
    align-items: flex-end;
  `,
  stretch: css`
    align-items: stretch;
  `,
};

const justifies = {
  start: css`
    justify-content: flex-start;
  `,
  center: css`
    justify-content: center;
  `,
  end: css`
    justify-content: flex-end;
  `,
  between: css`
    justify-content: space-between;
  `,
};

const wraps = {
  true: css`
    flex-wrap: wrap;
  `,
  false: css`
    flex-wrap: nowrap;
  `,
};

export const stackVariant = cva(baseStackCss, {
  variants: {
    direction: directions,
    gap: gaps,
    align: aligns,
    justify: justifies,
    wrap: wraps,
  },
  defaultVariants: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
});
