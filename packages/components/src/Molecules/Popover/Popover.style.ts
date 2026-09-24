import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';

// Base UI positions this element next to the trigger; it only needs to sit
// above the page.
export const popoverPositionerCss = css`
  z-index: ${component.popover.zIndex};
`;

// State comes from Base UI's data attributes, so everything below is plain
// CSS: `data-side` says where the popup sits, `data-starting-style` and
// `data-ending-style` are set for one frame on open and during close, which
// makes the transition run in both directions.
export const popoverPopupCss = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${component.popover.gap};
  min-width: ${component.popover.minWidth};
  max-width: var(--available-width);
  padding: ${component.popover.padding};
  border: ${semantic.border.width.default} solid ${component.popover.color.border};
  border-radius: ${component.popover.radius};
  background-color: ${component.popover.color.background};
  box-shadow: ${component.popover.shadow};
  font-family: ${component.popover.body.fontFamily};
  font-size: ${component.popover.body.fontSize};
  font-weight: ${component.popover.body.fontWeight};
  line-height: ${component.popover.body.lineHeight};
  letter-spacing: ${component.popover.body.letterSpacing};
  transform-origin: var(--transform-origin);
  transition-property: opacity, transform;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.enter};

  &:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow}, ${component.popover.shadow};
  }

  /* The gap to the trigger is a margin on the side facing it, so the offset
     stays a token instead of a pixel number passed to the positioner. */
  &[data-side='bottom'] {
    margin-top: ${component.popover.offset};
  }
  &[data-side='top'] {
    margin-bottom: ${component.popover.offset};
  }
  &[data-side='left'],
  &[data-side='inline-start'] {
    margin-inline-end: ${component.popover.offset};
  }
  &[data-side='right'],
  &[data-side='inline-end'] {
    margin-inline-start: ${component.popover.offset};
  }

  &[data-ending-style] {
    transition-timing-function: ${semantic.motion.easing.exit};
  }

  /* Fades in while moving out of the trigger by one offset. */
  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }
  &[data-side='bottom'][data-starting-style],
  &[data-side='bottom'][data-ending-style] {
    transform: translateY(calc(-1 * ${component.popover.offset}));
  }
  &[data-side='top'][data-starting-style],
  &[data-side='top'][data-ending-style] {
    transform: translateY(${component.popover.offset});
  }
  &[data-side='left'][data-starting-style],
  &[data-side='left'][data-ending-style] {
    transform: translateX(${component.popover.offset});
  }
  &[data-side='right'][data-starting-style],
  &[data-side='right'][data-ending-style] {
    transform: translateX(calc(-1 * ${component.popover.offset}));
  }

  @media (prefers-reduced-motion: reduce) {
    transition-property: opacity;

    &[data-starting-style],
    &[data-ending-style] {
      transform: none;
    }
  }
`;

export const popoverTitleCss = css`
  margin: 0;
  color: ${component.popover.color.title};
  font-family: ${component.popover.title.fontFamily};
  font-size: ${component.popover.title.fontSize};
  font-weight: ${component.popover.title.fontWeight};
  line-height: ${component.popover.title.lineHeight};
  letter-spacing: ${component.popover.title.letterSpacing};
`;

export const popoverDescriptionCss = css`
  margin: 0;
  color: ${component.popover.color.description};
`;
