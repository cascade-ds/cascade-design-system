import { Popover as BasePopover } from '@base-ui/react/popover';
import { cx } from '@linaria/core';
import Button from '@/Atoms/Button/Button';
import type { ButtonProps } from '@/Atoms/Button/Button';
import { useThemedPortalProps } from '@/ThemeProvider/ThemedPortal';
import {
  popoverDescriptionCss,
  popoverPopupCss,
  popoverPositionerCss,
  popoverTitleCss,
} from './Popover.style';

export type PopoverProps = {
  children: React.ReactNode;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the popover asks to open or close. */
  onOpenChange?: (open: boolean) => void;
};

export type PopoverTriggerProps = ButtonProps;

export type PopoverContentProps = {
  children: React.ReactNode;
  /** Side of the trigger to place the popup on. Flips when there's no room. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Alignment along that side. */
  align?: 'start' | 'center' | 'end';
  className?: string;
};

export type PopoverTitleProps = React.ComponentPropsWithRef<'h2'>;

export type PopoverDescriptionProps = React.ComponentPropsWithRef<'p'>;

export type PopoverCloseProps = ButtonProps;

/**
 * A non-modal panel anchored to a trigger. Opens on click, closes on Escape,
 * outside click or `Popover.Close`, and returns focus to the trigger.
 */
function Popover(props: PopoverProps) {
  const { children, open, defaultOpen, onOpenChange } = props;

  return (
    <BasePopover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (nextOpen) => onOpenChange(nextOpen) : undefined}
    >
      {children}
    </BasePopover.Root>
  );
}

/** Opens the popover. Renders a Cascade `Button` and takes its props. */
function PopoverTrigger(props: PopoverTriggerProps) {
  return <BasePopover.Trigger render={<Button {...props} />} />;
}

/**
 * The floating panel. Portaled to `<body>` but themed like the trigger's
 * subtree: Base UI's portal element carries the nearest ThemeProvider's
 * `data-theme` (see ADR-006).
 */
function PopoverContent(props: PopoverContentProps) {
  const { children, side = 'bottom', align = 'center', className } = props;
  const themedPortalProps = useThemedPortalProps();

  return (
    <BasePopover.Portal {...themedPortalProps}>
      <BasePopover.Positioner side={side} align={align} className={popoverPositionerCss}>
        <BasePopover.Popup className={cx(popoverPopupCss, className)}>{children}</BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

/** Heading that names the popover for assistive technology. */
function PopoverTitle(props: PopoverTitleProps) {
  const { className, ...restProps } = props;

  return <BasePopover.Title className={cx(popoverTitleCss, className)} {...restProps} />;
}

/** Supporting text, announced along with the title. */
function PopoverDescription(props: PopoverDescriptionProps) {
  const { className, ...restProps } = props;

  return (
    <BasePopover.Description className={cx(popoverDescriptionCss, className)} {...restProps} />
  );
}

/** Closes the popover. Renders a Cascade `Button` and takes its props. */
function PopoverClose(props: PopoverCloseProps) {
  return <BasePopover.Close render={<Button {...props} />} />;
}

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Title = PopoverTitle;
Popover.Description = PopoverDescription;
Popover.Close = PopoverClose;

export default Popover;
