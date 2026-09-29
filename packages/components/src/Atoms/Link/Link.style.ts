import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

// Typography is inherited, so a link matches the text around it.
const baseLinkCss = css`
  color: ${component.link.color.default};
  text-decoration-line: underline;
  text-decoration-thickness: ${component.link.underlineThickness};
  border-radius: ${semantic.round.sm};
  cursor: pointer;
  transition-property: color, text-decoration-color;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.standard};

  &:hover {
    color: ${component.link.color.hover};
  }

  &:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const variants = {
  // In running text the underline is always shown, so the link doesn't rely
  // on color alone to stand out from the words around it.
  inline: css`
    text-decoration-color: currentColor;
  `,
  // On its own (a "Forgot password?" line, a card footer) the position already
  // marks it as a link, so the underline only appears on hover and focus.
  standalone: css`
    text-decoration-color: transparent;

    &:hover,
    &:focus-visible {
      text-decoration-color: currentColor;
    }
  `,
};

export const linkVariant = cva(baseLinkCss, {
  variants: {
    variant: variants,
  },
  defaultVariants: {
    variant: 'inline',
  },
});

export const linkExternalIconCss = css`
  display: inline-block;
  width: ${semantic.size.icon.xs};
  height: ${semantic.size.icon.xs};
  vertical-align: baseline;
`;
