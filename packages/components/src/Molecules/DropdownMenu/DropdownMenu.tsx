import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cx } from '@linaria/core';
import type { VariantProps } from 'class-variance-authority';
import Button from '@/Atoms/Button/Button';
import type { ButtonProps } from '@/Atoms/Button/Button';
import { useThemedPortalProps } from '@/ThemeProvider/ThemedPortal';
import {
  dropdownMenuGroupLabelCss,
  dropdownMenuItemVariant,
  dropdownMenuPopupCss,
  dropdownMenuPositionerCss,
  dropdownMenuSeparatorCss,
} from './DropdownMenu.style';

export type DropdownMenuProps = {
  children: React.ReactNode;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the menu asks to open or close. */
  onOpenChange?: (open: boolean) => void;
};

export type DropdownMenuTriggerProps = ButtonProps;

export type DropdownMenuContentProps = {
  children: React.ReactNode;
  /** Side of the trigger to place the menu on. Flips when there's no room. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Alignment along that side. */
  align?: 'start' | 'center' | 'end';
  className?: string;
};

export type DropdownMenuItemProps = VariantProps<typeof dropdownMenuItemVariant> & {
  children: React.ReactNode;
  /** Called when the item is chosen, by click, Enter or Space. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Makes the item unselectable. It stays focusable for discoverability. */
  disabled?: boolean;
  /** Whether choosing the item closes the menu. */
  closeOnClick?: boolean;
  className?: string;
};

export type DropdownMenuSeparatorProps = { className?: string };

export type DropdownMenuGroupProps = React.ComponentPropsWithRef<'div'>;

export type DropdownMenuGroupLabelProps = React.ComponentPropsWithRef<'div'>;

/**
 * A list of actions revealed by a trigger button. Arrow keys move through the
 * items, typing jumps to a matching item, and Escape or an outside click
 * closes it and returns focus to the trigger.
 */
function DropdownMenu(props: DropdownMenuProps) {
  const { children, open, defaultOpen, onOpenChange } = props;

  return (
    <BaseMenu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (nextOpen) => onOpenChange(nextOpen) : undefined}
    >
      {children}
    </BaseMenu.Root>
  );
}

/** Opens the menu. Renders a Cascade `Button` and takes its props. */
function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  return <BaseMenu.Trigger render={<Button {...props} />} />;
}

/**
 * The floating list. Portaled to `<body>` but themed like the trigger's
 * subtree: Base UI's portal element carries the nearest ThemeProvider's
 * `data-theme` (see ADR-006).
 */
function DropdownMenuContent(props: DropdownMenuContentProps) {
  const { children, side = 'bottom', align = 'start', className } = props;
  const themedPortalProps = useThemedPortalProps();

  return (
    <BaseMenu.Portal {...themedPortalProps}>
      <BaseMenu.Positioner side={side} align={align} className={dropdownMenuPositionerCss}>
        <BaseMenu.Popup className={cx(dropdownMenuPopupCss, className)}>{children}</BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

/** One action in the menu. `variant="danger"` marks destructive actions. */
function DropdownMenuItem(props: DropdownMenuItemProps) {
  const { variant, className, ...restProps } = props;

  return (
    <BaseMenu.Item className={cx(dropdownMenuItemVariant({ variant }), className)} {...restProps} />
  );
}

/** A line between groups of items. */
function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  const { className } = props;

  return <BaseMenu.Separator className={cx(dropdownMenuSeparatorCss, className)} />;
}

/** Groups related items. Name it with `DropdownMenu.GroupLabel`. */
function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  return <BaseMenu.Group {...props} />;
}

/** Heading that names its group for assistive technology. */
function DropdownMenuGroupLabel(props: DropdownMenuGroupLabelProps) {
  const { className, ...restProps } = props;

  return (
    <BaseMenu.GroupLabel className={cx(dropdownMenuGroupLabelCss, className)} {...restProps} />
  );
}

DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Separator = DropdownMenuSeparator;
DropdownMenu.Group = DropdownMenuGroup;
DropdownMenu.GroupLabel = DropdownMenuGroupLabel;

export default DropdownMenu;
