import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Grid from './Grid';
import { gridVariant } from './Grid.style';

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

describe('Grid', () => {
  it('renders a div with its children by default', () => {
    render(
      <Grid aria-label="Cards" role="group">
        <span>First</span>
        <span>Second</span>
      </Grid>,
    );

    const grid = screen.getByRole('group', { name: 'Cards' });
    expect(grid.tagName).toBe('DIV');
    expect(grid).toHaveTextContent('FirstSecond');
  });

  it('renders as the element passed to `as`', () => {
    render(
      <Grid as="ul" aria-label="Items">
        <li>One</li>
        <li>Two</li>
      </Grid>,
    );

    const list = screen.getByRole('list', { name: 'Items' });
    expect(list.tagName).toBe('UL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('applies the default variant classes with no props', () => {
    render(<Grid as="ul" aria-label="Items" />);

    expectClasses(screen.getByRole('list', { name: 'Items' }), gridVariant());
  });

  it.each([1, 2, 3, 4, 6, 12] as const)('applies the class for %i columns', (columns) => {
    render(<Grid as="ul" aria-label="Items" columns={columns} />);

    expectClasses(screen.getByRole('list', { name: 'Items' }), gridVariant({ columns }));
  });

  it('applies the classes for the given gap and align', () => {
    render(<Grid as="ul" aria-label="Items" columns={3} gap="xl" align="center" />);

    expectClasses(
      screen.getByRole('list', { name: 'Items' }),
      gridVariant({ columns: 3, gap: 'xl', align: 'center' }),
    );
  });

  it('applies the classes for the given justify and padding', () => {
    render(<Grid as="ul" aria-label="Items" justify="center" padding="lg" />);

    expectClasses(
      screen.getByRole('list', { name: 'Items' }),
      gridVariant({ justify: 'center', padding: 'lg' }),
    );
  });

  it('sizes auto columns from minChildWidth', () => {
    render(<Grid as="ul" aria-label="Items" columns="auto" minChildWidth="12rem" />);

    const list = screen.getByRole('list', { name: 'Items' });
    expectClasses(list, gridVariant({ columns: 'auto' }));
    expect(list.style.getPropertyValue('--cascade-grid-min-child-width')).toBe('12rem');
  });

  it('keeps a consumer style next to minChildWidth', () => {
    render(<Grid as="ul" aria-label="Items" minChildWidth="8rem" style={{ color: 'red' }} />);

    expect(screen.getByRole('list', { name: 'Items' })).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('merges a consumer className with the variant classes', () => {
    render(<Grid as="ul" aria-label="Items" className="custom" />);

    const list = screen.getByRole('list', { name: 'Items' });
    expect(list).toHaveClass('custom');
    expectClasses(list, gridVariant());
  });

  it('forwards native event handlers', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Grid as="ul" aria-label="Items" onClick={handleClick}>
        <li>One</li>
      </Grid>,
    );

    await user.click(screen.getByRole('listitem'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
