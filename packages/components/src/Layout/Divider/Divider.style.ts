import { css } from '@linaria/core';
import { component } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseDividerCss = css`
  flex-shrink: 0;
  margin: 0;
  border: none;
`;

const orientations = {
  horizontal: css`
    width: 100%;
    height: ${component.divider.thickness};
  `,
  vertical: css`
    align-self: stretch;
    width: ${component.divider.thickness};
    height: auto;
  `,
};

const tones = {
  subtle: css`
    background-color: ${component.divider.color.subtle};
  `,
  default: css`
    background-color: ${component.divider.color.default};
  `,
  strong: css`
    background-color: ${component.divider.color.strong};
  `,
};

export const dividerVariant = cva(baseDividerCss, {
  variants: {
    orientation: orientations,
    tone: tones,
  },
  defaultVariants: {
    orientation: 'horizontal',
    tone: 'default',
  },
});
