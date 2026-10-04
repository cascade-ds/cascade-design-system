import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Stack from './Stack';
import { stackVariant } from './Stack.style';

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

describe('Stack', () => {
  it('renders a div with its children by default', () => {
    render(
      <Stack aria-label="Actions" role="group">
        <span>First</span>
        <span>Second</span>
      </Stack>,
    );

    const stack = screen.getByRole('group', { name: 'Actions' });
    expect(stack.tagName).toBe('DIV');
    expect(stack).toHaveTextContent('FirstSecond');
  });

  it('renders as the element passed to `as`', () => {
    render(
      <Stack as="ul" aria-label="Items">
        <li>One</li>
        <li>Two</li>
      </Stack>,
    );

    const list = screen.getByRole('list', { name: 'Items' });
    expect(list.tagName).toBe('UL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('applies the default variant classes with no props', () => {
    render(<Stack as="ul" aria-label="Items" />);

    expectClasses(screen.getByRole('list', { name: 'Items' }), stackVariant());
  });

  it('applies the classes for the given variants', () => {
    render(
      <Stack
        as="ul"
        aria-label="Items"
        direction="row"
        gap="xl"
        align="center"
        justify="between"
        wrap
      />,
    );

    expectClasses(
      screen.getByRole('list', { name: 'Items' }),
      stackVariant({
        direction: 'row',
        gap: 'xl',
        align: 'center',
        justify: 'between',
        wrap: true,
      }),
    );
  });

  it('applies the classes for baseline, evenly and padding', () => {
    render(<Stack as="ul" aria-label="Items" align="baseline" justify="evenly" padding="md" />);

    expectClasses(
      screen.getByRole('list', { name: 'Items' }),
      stackVariant({ align: 'baseline', justify: 'evenly', padding: 'md' }),
    );
  });

  it('merges a consumer className with the variant classes', () => {
    render(<Stack as="ul" aria-label="Items" className="custom" />);

    const list = screen.getByRole('list', { name: 'Items' });
    expect(list).toHaveClass('custom');
    expectClasses(list, stackVariant());
  });

  it('forwards native event handlers', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Stack as="ul" aria-label="Items" onClick={handleClick}>
        <li>One</li>
      </Stack>,
    );

    await user.click(screen.getByRole('listitem'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
