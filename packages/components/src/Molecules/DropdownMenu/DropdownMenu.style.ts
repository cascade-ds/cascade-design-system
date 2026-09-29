import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

// Base UI positions this element next to the trigger; it only needs to sit
// above the page.
export const dropdownMenuPositionerCss = css`
  z-index: ${component.dropdown.zIndex};
`;

// `data-starting-style` and `data-ending-style` are set for one frame on open
// and during close, which makes the fade run in both directions.
export const dropdownMenuPopupCss = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: max(${component.dropdown.minWidth}, var(--anchor-width));
  max-width: var(--available-width);
  max-height: var(--available-height);
  overflow-y: auto;
  padding: ${component.dropdown.padding};
  border: ${semantic.border.width.default} solid ${component.dropdown.color.border};
  border-radius: ${component.dropdown.radius};
  background-color: ${component.dropdown.color.background};
  box-shadow: ${component.dropdown.shadow};
  outline: none;
  transform-origin: var(--transform-origin);
  transition-property: opacity, transform;
  transition-duration: ${semantic.motion.duration.fast};
  transition-timing-function: ${semantic.motion.easing.enter};

  /* The gap to the trigger is a margin on the side facing it, so the offset
     stays a token instead of a pixel number passed to the positioner. */
  &[data-side='bottom'] {
    margin-top: ${component.dropdown.offset};
  }
  &[data-side='top'] {
    margin-bottom: ${component.dropdown.offset};
  }
  &[data-side='left'],
  &[data-side='inline-start'] {
    margin-inline-end: ${component.dropdown.offset};
  }
  &[data-side='right'],
  &[data-side='inline-end'] {
    margin-inline-start: ${component.dropdown.offset};
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
    transform: translateY(calc(-1 * ${component.dropdown.offset}));
  }
  &[data-side='top'][data-starting-style],
  &[data-side='top'][data-ending-style] {
    transform: translateY(${component.dropdown.offset});
  }
  &[data-side='left'][data-starting-style],
  &[data-side='left'][data-ending-style] {
    transform: translateX(${component.dropdown.offset});
  }
  &[data-side='right'][data-starting-style],
  &[data-side='right'][data-ending-style] {
    transform: translateX(calc(-1 * ${component.dropdown.offset}));
  }

  @media (prefers-reduced-motion: reduce) {
    transition-property: opacity;

    &[data-starting-style],
    &[data-ending-style] {
      transform: none;
    }
  }
`;

// Keyboard and pointer both move Base UI's highlight (`data-highlighted`), and
// the highlighted item holds focus, so the highlight is the focus indicator.
const baseDropdownMenuItemCss = css`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: ${component.dropdown.item.gap};
  min-height: ${component.dropdown.item.height};
  padding-inline: ${component.dropdown.item.paddingInline};
  border-radius: ${component.dropdown.item.radius};
  font-family: ${component.dropdown.item.typography.fontFamily};
  font-size: ${component.dropdown.item.typography.fontSize};
  font-weight: ${component.dropdown.item.typography.fontWeight};
  line-height: ${component.dropdown.item.typography.lineHeight};
  letter-spacing: ${component.dropdown.item.typography.letterSpacing};
  cursor: default;
  user-select: none;
  outline: none;

  &[data-highlighted] {
    background-color: ${component.dropdown.color.item.backgroundHover};
  }

  &[data-disabled] {
    color: ${component.dropdown.color.item.textDisabled};
  }
`;

const variants = {
  default: css`
    color: ${component.dropdown.color.item.text};
  `,
  danger: css`
    color: ${component.dropdown.color.item.textDanger};
  `,
};

export const dropdownMenuItemVariant = cva(baseDropdownMenuItemCss, {
  variants: { variant: variants },
  defaultVariants: { variant: 'default' },
});

export const dropdownMenuSeparatorCss = css`
  margin-block: ${component.dropdown.separator.marginBlock};
  border: none;
  border-top: ${semantic.border.width.default} solid ${component.dropdown.color.separator};
`;

export const dropdownMenuGroupLabelCss = css`
  padding-inline: ${component.dropdown.item.paddingInline};
  padding-block: ${component.dropdown.groupLabel.paddingBlock};
  color: ${component.dropdown.color.groupLabel};
  font-family: ${component.dropdown.groupLabel.typography.fontFamily};
  font-size: ${component.dropdown.groupLabel.typography.fontSize};
  font-weight: ${component.dropdown.groupLabel.typography.fontWeight};
  line-height: ${component.dropdown.groupLabel.typography.lineHeight};
  letter-spacing: ${component.dropdown.groupLabel.typography.letterSpacing};
`;
