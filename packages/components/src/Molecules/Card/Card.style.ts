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
  border: ${component.card.borderWidth} solid ${component.card.color.border};
  border-radius: ${component.card.radius};
  background-color: ${component.card.color.background};
  box-shadow: ${component.card.shadow.default};
  color: ${component.card.color.title};
`;

const interactiveStates = {
  // For cards that contain a single primary link or button: the card lifts
  // while it is hovered or holds focus, hinting that the whole card leads
  // somewhere.
  true: css`
    transition-property: box-shadow;
    transition-duration: ${semantic.motion.duration.fast};
    transition-timing-function: ${semantic.motion.easing.standard};

    &:hover,
    &:focus-within {
      box-shadow: ${component.card.shadow.hover};
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  `,
  false: '',
};

export const cardVariant = cva(baseCardCss, {
  variants: {
    interactive: interactiveStates,
  },
  defaultVariants: {
    interactive: false,
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
