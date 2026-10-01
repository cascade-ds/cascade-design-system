import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

export const accordionCss = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(
    --cascade-accordion-background,
    ${component.accordion.color.background.default}
  );
  border-block-end: ${component.accordion.borderWidth} solid
    var(--cascade-accordion-border, ${component.accordion.color.border});
`;

export const accordionItemCss = css`
  border-block-start: ${component.accordion.borderWidth} solid
    var(--cascade-accordion-border, ${component.accordion.color.border});
`;

// Overflow is clipped so hover fills follow the corners; that would cut the outer focus ring, so triggers draw it inset here.
const filledCss = css`
  --cascade-accordion-padding-inline: ${component.accordion.filledPaddingInline};
  --cascade-accordion-icon: ${component.accordion.color.iconFilled};
  --cascade-accordion-focus-shadow: inset 0 0 0 ${semantic.focus.ring.width}
    ${semantic.color.border.focus};
  box-sizing: border-box;
  overflow: hidden;
  border: ${component.accordion.borderWidth} solid var(--cascade-accordion-border);
  border-radius: ${component.accordion.radius};

  & > :first-child {
    border-block-start: none;
  }
`;

const backgrounds = {
  default: '',
  subtle: [
    filledCss,
    css`
      --cascade-accordion-background: ${component.accordion.color.background.subtle};
      --cascade-accordion-border: ${component.accordion.color.border};
    `,
  ],
  surface: [
    filledCss,
    css`
      --cascade-accordion-background: ${component.accordion.color.background.surface};
      --cascade-accordion-border: ${component.accordion.color.border};
    `,
  ],
  brand: [
    filledCss,
    css`
      --cascade-accordion-background: ${component.accordion.color.background.brand};
      --cascade-accordion-border: ${component.accordion.color.borderBrand};
    `,
  ],
  secondary: [
    filledCss,
    css`
      --cascade-accordion-background: ${component.accordion.color.background.secondary};
      --cascade-accordion-border: ${component.accordion.color.borderSecondary};
    `,
  ],
};

export const accordionVariant = cva(accordionCss, {
  variants: { background: backgrounds },
  defaultVariants: { background: 'default' },
});

export const accordionHeaderCss = css`
  margin: 0;
`;

export const accordionTriggerCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${component.accordion.trigger.gap};
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding-block: ${component.accordion.trigger.paddingBlock};
  padding-inline: var(
    --cascade-accordion-padding-inline,
    ${component.accordion.trigger.paddingInline}
  );
  border: none;
  background: none;
  color: ${component.accordion.color.trigger.text};
  font-family: ${component.accordion.trigger.typography.fontFamily};
  font-size: ${component.accordion.trigger.typography.fontSize};
  font-weight: ${component.accordion.trigger.typography.fontWeight};
  line-height: ${component.accordion.trigger.typography.lineHeight};
  letter-spacing: ${component.accordion.trigger.typography.letterSpacing};
  text-align: start;
  cursor: pointer;
  transition-property: background-color;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.standard};

  &:hover:not([data-disabled]) {
    background-color: ${component.accordion.color.trigger.backgroundHover};
  }

  &:focus-visible {
    position: relative;
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: var(--cascade-accordion-focus-shadow, ${semantic.focus.shadow});
  }

  &[data-disabled] {
    color: ${component.accordion.color.trigger.textDisabled};
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const accordionIconCss = css`
  flex-shrink: 0;
  width: ${component.accordion.iconSize};
  height: ${component.accordion.iconSize};
  color: var(--cascade-accordion-icon, ${component.accordion.color.icon});
  transition-property: transform;
  transition-duration: ${semantic.motion.duration.normal};
  transition-timing-function: ${semantic.motion.easing.standard};

  [data-panel-open] > & {
    transform: rotate(180deg);
  }

  [data-disabled] > & {
    color: ${semantic.color.icon.disabled};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const accordionPanelCss = css`
  box-sizing: border-box;
  height: var(--accordion-panel-height);
  overflow: hidden;
  color: ${component.accordion.color.panelText};
  font-family: ${component.accordion.panel.typography.fontFamily};
  font-size: ${component.accordion.panel.typography.fontSize};
  font-weight: ${component.accordion.panel.typography.fontWeight};
  line-height: ${component.accordion.panel.typography.lineHeight};
  letter-spacing: ${component.accordion.panel.typography.letterSpacing};
  transition-property: height;
  transition-duration: ${semantic.motion.duration.normal};
  transition-timing-function: ${semantic.motion.easing.standard};

  &[data-starting-style],
  &[data-ending-style] {
    height: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const accordionPanelContentCss = css`
  padding-inline: var(
    --cascade-accordion-padding-inline,
    ${component.accordion.panel.paddingInline}
  );
  padding-block-end: ${component.accordion.panel.paddingBottom};
`;
