import Box from '../../Layout/Box';
import { headingVariant } from './Heading.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingSize = NonNullable<VariantProps<typeof headingVariant>['size']>;

export type HeadingProps = VariantProps<typeof headingVariant> & {
  /** Semantic level; renders the matching `h1`–`h6` element. */
  level?: HeadingLevel;
} & Omit<React.ComponentPropsWithRef<'h2'>, 'color'>;

// Visual size used when `size` is omitted.
const defaultSizeByLevel: Record<HeadingLevel, HeadingSize> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

function Heading(props: HeadingProps) {
  const { level = 2, size, color, className, children, ...restProps } = props;
  const headingClassName = cx(
    headingVariant({ size: size ?? defaultSizeByLevel[level], color }),
    className,
  );

  return (
    <Box as={`h${level}`} className={headingClassName} {...restProps}>
      {children}
    </Box>
  );
}

export default Heading;
