import Box from '../../Layout/Box';
import { radioControlCss, radioVariant } from './Radio.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type RadioProps = VariantProps<typeof radioVariant> &
  Omit<React.ComponentPropsWithRef<'input'>, 'type' | 'children'> & {
    /** Inline label text. When provided, the radio is wrapped in a `<label>`. */
    children?: React.ReactNode;
  };

function Radio(props: RadioProps) {
  const { disabled, className, children, ...restProps } = props;
  const rootClassName = cx(radioVariant({ disabled: Boolean(disabled) }), className);

  return (
    <Box as={children ? 'label' : 'span'} className={rootClassName}>
      <span className={radioControlCss}>
        <Box as="input" type="radio" disabled={disabled} {...restProps} />
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="3" fill="currentColor" />
        </svg>
      </span>
      {children}
    </Box>
  );
}

export default Radio;
