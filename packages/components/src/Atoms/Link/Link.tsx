import Box from '../../Layout/Box';
import type { BoxProps } from '../../Layout/Box/Box';
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden';
import { linkExternalIconCss, linkVariant } from './Link.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type LinkProps<TElement extends React.ElementType = 'a'> = VariantProps<
  typeof linkVariant
> & {
  /**
   * Element or component to render, e.g. your router's link. Defaults to `a`.
   * It receives the link's props, including `href` and `className`.
   */
  as?: TElement;
  /**
   * Opens the link in a new tab (`target="_blank"`, `rel="noopener noreferrer"`),
   * shows an arrow after the text, and tells screen reader users it opens a
   * new tab.
   */
  external?: boolean;
} & Omit<React.ComponentPropsWithRef<TElement>, 'as'>;

/** Navigates to another page or place. Typography comes from the surrounding text. */
function Link<TElement extends React.ElementType = 'a'>(props: LinkProps<TElement>) {
  const { as, variant, external = false, className, children, ...restProps } = props;
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : undefined;

  return (
    <Box
      {...({
        ...externalProps,
        ...restProps,
        as: as ?? 'a',
        className: cx(linkVariant({ variant }), className),
      } as unknown as BoxProps<TElement>)}
    >
      {children}
      {external && (
        <>
          {/* A real space: it names the link "Docs (opens…)" and spaces the arrow. */}{' '}
          <VisuallyHidden>(opens in a new tab)</VisuallyHidden>
          <svg className={linkExternalIconCss} viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M4.5 2.5h5v5M9.5 2.5l-7 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      )}
    </Box>
  );
}

export default Link;
