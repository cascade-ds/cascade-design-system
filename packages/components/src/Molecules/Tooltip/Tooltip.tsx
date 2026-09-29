import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cx } from '@linaria/core';
import Button from '../../Atoms/Button/Button';
import type { ButtonProps } from '../../Atoms/Button/Button';
import { useThemedPortalProps } from '../../ThemeProvider/ThemedPortal';
import { tooltipPopupCss, tooltipPositionerCss } from './Tooltip.style';

export type TooltipProps = {
  children: React.ReactNode;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the tooltip asks to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** Stops the tooltip from opening. */
  disabled?: boolean;
};

export type TooltipProviderProps = {
  children: React.ReactNode;
  /** Milliseconds to wait before the first tooltip in the group opens. */
  delay?: number;
  /** Milliseconds to wait before a tooltip in the group closes. */
  closeDelay?: number;
};

export type TooltipTriggerProps = ButtonProps & {
  /** Milliseconds to wait on hover before opening. */
  delay?: number;
  /** Milliseconds to wait before closing. */
  closeDelay?: number;
};

export type TooltipContentProps = {
  children: React.ReactNode;
  /** Side of the trigger to place the tooltip on. Flips when there's no room. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Alignment along that side. */
  align?: 'start' | 'center' | 'end';
  className?: string;
};

/**
 * A short text label shown on hover or keyboard focus of its trigger. It is
 * supplementary: the trigger must still have its own accessible name.
 */
function Tooltip(props: TooltipProps) {
  const { children, open, defaultOpen, onOpenChange, disabled } = props;

  return (
    <BaseTooltip.Root
      open={open}
      defaultOpen={defaultOpen}
      disabled={disabled}
      onOpenChange={onOpenChange ? (nextOpen) => onOpenChange(nextOpen) : undefined}
    >
      {children}
    </BaseTooltip.Root>
  );
}

/**
 * Shares delays across a group of tooltips, e.g. a toolbar: once one is open,
 * moving to a neighbour opens its tooltip instantly.
 */
function TooltipProvider(props: TooltipProviderProps) {
  return <BaseTooltip.Provider {...props} />;
}

/** Shows the tooltip on hover or focus. Renders a Cascade `Button`. */
function TooltipTrigger(props: TooltipTriggerProps) {
  const { delay, closeDelay, ...buttonProps } = props;

  return (
    <BaseTooltip.Trigger
      delay={delay}
      closeDelay={closeDelay}
      render={<Button {...buttonProps} />}
    />
  );
}

/**
 * The floating label. Portaled to `<body>` but themed like the trigger's
 * subtree: Base UI's portal element carries the nearest ThemeProvider's
 * `data-theme` (see ADR-006).
 */
function TooltipContent(props: TooltipContentProps) {
  const { children, side = 'top', align = 'center', className } = props;
  const themedPortalProps = useThemedPortalProps();

  return (
    <BaseTooltip.Portal {...themedPortalProps}>
      <BaseTooltip.Positioner side={side} align={align} className={tooltipPositionerCss}>
        <BaseTooltip.Popup className={cx(tooltipPopupCss, className)}>{children}</BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

Tooltip.Provider = TooltipProvider;
Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;

export default Tooltip;
