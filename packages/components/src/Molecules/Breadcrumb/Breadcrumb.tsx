import Box from '../../Layout/Box';
import type { BoxProps } from '../../Layout/Box/Box';
import { cx } from '@linaria/core';
import type { VariantProps } from 'class-variance-authority';
import {
  breadcrumbCurrentCss,
  breadcrumbItemCss,
  breadcrumbLinkCss,
  breadcrumbListCss,
  breadcrumbSeparatorCss,
  breadcrumbVariant,
} from './Breadcrumb.style';

export type BreadcrumbProps = VariantProps<typeof breadcrumbVariant> &
  Omit<React.ComponentPropsWithRef<'nav'>, 'color'>;

export type BreadcrumbItemProps<TElement extends React.ElementType = 'a'> = {
  /**
   * Element or component for the link, e.g. your router's link. Defaults to
   * `a`. Ignored on the `current` item, which isn't a link.
   */
  as?: TElement;
  /** Marks the page the user is on (`aria-current="page"`). Put it on the last item. */
  current?: boolean;
} & Omit<React.ComponentPropsWithRef<TElement>, 'as'>;

/**
 * The path from the site's root to the current page. Renders a `nav` named
 * "Breadcrumb" (override with `aria-label`) around an ordered list of
 * `Breadcrumb.Item`s.
 */
function Breadcrumb(props: BreadcrumbProps) {
  const {
    'aria-label': ariaLabel = 'Breadcrumb',
    color,
    className,
    children,
    ...restProps
  } = props;

  return (
    <nav
      aria-label={ariaLabel}
      className={cx(breadcrumbVariant({ color }), className)}
      {...restProps}
    >
      <ol className={breadcrumbListCss}>{children}</ol>
    </nav>
  );
}

/** One step of the path: a link, or plain text for the `current` page. */
function BreadcrumbItem<TElement extends React.ElementType = 'a'>(
  props: BreadcrumbItemProps<TElement>,
) {
  const { as, current = false, className, children, ...restProps } = props;

  return (
    <li className={breadcrumbItemCss}>
      <svg className={breadcrumbSeparatorCss} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {current ? (
        <span aria-current="page" className={cx(breadcrumbCurrentCss, className)}>
          {children}
        </span>
      ) : (
        <Box
          {...({
            ...restProps,
            as: as ?? 'a',
            className: cx(breadcrumbLinkCss, className),
          } as unknown as BoxProps<TElement>)}
        >
          {children}
        </Box>
      )}
    </li>
  );
}

Breadcrumb.Item = BreadcrumbItem;

export default Breadcrumb;
