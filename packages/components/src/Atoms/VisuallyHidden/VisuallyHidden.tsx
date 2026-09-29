import Box from '#/Layout/Box';
import type { BoxProps } from '#/Layout/Box/Box';
import { visuallyHiddenVariant } from './VisuallyHidden.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type VisuallyHiddenProps<TElement extends React.ElementType = 'span'> = VariantProps<
  typeof visuallyHiddenVariant
> & {
  /** Element to render. Defaults to `span`. */
  as?: TElement;
} & Omit<React.ComponentPropsWithRef<TElement>, 'as'>;

function VisuallyHidden<TElement extends React.ElementType = 'span'>(
  props: VisuallyHiddenProps<TElement>,
) {
  const { as, focusable, className, children, ...restProps } = props;
  const visuallyHiddenClassName = cx(visuallyHiddenVariant({ focusable }), className);

  return (
    <Box
      {...({
        ...restProps,
        as: as ?? 'span',
        className: visuallyHiddenClassName,
      } as unknown as BoxProps<TElement>)}
    >
      {children}
    </Box>
  );
}

export default VisuallyHidden;
