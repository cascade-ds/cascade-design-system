import '@testing-library/jest-dom/vitest';
import { useContext } from 'react';
import { MotionConfigContext } from 'motion/react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { motion } from '@cascade-ds/styles/motion';
import { MotionProvider } from './MotionProvider';

afterEach(() => {
  cleanup();
});

function MotionConfigConsumer() {
  const { transition, reducedMotion } = useContext(MotionConfigContext);

  return <output>{JSON.stringify({ transition, reducedMotion })}</output>;
}

describe('MotionProvider', () => {
  it('renders its children', () => {
    render(
      <MotionProvider>
        <p>Content</p>
      </MotionProvider>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('defaults Motion transitions to the motion tokens', () => {
    render(
      <MotionProvider>
        <MotionConfigConsumer />
      </MotionProvider>,
    );

    const config = JSON.parse(screen.getByRole('status').textContent!);
    expect(config.transition).toEqual({
      duration: motion.duration.normal,
      ease: motion.easing.standard,
    });
  });

  it('follows the OS reduced-motion preference', () => {
    render(
      <MotionProvider>
        <MotionConfigConsumer />
      </MotionProvider>,
    );

    const config = JSON.parse(screen.getByRole('status').textContent!);
    expect(config.reducedMotion).toBe('user');
  });
});
