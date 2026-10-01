import Box from '../../Layout/Box';
import { spinnerVariant } from './Spinner.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type SpinnerProps = VariantProps<typeof spinnerVariant> &
  Omit<React.ComponentPropsWithRef<'span'>, 'children' | 'color'> & {
    /** Accessible name announced for the loading state. Defaults to "Loading". */
    label?: string;
  };

function Spinner(props: SpinnerProps) {
  const { size, color, label = 'Loading', className, ...restProps } = props;
  const spinnerClassName = cx(spinnerVariant({ size, color }), className);

  return (
    <Box as="span" role="status" aria-label={label} className={spinnerClassName} {...restProps} />
  );
}

export default Spinner;
