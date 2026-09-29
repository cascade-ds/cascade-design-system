import type { VariantProps } from 'class-variance-authority';
import {
  paginationEllipsisVariant,
  paginationItemVariant,
  paginationListCss,
} from './Pagination.style';

export type PaginationProps = VariantProps<typeof paginationItemVariant> &
  Omit<React.ComponentPropsWithRef<'nav'>, 'children' | 'onChange'> & {
    /** The current page, starting at 1. */
    page: number;
    /** How many pages there are. */
    pageCount: number;
    /** Called with the page to go to. Pages are buttons unless `getHref` is set. */
    onPageChange?: (page: number) => void;
    /**
     * Makes every page a link to the URL it returns, for pages the router or
     * server renders. `onPageChange` still fires on click.
     */
    getHref?: (page: number) => string;
    /** Pages shown on each side of the current one. @default 1 */
    siblingCount?: number;
    /** Name of the previous-page control. @default "Previous page" */
    previousLabel?: string;
    /** Name of the next-page control. @default "Next page" */
    nextLabel?: string;
    /** Name of each page control. @default (page) => `Page ${page}` */
    getPageLabel?: (page: number) => string;
  };

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/**
 * The pages to show: the first and last, the current one with its siblings,
 * and an ellipsis for each gap. The count stays the same as the current page
 * moves, so the controls don't jump around.
 */
function getPageItems(page: number, pageCount: number, siblingCount: number): PageItem[] {
  // first + last + current + siblings + two ellipses
  const slots = siblingCount * 2 + 5;
  if (pageCount <= slots) {
    return range(1, pageCount);
  }

  const start = Math.max(page - siblingCount, 1);
  const end = Math.min(page + siblingCount, pageCount);
  const gapAtStart = start > 3;
  const gapAtEnd = end < pageCount - 2;
  const edgeRun = siblingCount * 2 + 3;

  if (!gapAtStart) {
    return [...range(1, edgeRun), 'ellipsis-end', pageCount];
  }
  if (!gapAtEnd) {
    return [1, 'ellipsis-start', ...range(pageCount - edgeRun + 1, pageCount)];
  }
  return [1, 'ellipsis-start', ...range(start, end), 'ellipsis-end', pageCount];
}

type PageControlProps = {
  target: number;
  label: string;
  disabled?: boolean;
  current?: boolean;
  className: string;
  getHref?: (page: number) => string;
  onPageChange?: (page: number) => void;
  children: React.ReactNode;
};

/** A button, or a link when `getHref` is set. Disabled links drop their href. */
function PageControl(props: PageControlProps) {
  const { target, label, disabled, current, className, getHref, onPageChange, children } = props;
  const commonProps = {
    className,
    'aria-label': label,
    'aria-current': current ? ('page' as const) : undefined,
  };

  if (getHref) {
    return (
      <a
        {...commonProps}
        href={disabled ? undefined : getHref(target)}
        aria-disabled={disabled || undefined}
        onClick={disabled || current ? undefined : () => onPageChange?.(target)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      {...commonProps}
      type="button"
      disabled={disabled}
      onClick={current ? undefined : () => onPageChange?.(target)}
    >
      {children}
    </button>
  );
}

const chevronPath = { previous: 'M10 4L6 8l4 4', next: 'M6 4l4 4-4 4' };

function Chevron(props: { direction: 'previous' | 'next' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={chevronPath[props.direction]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Moves between the pages of a long list or table. Renders a `nav` named
 * "Pagination" (override with `aria-label`) with previous/next controls and
 * the page numbers, collapsing distant pages into an ellipsis. It holds no
 * state: pass the current `page` and update it in `onPageChange`.
 */
function Pagination(props: PaginationProps) {
  const {
    page,
    pageCount,
    onPageChange,
    getHref,
    siblingCount = 1,
    size,
    previousLabel = 'Previous page',
    nextLabel = 'Next page',
    getPageLabel = (target: number) => `Page ${target}`,
    'aria-label': ariaLabel = 'Pagination',
    ...restProps
  } = props;
  const itemClassName = paginationItemVariant({ size });
  const controlProps = { className: itemClassName, getHref, onPageChange };

  return (
    <nav aria-label={ariaLabel} {...restProps}>
      <ul className={paginationListCss}>
        <li>
          <PageControl
            {...controlProps}
            target={page - 1}
            label={previousLabel}
            disabled={page <= 1}
          >
            <Chevron direction="previous" />
          </PageControl>
        </li>
        {getPageItems(page, pageCount, siblingCount).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <PageControl
                {...controlProps}
                target={item}
                label={getPageLabel(item)}
                current={item === page}
              >
                {item}
              </PageControl>
            </li>
          ) : (
            <li key={item} aria-hidden="true" className={paginationEllipsisVariant({ size })}>
              …
            </li>
          ),
        )}
        <li>
          <PageControl
            {...controlProps}
            target={page + 1}
            label={nextLabel}
            disabled={page >= pageCount}
          >
            <Chevron direction="next" />
          </PageControl>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
