import Box from '#/Layout/Box';
import type { BoxProps } from '#/Layout/Box/Box';
import type { LayoutElement } from '#/types/LayoutConstants';
import { stackVariant } from './Stack.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type StackProps<TElement extends LayoutElement = 'div'> = VariantProps<
  typeof stackVariant
> & {
  as?: TElement;
} & Omit<React.ComponentPropsWithRef<TElement>, 'as'>;

function Stack<TElement extends LayoutElement = 'div'>(props: StackProps<TElement>) {
  const { as, direction, gap, align, justify, wrap, className, children, ...restProps } = props;
  const stackClassName = cx(stackVariant({ direction, gap, align, justify, wrap }), className);

  return (
    <Box {...({ ...restProps, as, className: stackClassName } as BoxProps<TElement>)}>
      {children}
    </Box>
  );
}

export default Stack;
