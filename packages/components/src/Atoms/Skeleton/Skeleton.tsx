import Box from '@/Layout/Box';
import { skeletonVariant } from './Skeleton.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type SkeletonProps = VariantProps<typeof skeletonVariant> &
  Omit<React.ComponentPropsWithRef<'span'>, 'color' | 'children'> & {
    /**
     * Width of the placeholder. Numbers are pixels, strings are any CSS
     * length (e.g. `'60%'`). Defaults to the full width of its container
     * (`rect`, `text`) or the token size (`circle`).
     */
    width?: number | string;
    /**
     * Height of the placeholder. Numbers are pixels, strings are any CSS
     * length. Defaults to the token height for the shape. A `circle` only
     * needs one of `width` / `height`.
     */
    height?: number | string;
  };

/**
 * Decorative loading placeholder, hidden from assistive technology. Announce
 * the loading state on the surrounding region instead (e.g. `aria-busy` or a
 * `Spinner`).
 */
function Skeleton(props: SkeletonProps) {
  const { color, shape, width, height, className, style, ...restProps } = props;
  const skeletonClassName = cx(skeletonVariant({ color, shape }), className);
  // A circle given only one dimension uses it for both, so it stays round.
  const size =
    shape === 'circle' ? { width: width ?? height, height: height ?? width } : { width, height };

  return (
    <Box
      as="span"
      aria-hidden="true"
      className={skeletonClassName}
      style={{ ...size, ...style }}
      {...restProps}
    />
  );
}

export default Skeleton;
