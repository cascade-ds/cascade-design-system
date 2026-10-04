import Box from '../Box';
import type { BoxProps } from '../Box/Box';
import type { LayoutElement } from '../../types/LayoutConstants';
import { gridVariant } from './Grid.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type GridProps<TElement extends LayoutElement = 'div'> = VariantProps<typeof gridVariant> & {
  as?: TElement;
  /** Minimum column width for `columns="auto"`, any CSS length. Defaults to `16rem`. */
  minChildWidth?: string;
} & Omit<React.ComponentPropsWithRef<TElement>, 'as'>;

function Grid<TElement extends LayoutElement = 'div'>(props: GridProps<TElement>) {
  const {
    as,
    columns,
    gap,
    align,
    justify,
    padding,
    minChildWidth,
    className,
    style,
    children,
    ...restProps
  } = props;
  const gridClassName = cx(gridVariant({ columns, gap, align, justify, padding }), className);

  const gridStyle = minChildWidth
    ? ({ ...style, '--cascade-grid-min-child-width': minChildWidth } as React.CSSProperties)
    : style;

  return (
    <Box
      {...({ ...restProps, as, className: gridClassName, style: gridStyle } as BoxProps<TElement>)}
    >
      {children}
    </Box>
  );
}

export default Grid;
