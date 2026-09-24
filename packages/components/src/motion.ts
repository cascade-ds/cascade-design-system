// `@cascade-ds/components/motion`: everything that depends on the optional
// `motion` peer. Keep it out of `index.ts` so the main entry never imports it.
export { MotionProvider } from './MotionProvider';
export type { MotionProviderProps } from './MotionProvider';
