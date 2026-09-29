import { useEffect, useImperativeHandle, useRef } from 'react';
import Box from '../../Layout/Box';
import { checkboxControlCss, checkboxVariant } from './Checkbox.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type CheckboxProps = VariantProps<typeof checkboxVariant> &
  Omit<React.ComponentPropsWithRef<'input'>, 'type' | 'children'> & {
    /** Inline label text. When provided, the checkbox is wrapped in a `<label>`. */
    children?: React.ReactNode;
    /** Shows the mixed state. Sets the native `indeterminate` property on the input. */
    indeterminate?: boolean;
  };

function Checkbox(props: CheckboxProps) {
  const { ref, indeterminate = false, disabled, className, children, ...restProps } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

  // `indeterminate` has no HTML attribute and the browser clears it on click, so re-sync it after every render.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  });

  const rootClassName = cx(checkboxVariant({ disabled: Boolean(disabled) }), className);

  return (
    <Box as={children ? 'label' : 'span'} className={rootClassName}>
      <span className={checkboxControlCss}>
        <Box as="input" ref={inputRef} type="checkbox" disabled={disabled} {...restProps} />
        <svg data-indicator="check" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M4 8.5l2.5 2.5L12 5.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg data-indicator="dash" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4.5 8h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      {children}
    </Box>
  );
}

export default Checkbox;
