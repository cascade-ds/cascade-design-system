import Box from '../Box';
import type { BoxProps } from '../Box/Box';
import type { LayoutElement } from '../../types/LayoutConstants';
import { containerVariant } from './Container.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type ContainerProps<TElement extends LayoutElement = 'div'> = VariantProps<
  typeof containerVariant
> & {
  as?: TElement;
} & Omit<React.ComponentPropsWithRef<TElement>, 'as'>;

function Container<TElement extends LayoutElement = 'div'>(props: ContainerProps<TElement>) {
  const { as, size, className, children, ...restProps } = props;
  const containerClassName = cx(containerVariant({ size }), className);

  return (
    <Box {...({ ...restProps, as, className: containerClassName } as BoxProps<TElement>)}>
      {children}
    </Box>
  );
}

export default Container;
