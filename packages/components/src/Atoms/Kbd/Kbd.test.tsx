import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Kbd from './Kbd';
import { kbdVariant } from './Kbd.style';

afterEach(() => {
  cleanup();
});

describe('Kbd', () => {
  it('renders a native kbd element', () => {
    render(<Kbd>Esc</Kbd>);

    expect(screen.getByText('Esc').tagName).toBe('KBD');
  });

  it('applies the variant classes and merges className', () => {
    render(<Kbd className="custom">Esc</Kbd>);

    const kbd = screen.getByText('Esc');
    kbdVariant()
      .split(' ')
      .filter(Boolean)
      .forEach((name) => expect(kbd).toHaveClass(name));
    expect(kbd).toHaveClass('custom');
  });

  it('passes native attributes such as title', () => {
    render(<Kbd title="Command">⌘</Kbd>);

    expect(screen.getByTitle('Command')).toHaveTextContent('⌘');
  });
});
