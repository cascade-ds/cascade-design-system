import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Spinner from './Spinner';
import { spinnerVariant } from './Spinner.style';

afterEach(() => {
  cleanup();
});

function expectClasses(element: HTMLElement, className: string) {
  className
    .split(' ')
    .filter(Boolean)
    .forEach((name) => {
      expect(element).toHaveClass(name);
    });
}

describe('Spinner', () => {
  it('renders a status element named "Loading" by default', () => {
    render(<Spinner />);

    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toBeInTheDocument();
    expect(spinner.tagName).toBe('SPAN');
  });

  it('lets consumers override the accessible label', () => {
    render(<Spinner label="Saving changes" />);

    expect(screen.getByRole('status', { name: 'Saving changes' })).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'Loading' })).not.toBeInTheDocument();
  });

  it('applies the default variant classes with no props', () => {
    render(<Spinner />);

    expectClasses(screen.getByRole('status'), spinnerVariant());
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the class for the %s size', (size) => {
    render(<Spinner size={size} />);

    expectClasses(screen.getByRole('status'), spinnerVariant({ size }));
  });

  it('merges a consumer className with the variant classes', () => {
    render(<Spinner className="custom" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom');
    expectClasses(spinner, spinnerVariant());
  });

  it('forwards its ref to the status element', () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Spinner ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('status'));
  });
});

describe('Spinner colors', () => {
  it('applies the class for a color variant', () => {
    render(<Spinner color="success" />);

    expect(screen.getByRole('status')).toHaveClass(spinnerVariant({ color: 'success' }));
  });
});
