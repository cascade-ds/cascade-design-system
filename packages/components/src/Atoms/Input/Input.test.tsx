import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Input from './Input';
import { inputSlotVariant, inputVariant, inputWrapperVariant } from './Input.style';

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

const searchIcon = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="7" cy="7" r="4" />
  </svg>
);

describe('Input', () => {
  it('renders a bare native input', () => {
    const { container } = render(<Input aria-label="Name" />);

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input.tagName).toBe('INPUT');
    expect(container.firstChild).toBe(input);
  });

  it('applies the default variant classes with no props', () => {
    render(<Input aria-label="Name" />);

    expectClasses(screen.getByRole('textbox', { name: 'Name' }), inputVariant());
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the class for the %s size', (size) => {
    render(<Input aria-label="Name" size={size} />);

    expectClasses(screen.getByRole('textbox', { name: 'Name' }), inputVariant({ size }));
  });

  it('forwards native props and the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} type="email" placeholder="you@example.com" aria-label="Email" />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'you@example.com');
  });

  it('puts className on the input when there are no slots', () => {
    render(<Input aria-label="Name" className="custom" />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveClass('custom');
  });

  it('wraps the input and renders the start and end slots', () => {
    const { container } = render(
      <Input
        aria-label="Search"
        size="lg"
        className="custom"
        start={searchIcon}
        end={<button type="button">Clear</button>}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Search' });
    const wrapper = container.firstChild as HTMLElement;
    expectClasses(wrapper, inputWrapperVariant({ size: 'lg' }));
    expect(wrapper).toHaveClass('custom');
    expect(input).not.toHaveClass('custom');
    expect(input).toHaveAttribute('data-start');
    expect(input).toHaveAttribute('data-end');

    const clear = screen.getByRole('button', { name: 'Clear' });
    expectClasses(clear.parentElement as HTMLElement, inputSlotVariant({ side: 'end' }));
  });

  it('only marks the side that has a slot', () => {
    render(<Input aria-label="Search" start={searchIcon} />);

    const input = screen.getByRole('textbox', { name: 'Search' });
    expect(input).toHaveAttribute('data-start');
    expect(input).not.toHaveAttribute('data-end');
  });

  it('fires onChange while typing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input aria-label="Name" onChange={handleChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');

    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
  });

  it('keeps a slot button clickable', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();
    render(
      <Input
        aria-label="Search"
        end={
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        }
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(handleClear).toHaveBeenCalledOnce();
  });
});
