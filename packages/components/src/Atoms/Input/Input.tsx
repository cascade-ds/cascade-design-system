import Box from '@/Layout/Box';
import { inputSlotVariant, inputVariant, inputWrapperVariant } from './Input.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type InputProps = VariantProps<typeof inputVariant> &
  Omit<React.ComponentPropsWithRef<'input'>, 'size' | 'children'> & {
    /**
     * Content before the text, sized as an icon (e.g. a search icon). Clicks
     * on it focus the input; a button placed here stays clickable.
     */
    start?: React.ReactNode;
    /** Content after the text, sized as an icon (e.g. a clear button). */
    end?: React.ReactNode;
  };

/**
 * A single-line text input. Props other than `start`, `end` and `className`
 * go to the `<input>`, and `ref` points to it. Inside a `FormField`, use
 * `FormField.Input`.
 */
function Input(props: InputProps) {
  const { size, start, end, className, ...restProps } = props;
  const hasSlots = start != null || end != null;

  const input = (
    <Box
      as="input"
      className={cx(inputVariant({ size }), !hasSlots && className)}
      data-start={start != null ? '' : undefined}
      data-end={end != null ? '' : undefined}
      {...restProps}
    />
  );

  if (!hasSlots) {
    return input;
  }

  // With slots, `className` goes on the wrapper so it sizes the whole field.
  return (
    <Box as="span" className={cx(inputWrapperVariant({ size }), className)}>
      {input}
      {start != null && <span className={inputSlotVariant({ side: 'start' })}>{start}</span>}
      {end != null && <span className={inputSlotVariant({ side: 'end' })}>{end}</span>}
    </Box>
  );
}

export default Input;
