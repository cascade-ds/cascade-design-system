import type { ReactNode } from 'react';
import { MotionConfig, type Transition } from 'motion/react';
import { motion } from '@cascade-ds/styles/motion';

// Durations are seconds and easings cubic-bezier arrays, generated from the
// `semantic.motion.*` tokens, because Motion can't read CSS custom properties.
const defaultTransition: Transition = {
  duration: motion.duration.normal,
  ease: motion.easing.standard,
};

export type MotionProviderProps = {
  children: ReactNode;
};

/**
 * Opt-in Motion setup. Animations inside default to the token timing, and
 * `reducedMotion="user"` drops transform/layout animations when the OS asks
 * for reduced motion (opacity and color still fade).
 *
 * Lives in the `@cascade-ds/components/motion` entry so apps that don't
 * animate never need `motion` installed.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user" transition={defaultTransition}>
      {children}
    </MotionConfig>
  );
}
