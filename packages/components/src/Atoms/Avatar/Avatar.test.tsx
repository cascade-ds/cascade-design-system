import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Avatar from './Avatar';
import { avatarVariant } from './Avatar.style';

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

describe('Avatar', () => {
  it('is one image named after the person', () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeInTheDocument();
  });

  it('shows the initials of the first and last words without an image', () => {
    render(<Avatar name="Ada King Lovelace" />);

    expect(screen.getByRole('img', { name: 'Ada King Lovelace' })).toHaveTextContent('AL');
  });

  it('uses one initial for a single-word name', () => {
    render(<Avatar name="ada" />);

    expect(screen.getByRole('img', { name: 'ada' })).toHaveTextContent(/^A$/);
  });

  it('shows a custom fallback instead of the initials', () => {
    render(<Avatar name="Unknown user" fallback="?" />);

    expect(screen.getByRole('img', { name: 'Unknown user' })).toHaveTextContent(/^\?$/);
  });

  it('shows the fallback while the image loads', () => {
    render(<Avatar name="Ada Lovelace" src="/ada.png" />);

    // jsdom never loads images, so the image stays pending.
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
  });

  it('applies the default variant classes with no props', () => {
    render(<Avatar name="Ada Lovelace" />);

    expectClasses(screen.getByRole('img', { name: 'Ada Lovelace' }), avatarVariant());
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('applies the class for the %s size', (size) => {
    render(<Avatar name="Ada Lovelace" size={size} />);

    expectClasses(screen.getByRole('img', { name: 'Ada Lovelace' }), avatarVariant({ size }));
  });

  it('can be hidden when the name is shown next to it', () => {
    render(
      <p>
        <Avatar name="Ada Lovelace" aria-hidden /> Ada Lovelace
      </p>,
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
