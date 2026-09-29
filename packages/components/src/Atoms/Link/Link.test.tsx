import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Link from './Link';
import { linkVariant } from './Link.style';

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

describe('Link', () => {
  it('renders an anchor with its href', () => {
    render(<Link href="/pricing">Pricing</Link>);

    const link = screen.getByRole('link', { name: 'Pricing' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/pricing');
  });

  it('applies the default variant classes with no props', () => {
    render(<Link href="/pricing">Pricing</Link>);

    expectClasses(screen.getByRole('link', { name: 'Pricing' }), linkVariant());
  });

  it.each(['inline', 'standalone'] as const)('applies the class for the %s variant', (variant) => {
    render(
      <Link href="/pricing" variant={variant}>
        Pricing
      </Link>,
    );

    expectClasses(screen.getByRole('link', { name: 'Pricing' }), linkVariant({ variant }));
  });

  it('opens external links in a new tab and says so', () => {
    render(
      <Link href="https://example.com" external>
        Docs
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Docs (opens in a new tab)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('keeps internal links in the same tab', () => {
    render(<Link href="/pricing">Pricing</Link>);

    const link = screen.getByRole('link', { name: 'Pricing' });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('renders a custom component through `as`', () => {
    function RouterLink(props: { to: string } & React.ComponentPropsWithoutRef<'a'>) {
      const { to, children, ...rest } = props;
      return (
        <a href={to} data-router="" {...rest}>
          {children}
        </a>
      );
    }

    render(
      <Link as={RouterLink} to="/settings" className="custom">
        Settings
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveClass('custom');
    expectClasses(link, linkVariant());
  });

  it('fires onClick', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Link href="/pricing" onClick={handleClick}>
        Pricing
      </Link>,
    );

    await user.click(screen.getByRole('link', { name: 'Pricing' }));

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
