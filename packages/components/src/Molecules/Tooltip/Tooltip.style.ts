import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';

// Base UI positions this element next to the trigger; it only needs to sit
// above the page.
export const tooltipPositionerCss = css`
  z-index: ${component.tooltip.zIndex};
`;

// `data-starting-style` and `data-ending-style` are set for one frame on open
// and during close, which makes the fade run in both directions. `data-instant`
// is set when moving between tooltips inside a provider, so it skips the fade.
export const tooltipPopupCss = css`
  box-sizing: border-box;
  max-width: min(${component.tooltip.maxWidth}, var(--available-width));
  padding-block: ${component.tooltip.paddingBlock};
  padding-inline: ${component.tooltip.paddingInline};
  border-radius: ${component.tooltip.radius};
  background-color: ${component.tooltip.color.background};
  box-shadow: ${component.tooltip.shadow};
  color: ${component.tooltip.color.text};
  font-family: ${component.tooltip.typography.fontFamily};
  font-size: ${component.tooltip.typography.fontSize};
  font-weight: ${component.tooltip.typography.fontWeight};
  line-height: ${component.tooltip.typography.lineHeight};
  letter-spacing: ${component.tooltip.typography.letterSpacing};
  transform-origin: var(--transform-origin);
  transition-property: opacity;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.enter};

  /* The gap to the trigger is a margin on the side facing it, so the offset
     stays a token instead of a pixel number passed to the positioner. */
  &[data-side='bottom'] {
    margin-top: ${component.tooltip.offset};
  }
  &[data-side='top'] {
    margin-bottom: ${component.tooltip.offset};
  }
  &[data-side='left'],
  &[data-side='inline-start'] {
    margin-inline-end: ${component.tooltip.offset};
  }
  &[data-side='right'],
  &[data-side='inline-end'] {
    margin-inline-start: ${component.tooltip.offset};
  }

  &[data-ending-style] {
    transition-timing-function: ${semantic.motion.easing.exit};
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }

  &[data-instant] {
    transition-duration: ${semantic.motion.duration.instant};
  }
`;
