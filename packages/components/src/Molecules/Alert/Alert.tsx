import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';
import Box from '../../Layout/Box';
import { Button } from '../../Atoms/Button';
import Icon from '../../Atoms/Icon/Icon';
import CloseIcon from '../../internal/CloseIcon';
import {
  alertBodyCss,
  alertDescriptionCss,
  alertDismissCss,
  alertIconCss,
  alertTitleCss,
  alertVariant,
} from './Alert.style';

type AlertTone = NonNullable<VariantProps<typeof alertVariant>['tone']>;

export type AlertProps = VariantProps<typeof alertVariant> &
  React.ComponentPropsWithRef<'div'> & {
    /**
     * Leading icon, e.g. an SVG. None by default.
     * Always decorative: the text carries the message.
     */
    icon?: React.ReactNode;
    /** When set, renders a dismiss button that calls this handler. */
    onDismiss?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Accessible name of the dismiss button. */
    dismissLabel?: string;
  };

export type AlertTitleProps = React.ComponentPropsWithRef<'p'>;

export type AlertDescriptionProps = React.ComponentPropsWithRef<'div'>;

const toneRoles: Record<AlertTone, 'alert' | 'status'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  danger: 'alert',
};

/**
 * A message about the page or a task. `layout="inline"` sits inside content;
 * `layout="banner"` spans its container edge to edge, e.g. at the top of a
 * page. Compose the text with `Alert.Title` and `Alert.Description`.
 */
function Alert(props: AlertProps) {
  const {
    tone,
    layout,
    icon,
    onDismiss,
    dismissLabel = 'Dismiss',
    role,
    className,
    children,
    ...restProps
  } = props;
  const resolvedTone = tone ?? 'info';

  return (
    <Box
      as="div"
      role={role ?? toneRoles[resolvedTone]}
      className={cx(alertVariant({ tone, layout }), className)}
      {...restProps}
    >
      {icon != null && (
        <Icon size="md" className={alertIconCss}>
          {icon}
        </Icon>
      )}
      <div className={alertBodyCss}>{children}</div>
      {onDismiss && (
        <Button.Root
          variant="ghost"
          size="sm"
          aria-label={dismissLabel}
          className={alertDismissCss}
          onClick={onDismiss}
        >
          <Button.Icon>
            <CloseIcon />
          </Button.Icon>
        </Button.Root>
      )}
    </Box>
  );
}

/** The alert's headline. */
function AlertTitle(props: AlertTitleProps) {
  const { className, ...restProps } = props;

  return <p className={cx(alertTitleCss, className)} {...restProps} />;
}

/** Supporting text under the title. */
function AlertDescription(props: AlertDescriptionProps) {
  const { className, ...restProps } = props;

  return <div className={cx(alertDescriptionCss, className)} {...restProps} />;
}

export { Alert as Root, AlertTitle as Title, AlertDescription as Description };
