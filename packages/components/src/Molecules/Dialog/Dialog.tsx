import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cx } from '@linaria/core';
import type { VariantProps } from 'class-variance-authority';
import { Button } from '../../Atoms/Button';
import type { ButtonProps } from '../../Atoms/Button/Button';
import { useThemedPortalProps } from '../../ThemeProvider/ThemedPortal';
import {
  dialogActionsCss,
  dialogBackdropCss,
  dialogDescriptionCss,
  dialogPopupVariant,
  dialogTitleCss,
} from './Dialog.style';

export type DialogProps = {
  children: React.ReactNode;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the dialog asks to open or close. */
  onOpenChange?: (open: boolean) => void;
};

export type DialogTriggerProps = ButtonProps;

export type DialogContentProps = VariantProps<typeof dialogPopupVariant> & {
  children: React.ReactNode;
  className?: string;
};

export type DialogTitleProps = React.ComponentPropsWithRef<'h2'>;

export type DialogDescriptionProps = React.ComponentPropsWithRef<'p'>;

export type DialogActionsProps = React.ComponentPropsWithRef<'div'>;

export type DialogCloseProps = ButtonProps;

/**
 * A modal window over the page. Traps focus while open, locks page scroll,
 * closes on Escape, backdrop click or `Dialog.Close`, and returns focus to the
 * trigger.
 */
function Dialog(props: DialogProps) {
  const { children, open, defaultOpen, onOpenChange } = props;

  return (
    <BaseDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (nextOpen) => onOpenChange(nextOpen) : undefined}
    >
      {children}
    </BaseDialog.Root>
  );
}

/** Opens the dialog. Renders a Cascade `Button` and takes its props. */
function DialogTrigger(props: DialogTriggerProps) {
  return <BaseDialog.Trigger render={<Button.Root {...props} />} />;
}

/**
 * The backdrop and the window. Portaled to `<body>` but themed like the
 * trigger's subtree: Base UI's portal element carries the nearest
 * ThemeProvider's `data-theme` (see ADR-006).
 */
function DialogContent(props: DialogContentProps) {
  const { children, size, className } = props;
  const themedPortalProps = useThemedPortalProps();

  return (
    <BaseDialog.Portal {...themedPortalProps}>
      <BaseDialog.Backdrop className={dialogBackdropCss} />
      <BaseDialog.Popup className={cx(dialogPopupVariant({ size }), className)}>
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

/** Heading that names the dialog for assistive technology. */
function DialogTitle(props: DialogTitleProps) {
  const { className, ...restProps } = props;

  return <BaseDialog.Title className={cx(dialogTitleCss, className)} {...restProps} />;
}

/** Supporting text, announced along with the title. */
function DialogDescription(props: DialogDescriptionProps) {
  const { className, ...restProps } = props;

  return <BaseDialog.Description className={cx(dialogDescriptionCss, className)} {...restProps} />;
}

/** Row of buttons at the end of the dialog, aligned to the end. */
function DialogActions(props: DialogActionsProps) {
  const { className, ...restProps } = props;

  return <div className={cx(dialogActionsCss, className)} {...restProps} />;
}

/** Closes the dialog. Renders a Cascade `Button` and takes its props. */
function DialogClose(props: DialogCloseProps) {
  return <BaseDialog.Close render={<Button.Root {...props} />} />;
}

export {
  Dialog as Root,
  DialogTrigger as Trigger,
  DialogContent as Content,
  DialogTitle as Title,
  DialogDescription as Description,
  DialogActions as Actions,
  DialogClose as Close,
};
