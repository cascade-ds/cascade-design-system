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
  baseline: css`
    align-items: baseline;
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
  around: css`
    justify-content: space-around;
  `,
  evenly: css`
    justify-content: space-evenly;
  `,
};

const paddings = {
  none: css`
    padding: 0;
  `,
  xs: css`
    padding: ${semantic.padding.xs};
  `,
  sm: css`
    padding: ${semantic.padding.sm};
  `,
  md: css`
    padding: ${semantic.padding.md};
  `,
  lg: css`
    padding: ${semantic.padding.lg};
  `,
  xl: css`
    padding: ${semantic.padding.xl};
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

const grows = {
  true: css`
    flex: 1;
  `,
  false: '',
};

export const stackVariant = cva(baseStackCss, {
  variants: {
    direction: directions,
    gap: gaps,
    align: aligns,
    justify: justifies,
    wrap: wraps,
    grow: grows,
    padding: paddings,
  },
  defaultVariants: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
    grow: false,
    padding: 'none',
  },
});
