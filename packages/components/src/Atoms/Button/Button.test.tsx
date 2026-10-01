import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlusIcon } from '@radix-ui/react-icons';
import Button from './Button';
import { buttonIconCss, buttonVariant } from './Button.style';

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

describe('Button', () => {
  it('renders its children as a button', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: 'Click me' })).toHaveAttribute('type', 'button');
  });

  it('lets consumers opt into type="submit"', () => {
    render(<Button type="submit">Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'submit');
  });

  it('applies the default variant classes with no props', () => {
    render(<Button>Click me</Button>);

    expectClasses(screen.getByRole('button', { name: 'Click me' }), buttonVariant());
  });

  it.each(['primary', 'secondary', 'success', 'outline', 'danger', 'ghost', 'link'] as const)(
    'applies the class for the %s variant',
    (variant) => {
      render(<Button variant={variant}>Click me</Button>);

      expectClasses(screen.getByRole('button', { name: 'Click me' }), buttonVariant({ variant }));
    },
  );

  it.each(['sm', 'md', 'lg'] as const)('applies the class for the %s size', (size) => {
    render(<Button size={size}>Click me</Button>);

    expectClasses(screen.getByRole('button', { name: 'Click me' }), buttonVariant({ size }));
  });

  it('renders a decorative Button.Icon without changing the accessible name', () => {
    render(
      <Button>
        <Button.Icon>
          <PlusIcon />
        </Button.Icon>
        Add item
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Add item' });
    const icon = button.querySelector('svg')!.parentElement!;
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass(buttonIconCss);
  });

  it('names an icon-only button through aria-label', () => {
    render(
      <Button aria-label="Add item">
        <Button.Icon>
          <PlusIcon />
        </Button.Icon>
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('merges a consumer className with the variant classes', () => {
    render(<Button className="custom">Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('custom');
    expectClasses(button, buttonVariant());
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is reachable by keyboard and activates with Enter', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Click me' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards its ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Click me</Button>);

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Click me' }));
  });
});
