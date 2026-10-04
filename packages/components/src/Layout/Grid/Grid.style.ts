import { css } from '@linaria/core';
import { semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseGridCss = css`
  display: grid;
  min-width: 0;
`;

const columns = {
  1: css`
    grid-template-columns: minmax(0, 1fr);
  `,
  2: css`
    grid-template-columns: repeat(2, minmax(0, 1fr));
  `,
  3: css`
    grid-template-columns: repeat(3, minmax(0, 1fr));
  `,
  4: css`
    grid-template-columns: repeat(4, minmax(0, 1fr));
  `,
  6: css`
    grid-template-columns: repeat(6, minmax(0, 1fr));
  `,
  auto: css`
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(var(--cascade-grid-min-child-width, 16rem), 100%), 1fr)
    );
  `,
  12: css`
    grid-template-columns: repeat(${semantic.layout.columns}, minmax(0, 1fr));
  `,
};

const gaps = {
  none: css`
    gap: 0;
  `,
  xs: css`
    gap: ${semantic.gap.xs};
  `,
  sm: css`
    gap: ${semantic.gap.sm};
  `,
  md: css`
    gap: ${semantic.gap.md};
  `,
  lg: css`
    gap: ${semantic.gap.lg};
  `,
  xl: css`
    gap: ${semantic.gap.xl};
  `,
  gutter: css`
    gap: ${semantic.layout.gutter};
  `,
};

const aligns = {
  start: css`
    align-items: start;
  `,
  center: css`
    align-items: center;
  `,
  end: css`
    align-items: end;
  `,
  stretch: css`
    align-items: stretch;
  `,
};

const justifies = {
  start: css`
    justify-items: start;
  `,
  center: css`
    justify-items: center;
  `,
  end: css`
    justify-items: end;
  `,
  stretch: css`
    justify-items: stretch;
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

export const gridVariant = cva(baseGridCss, {
  variants: {
    columns,
    gap: gaps,
    align: aligns,
    justify: justifies,
    padding: paddings,
  },
  defaultVariants: {
    columns: 12,
    gap: 'gutter',
    align: 'stretch',
    justify: 'stretch',
    padding: 'none',
  },
});
