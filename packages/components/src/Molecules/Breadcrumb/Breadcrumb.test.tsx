import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import * as Breadcrumb from './Breadcrumb';
import {
  breadcrumbCurrentCss,
  breadcrumbLinkCss,
  breadcrumbListCss,
  breadcrumbVariant,
} from './Breadcrumb.style';

afterEach(() => {
  cleanup();
});

function renderBreadcrumb(props: Partial<React.ComponentProps<typeof Breadcrumb>> = {}) {
  return render(
    <Breadcrumb.Root {...props}>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="/projects">Projects</Breadcrumb.Item>
      <Breadcrumb.Item current>Cascade</Breadcrumb.Item>
    </Breadcrumb.Root>,
  );
}

describe('Breadcrumb', () => {
  it('renders a navigation landmark named Breadcrumb with an ordered list', () => {
    renderBreadcrumb();

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const list = within(nav).getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(list).toHaveClass(breadcrumbListCss);
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  });

  it('takes a custom name', () => {
    renderBreadcrumb({ 'aria-label': 'You are here' });

    expect(screen.getByRole('navigation', { name: 'You are here' })).toBeInTheDocument();
  });

  it('renders the ancestors as links', () => {
    renderBreadcrumb();

    const projects = screen.getByRole('link', { name: 'Projects' });
    expect(projects).toHaveAttribute('href', '/projects');
    expect(projects).toHaveClass(breadcrumbLinkCss);
  });

  it('marks the current page and does not link it', () => {
    renderBreadcrumb();

    expect(screen.queryByRole('link', { name: 'Cascade' })).not.toBeInTheDocument();
    const current = screen.getByText('Cascade');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveClass(breadcrumbCurrentCss);
  });

  it('hides the separators from assistive technology', () => {
    renderBreadcrumb();

    const items = screen.getAllByRole('listitem');
    items.forEach((item) => {
      expect(item.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('renders a custom link component through `as`', () => {
    function RouterLink(props: { to: string } & React.ComponentPropsWithoutRef<'a'>) {
      const { to, children, ...rest } = props;
      return (
        <a href={to} data-router="" {...rest}>
          {children}
        </a>
      );
    }

    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item as={RouterLink} to="/settings">
          Settings
        </Breadcrumb.Item>
      </Breadcrumb.Root>,
    );

    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveAttribute('data-router');
  });
});

describe('Breadcrumb colors', () => {
  it('applies the class for a color variant', () => {
    renderBreadcrumb({ color: 'primary' });

    expect(screen.getByRole('navigation')).toHaveClass(breadcrumbVariant({ color: 'primary' }));
  });
});
