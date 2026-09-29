import {
  CheckCircledIcon,
  Cross2Icon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';
import Box from '../../Layout/Box';
import Button from '../../Atoms/Button/Button';
import Icon from '../../Atoms/Icon/Icon';
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
     * Leading icon. Defaults to the tone's icon; pass `null` to render none.
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

const toneIcons: Record<AlertTone, React.ReactNode> = {
  info: <InfoCircledIcon />,
  success: <CheckCircledIcon />,
  warning: <ExclamationTriangleIcon />,
  danger: <CrossCircledIcon />,
};

// Warnings and errors interrupt (`alert`, assertive); info and success are
// announced politely (`status`).
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
  const leadingIcon = icon === undefined ? toneIcons[resolvedTone] : icon;

  return (
    <Box
      as="div"
      role={role ?? toneRoles[resolvedTone]}
      className={cx(alertVariant({ tone, layout }), className)}
      {...restProps}
    >
      {leadingIcon != null && (
        <Icon size="md" className={alertIconCss}>
          {leadingIcon}
        </Icon>
      )}
      <div className={alertBodyCss}>{children}</div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          aria-label={dismissLabel}
          className={alertDismissCss}
          onClick={onDismiss}
        >
          <Button.Icon>
            <Cross2Icon />
          </Button.Icon>
        </Button>
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

Alert.Title = AlertTitle;
Alert.Description = AlertDescription;

export default Alert;
