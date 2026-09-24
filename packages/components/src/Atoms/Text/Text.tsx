import Box from '@/Layout/Box';
import type { BoxProps } from '@/Layout/Box/Box';
import { textVariant } from './Text.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type TextElement =
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'strong'
  | 'em'
  | 'small'
  | 'figcaption'
  | 'legend'
  | 'li'
  | 'dt'
  | 'dd'
  | 'blockquote'
  | 'time'
  | 'abbr';

export type TextProps<TElement extends TextElement = 'p'> = VariantProps<typeof textVariant> & {
  /**
   * Element to render. Defaults to `p` for the `body` variant and `span` for
   * `caption`, since captions usually sit inline next to other content.
   */
  as?: TElement;
} & Omit<React.ComponentPropsWithRef<TElement>, 'as' | 'color'>;

const defaultElementByVariant = {
  body: 'p',
  caption: 'span',
} as const;

function Text<TElement extends TextElement = 'p'>(props: TextProps<TElement>) {
  const { as, variant, size, weight, color, className, children, ...restProps } = props;
  const element = as ?? defaultElementByVariant[variant ?? 'body'];
  const textClassName = cx(textVariant({ variant, size, weight, color }), className);

  return (
    <Box {...({ ...restProps, as: element, className: textClassName } as BoxProps<TElement>)}>
      {children}
    </Box>
  );
}

export default Text;
