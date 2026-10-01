import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseCardCss = css`
  display: flex;
  flex-direction: column;
  gap: ${component.card.gap};
  box-sizing: border-box;
  min-width: 0;
  margin: 0;
  padding: ${component.card.padding};
  border: ${component.card.borderWidth} solid
    var(--cascade-card-border, ${component.card.color.border});
  border-radius: ${component.card.radius};
  background-color: var(--cascade-card-background, ${component.card.color.background});
  box-shadow: ${component.card.shadow.default};
  color: ${component.card.color.title};
`;

const interactiveStates = {
  true: css`
    transition-property: box-shadow, border-color;
    transition-duration: ${semantic.motion.duration.fast};
    transition-timing-function: ${semantic.motion.easing.standard};

    &:focus-within {
      border-color: var(--cascade-card-border-hover, ${component.card.color.borderHover});
      box-shadow: ${component.card.shadow.hover};
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  `,
  false: '',
};

// Pointer hover on an interactive card; `hover={false}` leaves only the focus-within lift.
const hoverCss = css`
  &:hover {
    border-color: var(--cascade-card-border-hover, ${component.card.color.borderHover});
    box-shadow: ${component.card.shadow.hover};
  }
`;

const backgrounds = {
  default: '',
  subtle: css`
    --cascade-card-background: ${component.card.color.tone.subtle.background};
    --cascade-card-border: ${component.card.color.tone.subtle.border};
    --cascade-card-border-hover: ${component.card.color.tone.subtle.borderHover};
  `,
  brand: css`
    --cascade-card-background: ${component.card.color.tone.brand.background};
    --cascade-card-border: ${component.card.color.tone.brand.border};
    --cascade-card-border-hover: ${component.card.color.tone.brand.borderHover};
  `,
  secondary: css`
    --cascade-card-background: ${component.card.color.tone.secondary.background};
    --cascade-card-border: ${component.card.color.tone.secondary.border};
    --cascade-card-border-hover: ${component.card.color.tone.secondary.borderHover};
  `,
  tertiary: css`
    --cascade-card-background: ${component.card.color.tone.tertiary.background};
    --cascade-card-border: ${component.card.color.tone.tertiary.border};
    --cascade-card-border-hover: ${component.card.color.tone.tertiary.borderHover};
  `,
  accent: css`
    --cascade-card-background: ${component.card.color.tone.accent.background};
    --cascade-card-border: ${component.card.color.tone.accent.border};
    --cascade-card-border-hover: ${component.card.color.tone.accent.borderHover};
  `,
  success: css`
    --cascade-card-background: ${component.card.color.tone.success.background};
    --cascade-card-border: ${component.card.color.tone.success.border};
    --cascade-card-border-hover: ${component.card.color.tone.success.borderHover};
  `,
  info: css`
    --cascade-card-background: ${component.card.color.tone.info.background};
    --cascade-card-border: ${component.card.color.tone.info.border};
    --cascade-card-border-hover: ${component.card.color.tone.info.borderHover};
  `,
  danger: css`
    --cascade-card-background: ${component.card.color.tone.danger.background};
    --cascade-card-border: ${component.card.color.tone.danger.border};
    --cascade-card-border-hover: ${component.card.color.tone.danger.borderHover};
  `,
};

export const cardVariant = cva(baseCardCss, {
  variants: {
    background: backgrounds,
    interactive: interactiveStates,
    hover: { true: '', false: '' },
  },
  compoundVariants: [{ interactive: true, hover: true, class: hoverCss }],
  defaultVariants: {
    background: 'default',
    interactive: false,
    hover: true,
  },
});

export const cardHeaderCss = css`
  display: flex;
  flex-direction: column;
  gap: ${component.card.headerGap};
`;

export const cardTitleCss = css`
  margin: 0;
  color: ${component.card.color.title};
  font-family: ${component.card.title.fontFamily};
  font-size: ${component.card.title.fontSize};
  font-weight: ${component.card.title.fontWeight};
  line-height: ${component.card.title.lineHeight};
  letter-spacing: ${component.card.title.letterSpacing};
`;

export const cardSubtitleCss = css`
  margin: 0;
  color: ${component.card.color.subtitle};
  font-family: ${component.card.subtitle.fontFamily};
  font-size: ${component.card.subtitle.fontSize};
  font-weight: ${component.card.subtitle.fontWeight};
  line-height: ${component.card.subtitle.lineHeight};
  letter-spacing: ${component.card.subtitle.letterSpacing};
`;

export const cardBodyCss = css`
  min-width: 0;
`;

export const cardFooterCss = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: ${component.card.footerGap};
`;
