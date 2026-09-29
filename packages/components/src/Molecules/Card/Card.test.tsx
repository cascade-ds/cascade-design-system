import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Card from './Card';
import {
  cardBodyCss,
  cardFooterCss,
  cardHeaderCss,
  cardSubtitleCss,
  cardTitleCss,
  cardVariant,
} from './Card.style';

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

describe('Card', () => {
  it('renders a div with the default variant classes', () => {
    render(<Card>Content</Card>);

    const card = screen.getByText('Content');
    expect(card.tagName).toBe('DIV');
    expectClasses(card, cardVariant());
  });

  it.each(['article', 'section', 'li'] as const)('renders as %s', (as) => {
    render(
      as === 'li' ? (
        <ul>
          <Card as={as}>Content</Card>
        </ul>
      ) : (
        <Card as={as}>Content</Card>
      ),
    );

    expect(screen.getByText('Content').tagName).toBe(as.toUpperCase());
  });

  it('exposes a section named by its title as a region', () => {
    render(
      <Card as="section" aria-labelledby="revenue-title">
        <Card.Header>
          <Card.Title id="revenue-title">Revenue</Card.Title>
        </Card.Header>
      </Card>,
    );

    expect(screen.getByRole('region', { name: 'Revenue' })).toBeInTheDocument();
  });

  it('applies the interactive class', () => {
    render(<Card interactive>Content</Card>);

    expectClasses(screen.getByText('Content'), cardVariant({ interactive: true }));
  });

  it('merges a consumer className and forwards its ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} className="custom">
        Content
      </Card>,
    );

    const card = screen.getByText('Content');
    expect(card).toHaveClass('custom');
    expectClasses(card, cardVariant());
    expect(ref.current).toBe(card);
  });

  it('renders its parts with their styles and semantics', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Revenue</Card.Title>
          <Card.Subtitle>Last 30 days</Card.Subtitle>
        </Card.Header>
        <Card.Body>Chart</Card.Body>
        <Card.Footer>Actions</Card.Footer>
      </Card>,
    );

    const title = screen.getByRole('heading', { name: 'Revenue', level: 3 });
    expect(title).toHaveClass(cardTitleCss);
    expect(title.parentElement).toHaveClass(cardHeaderCss);
    expect(screen.getByText('Last 30 days').tagName).toBe('P');
    expect(screen.getByText('Last 30 days')).toHaveClass(cardSubtitleCss);
    expect(screen.getByText('Chart')).toHaveClass(cardBodyCss);
    expect(screen.getByText('Actions')).toHaveClass(cardFooterCss);
  });

  it.each(['h2', 'h4', 'h6'] as const)('renders the title as %s', (as) => {
    render(<Card.Title as={as}>Revenue</Card.Title>);

    expect(
      screen.getByRole('heading', { name: 'Revenue', level: Number(as.slice(1)) }),
    ).toBeInTheDocument();
  });

  it('keeps actions in the footer interactive', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Card>
        <Card.Footer>
          <button type="button" onClick={handleClick}>
            View report
          </button>
        </Card.Footer>
      </Card>,
    );

    await user.click(screen.getByRole('button', { name: 'View report' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
