import Box from '@/Layout/Box';
import type { BoxProps } from '@/Layout/Box/Box';
import type { LayoutElement } from '@/types/LayoutConstants';
import { gridVariant } from './Grid.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type GridProps<TElement extends LayoutElement = 'div'> = VariantProps<typeof gridVariant> & {
  as?: TElement;
} & Omit<React.ComponentPropsWithRef<TElement>, 'as'>;

function Grid<TElement extends LayoutElement = 'div'>(props: GridProps<TElement>) {
  const { as, columns, gap, align, className, children, ...restProps } = props;
  const gridClassName = cx(gridVariant({ columns, gap, align }), className);

  return (
    <Box {...({ ...restProps, as, className: gridClassName } as BoxProps<TElement>)}>
      {children}
    </Box>
  );
}

export default Grid;
