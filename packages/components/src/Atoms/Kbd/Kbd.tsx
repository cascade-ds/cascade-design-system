import Box from '@/Layout/Box';
import { kbdVariant } from './Kbd.style';
import { cx } from '@linaria/core';

export type KbdProps = React.ComponentPropsWithRef<'kbd'>;

/**
 * A keyboard key, as a native `<kbd>`. Render one per key and put the
 * separator between them: `<Kbd>⌘</Kbd> <Kbd>K</Kbd>`. For a symbol key, set
 * `title` or `aria-label` to its name (e.g. "Command") so it isn't read as a
 * bare symbol.
 */
function Kbd(props: KbdProps) {
  const { className, ...restProps } = props;

  return <Box as="kbd" className={cx(kbdVariant(), className)} {...restProps} />;
}

export default Kbd;
