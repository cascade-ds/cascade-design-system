import Box from '#/Layout/Box';
import { badgeVariant } from './Badge.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type BadgeProps = VariantProps<typeof badgeVariant> & React.ComponentPropsWithRef<'span'>;

function Badge(props: BadgeProps) {
  const { tone, size, className, children, ...restProps } = props;
  const badgeClassName = cx(badgeVariant({ tone, size }), className);

  return (
    <Box as="span" className={badgeClassName} {...restProps}>
      {children}
    </Box>
  );
}

export default Badge;
