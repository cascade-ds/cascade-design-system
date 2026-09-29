import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';

export const tabsCss = css`
  display: flex;
  flex-direction: column;
  gap: ${semantic.stack.md};
`;

// The bottom border is the track the indicator slides along.
export const tabsListCss = css`
  position: relative;
  display: flex;
  gap: ${component.tabs.gap};
  border-block-end: ${semantic.border.width.default} solid ${component.tabs.color.border};
`;

export const tabsTabCss = css`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: ${component.tabs.height};
  margin: 0;
  padding-block: 0;
  padding-inline: ${component.tabs.paddingInline};
  border: none;
  background: none;
  color: ${component.tabs.color.text.default};
  font-family: ${component.tabs.typography.fontFamily};
  font-size: ${component.tabs.typography.fontSize};
  font-weight: ${component.tabs.typography.fontWeight};
  line-height: ${component.tabs.typography.lineHeight};
  letter-spacing: ${component.tabs.typography.letterSpacing};
  white-space: nowrap;
  cursor: pointer;
  transition-property: color;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.standard};

  &:hover:not([data-disabled]) {
    color: ${component.tabs.color.text.hover};
  }

  &[data-active] {
    color: ${component.tabs.color.text.active};
  }

  &[data-disabled] {
    color: ${component.tabs.color.text.disabled};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow};
  }
`;

// Base UI measures the active tab and exposes its box as CSS variables; the
// indicator sits over the list's bottom border under that tab.
export const tabsIndicatorCss = css`
  position: absolute;
  bottom: calc(-1 * ${semantic.border.width.default});
  left: var(--active-tab-left);
  width: var(--active-tab-width);
  height: ${component.tabs.indicatorHeight};
  background-color: ${component.tabs.color.indicator};
  transition-property: left, width;
  transition-duration: ${semantic.motion.duration.normal};
  transition-timing-function: ${semantic.motion.easing.standard};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const tabsPanelCss = css`
  &:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow};
  }
`;
