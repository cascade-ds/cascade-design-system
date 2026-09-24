import Box from '@/Layout/Box';
import { iconVariant } from './Icon.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type IconProps = VariantProps<typeof iconVariant> &
  Omit<React.ComponentPropsWithRef<'span'>, 'color' | 'children'> & {
    /** The SVG to render. It is stretched to fill the icon box. */
    children: React.ReactNode;
    /**
     * Accessible name. When set, the icon is exposed as `role="img"` with
     * this `aria-label`; when omitted, the icon is decorative and hidden from
     * assistive technology with `aria-hidden="true"`.
     */
    label?: string;
  };

function Icon(props: IconProps) {
  const { size, color, label, className, children, ...restProps } = props;
  const iconClassName = cx(iconVariant({ size, color }), className);
  const a11yProps = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };

  return (
    <Box as="span" className={iconClassName} {...a11yProps} {...restProps}>
      {children}
    </Box>
  );
}

export default Icon;
