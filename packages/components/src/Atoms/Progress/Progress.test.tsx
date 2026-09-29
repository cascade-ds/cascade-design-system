import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Progress from './Progress';
import { progressVariant } from './Progress.style';

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

describe('Progress', () => {
  it('renders a progressbar named by its label', () => {
    render(<Progress value={40} label="Uploading" />);

    const bar = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('can be named with aria-label instead of a visible label', () => {
    render(<Progress value={40} aria-label="Storage used" />);

    expect(screen.getByRole('progressbar', { name: 'Storage used' })).toBeInTheDocument();
  });

  it('shows the formatted value only when asked', () => {
    const { rerender } = render(<Progress value={40} label="Uploading" />);
    expect(screen.queryByText('40%')).not.toBeInTheDocument();

    rerender(<Progress value={40} label="Uploading" showValue />);
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('respects min and max', () => {
    render(<Progress value={3} min={0} max={8} label="Files" />);

    const bar = screen.getByRole('progressbar', { name: 'Files' });
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemax', '8');
  });

  it('uses getAriaValueText for the spoken value', () => {
    render(
      <Progress
        value={3}
        max={8}
        label="Files"
        getAriaValueText={(_, value) => `${value} of 8 files`}
      />,
    );

    expect(screen.getByRole('progressbar', { name: 'Files' })).toHaveAttribute(
      'aria-valuetext',
      '3 of 8 files',
    );
  });

  it('is indeterminate while value is null', () => {
    render(<Progress value={null} label="Preparing" />);

    const bar = screen.getByRole('progressbar', { name: 'Preparing' });
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-indeterminate');
  });

  it('applies the default variant classes with no props', () => {
    render(<Progress value={40} label="Uploading" />);

    expectClasses(screen.getByRole('progressbar', { name: 'Uploading' }), progressVariant());
  });

  it.each(['sm', 'md'] as const)('applies the class for the %s size', (size) => {
    render(<Progress value={40} label="Uploading" size={size} />);

    expectClasses(
      screen.getByRole('progressbar', { name: 'Uploading' }),
      progressVariant({ size }),
    );
  });

  it.each(['default', 'success', 'danger'] as const)(
    'applies the class for the %s tone',
    (tone) => {
      render(<Progress value={40} label="Uploading" tone={tone} />);

      expectClasses(
        screen.getByRole('progressbar', { name: 'Uploading' }),
        progressVariant({ tone }),
      );
    },
  );
});
