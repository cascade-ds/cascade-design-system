import Box from '@/Layout/Box';
import Icon from '@/Atoms/Icon/Icon';
import type { IconProps } from '@/Atoms/Icon/Icon';
import { buttonIconCss, buttonVariant } from './Button.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type ButtonProps = VariantProps<typeof buttonVariant> &
  React.ComponentPropsWithRef<'button'>;

export type ButtonIconProps = Omit<IconProps, 'size' | 'label'>;

function Button(props: ButtonProps) {
  const { size, variant, type = 'button', className, children, ...restProps } = props;
  const buttonClassName = cx(buttonVariant({ size, variant }), className);

  return (
    <Box as="button" type={type} className={buttonClassName} {...restProps}>
      {children}
    </Box>
  );
}

/**
 * An icon inside a Button, sized by the Button's `size`. Place it before or
 * after the label. Always decorative: the Button's text (or `aria-label` on an
 * icon-only Button) provides the accessible name.
 */
function ButtonIcon(props: ButtonIconProps) {
  const { className, ...restProps } = props;

  return <Icon size={null} className={cx(buttonIconCss, className)} {...restProps} />;
}

Button.Icon = ButtonIcon;

export default Button;
