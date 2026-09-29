import '@testing-library/jest-dom/vitest';
import { useState } from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Pagination from './Pagination';
import { paginationItemVariant } from './Pagination.style';

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

function visibleItems() {
  return within(screen.getByRole('list'))
    .getAllByRole('listitem', { hidden: true })
    .slice(1, -1)
    .map((item) => item.textContent);
}

describe('Pagination', () => {
  it('renders a navigation landmark named Pagination', () => {
    render(<Pagination page={1} pageCount={5} />);

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('shows every page when they fit', () => {
    render(<Pagination page={1} pageCount={5} />);

    expect(visibleItems()).toEqual(['1', '2', '3', '4', '5']);
  });

  it('collapses distant pages into ellipses around the current page', () => {
    const { rerender } = render(<Pagination page={1} pageCount={20} />);
    expect(visibleItems()).toEqual(['1', '2', '3', '4', '5', '…', '20']);

    rerender(<Pagination page={10} pageCount={20} />);
    expect(visibleItems()).toEqual(['1', '…', '9', '10', '11', '…', '20']);

    rerender(<Pagination page={20} pageCount={20} />);
    expect(visibleItems()).toEqual(['1', '…', '16', '17', '18', '19', '20']);
  });

  it('shows more siblings when asked', () => {
    render(<Pagination page={10} pageCount={20} siblingCount={2} />);

    expect(visibleItems()).toEqual(['1', '…', '8', '9', '10', '11', '12', '…', '20']);
  });

  it('marks the current page', () => {
    render(<Pagination page={3} pageCount={5} />);

    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 2' })).not.toHaveAttribute('aria-current');
  });

  it('hides the ellipses from assistive technology', () => {
    render(<Pagination page={1} pageCount={20} />);

    expect(screen.queryByText('…')).toHaveAttribute('aria-hidden', 'true');
  });

  it('disables previous on the first page and next on the last', () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();

    rerender(<Pagination page={5} pageCount={5} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('reports the page to go to', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    function Controlled() {
      const [page, setPage] = useState(2);
      return (
        <Pagination
          page={page}
          pageCount={5}
          onPageChange={(next) => {
            handlePageChange(next);
            setPage(next);
          }}
        />
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(handlePageChange).toHaveBeenLastCalledWith(4);
    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(handlePageChange).toHaveBeenLastCalledWith(5);

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(handlePageChange).toHaveBeenLastCalledWith(4);
  });

  it('does not report a click on the current page', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    render(<Pagination page={2} pageCount={5} onPageChange={handlePageChange} />);

    await user.click(screen.getByRole('button', { name: 'Page 2' }));

    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it('renders links when getHref is set', () => {
    render(<Pagination page={1} pageCount={5} getHref={(page) => `?page=${page}`} />);

    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '?page=2');
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '?page=2');

    const previous = screen.getByLabelText('Previous page');
    expect(previous).not.toHaveAttribute('href');
    expect(previous).toHaveAttribute('aria-disabled', 'true');
  });

  it('uses custom labels', () => {
    render(
      <Pagination
        page={2}
        pageCount={5}
        aria-label="Resultados"
        previousLabel="Anterior"
        nextLabel="Próxima"
        getPageLabel={(page) => `Página ${page}`}
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Resultados' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Próxima' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 3' })).toBeInTheDocument();
  });

  it.each(['sm', 'md'] as const)('applies the class for the %s size', (size) => {
    render(<Pagination page={1} pageCount={5} size={size} />);

    expectClasses(screen.getByRole('button', { name: 'Page 1' }), paginationItemVariant({ size }));
  });
});
