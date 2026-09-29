import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';

export const breadcrumbListCss = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${component.breadcrumb.gap};
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: ${component.breadcrumb.typography.fontFamily};
  font-size: ${component.breadcrumb.typography.fontSize};
  font-weight: ${component.breadcrumb.typography.fontWeight};
  line-height: ${component.breadcrumb.typography.lineHeight};
  letter-spacing: ${component.breadcrumb.typography.letterSpacing};
`;

export const breadcrumbItemCss = css`
  display: inline-flex;
  align-items: center;
  gap: ${component.breadcrumb.gap};
  min-width: 0;
`;

// Every item but the first starts with a chevron pointing from its parent.
export const breadcrumbSeparatorCss = css`
  flex-shrink: 0;
  width: ${component.breadcrumb.separatorSize};
  height: ${component.breadcrumb.separatorSize};
  color: ${component.breadcrumb.color.separator};

  li:first-child > & {
    display: none;
  }

  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;

export const breadcrumbLinkCss = css`
  color: ${component.breadcrumb.color.link};
  text-decoration-line: underline;
  text-decoration-color: transparent;
  text-decoration-thickness: ${semantic.border.width.default};
  border-radius: ${semantic.round.sm};
  transition-property: color, text-decoration-color;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.standard};

  &:hover {
    color: ${component.breadcrumb.color.linkHover};
    text-decoration-color: currentColor;
  }

  &:focus-visible {
    outline: ${semantic.focus.ring.width} solid transparent;
    outline-offset: ${semantic.focus.ring.offset};
    box-shadow: ${semantic.focus.shadow};
    text-decoration-color: currentColor;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const breadcrumbCurrentCss = css`
  color: ${component.breadcrumb.color.current};
  font-weight: ${semantic.font.weight.medium};
`;
