import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

// Label and value share the first row; the control spans the second.
const baseSliderCss = css`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  column-gap: ${semantic.gap.sm};
  row-gap: ${component.slider.gap};
  width: 100%;
  font-family: ${component.slider.typography.fontFamily};
  font-size: ${component.slider.typography.fontSize};
  font-weight: ${component.slider.typography.fontWeight};
  line-height: ${component.slider.typography.lineHeight};
  letter-spacing: ${component.slider.typography.letterSpacing};
`;

export const sliderVariant = cva(baseSliderCss);

// Label and value keep full contrast when disabled: the dimmed track and
// thumb show the state, and the text must stay readable.
export const sliderLabelCss = css`
  grid-column: 1;
  color: ${component.slider.color.label};
`;

export const sliderValueCss = css`
  grid-column: 2;
  color: ${component.slider.color.value};
  font-variant-numeric: tabular-nums;
`;

// The control is taller than the track so it is an easy pointer target.
export const sliderControlCss = css`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: ${component.slider.controlHeight};
  touch-action: none;
  user-select: none;
  cursor: pointer;

  &[data-disabled] {
    cursor: not-allowed;
  }
`;

export const sliderTrackCss = css`
  width: 100%;
  height: ${component.slider.trackHeight};
  border-radius: ${component.slider.trackRadius};
  background-color: ${component.slider.color.track};
`;

export const sliderIndicatorCss = css`
  border-radius: ${component.slider.trackRadius};
  background-color: ${component.slider.color.fill};

  &[data-disabled] {
    background-color: ${component.slider.color.fillDisabled};
  }
`;

export const sliderThumbCss = css`
  box-sizing: border-box;
  width: ${component.slider.thumbSize};
  height: ${component.slider.thumbSize};
  border: ${component.slider.thumbBorderWidth} solid ${component.slider.color.thumbBorder};
  border-radius: ${semantic.round.full};
  background-color: ${component.slider.color.thumb};
  box-shadow: ${semantic.elevation.sm};
  transition-property: box-shadow;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.standard};

  /* The focusable element is a visually hidden input inside the thumb. */
  &:has(:focus-visible) {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow};
  }

  &[data-disabled] {
    border-color: ${component.slider.color.thumbBorderDisabled};
    box-shadow: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
