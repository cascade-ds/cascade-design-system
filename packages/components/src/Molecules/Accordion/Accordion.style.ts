import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';

export const accordionCss = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-block-end: ${component.accordion.borderWidth} solid ${component.accordion.color.border};
`;

export const accordionItemCss = css`
  border-block-start: ${component.accordion.borderWidth} solid ${component.accordion.color.border};
`;

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
  padding-inline: ${component.accordion.trigger.paddingInline};
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
    box-shadow: ${semantic.focus.shadow};
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
  color: ${component.accordion.color.icon};
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
  padding-inline: ${component.accordion.panel.paddingInline};
  padding-block-end: ${component.accordion.panel.paddingBottom};
`;
