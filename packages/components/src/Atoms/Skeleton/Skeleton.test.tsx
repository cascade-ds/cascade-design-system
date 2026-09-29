import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Skeleton from './Skeleton';
import { skeletonVariant } from './Skeleton.style';

afterEach(() => {
  cleanup();
});

function expectClasses(element: Element | null, className: string) {
  className
    .split(' ')
    .filter(Boolean)
    .forEach((name) => {
      expect(element).toHaveClass(name);
    });
}

// The skeleton is aria-hidden, so read it from the render container instead of by role.
function renderSkeleton(ui: React.ReactElement) {
  const { container } = render(ui);
  return container.firstElementChild as HTMLElement;
}

describe('Skeleton', () => {
  it('renders a decorative span hidden from assistive technology', () => {
    const skeleton = renderSkeleton(<Skeleton />);

    expect(skeleton.tagName).toBe('SPAN');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toBeEmptyDOMElement();
  });

  it('applies the default variant classes with no props', () => {
    expectClasses(renderSkeleton(<Skeleton />), skeletonVariant());
  });

  it.each(['gray', 'primary', 'secondary'] as const)(
    'applies the class for the %s color',
    (color) => {
      expectClasses(renderSkeleton(<Skeleton color={color} />), skeletonVariant({ color }));
    },
  );

  it.each(['rect', 'text', 'circle'] as const)('applies the class for the %s shape', (shape) => {
    expectClasses(renderSkeleton(<Skeleton shape={shape} />), skeletonVariant({ shape }));
  });

  it('sizes itself from numeric width and height as pixels', () => {
    const skeleton = renderSkeleton(<Skeleton width={120} height={16} />);

    expect(skeleton).toHaveStyle({ width: '120px', height: '16px' });
  });

  it('accepts CSS length strings for width and height', () => {
    const skeleton = renderSkeleton(<Skeleton width="60%" height="50%" />);

    expect(skeleton).toHaveStyle({ width: '60%', height: '50%' });
  });

  it('mirrors a lone dimension on a circle so it stays round', () => {
    const skeleton = renderSkeleton(<Skeleton shape="circle" height={32} />);

    expect(skeleton).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('lets a consumer style override width and height', () => {
    const skeleton = renderSkeleton(<Skeleton width={120} style={{ width: '50%' }} />);

    expect(skeleton).toHaveStyle({ width: '50%' });
  });

  it('merges a consumer className with the variant classes', () => {
    const skeleton = renderSkeleton(<Skeleton className="custom" />);

    expect(skeleton).toHaveClass('custom');
    expectClasses(skeleton, skeletonVariant());
  });

  it('forwards its ref to the placeholder element', () => {
    const ref = createRef<HTMLSpanElement>();

    const skeleton = renderSkeleton(<Skeleton ref={ref} />);

    expect(ref.current).toBe(skeleton);
  });
});
