import Box from '@/Layout/Box';
import { labelVariant, requiredIndicatorVariant } from './Label.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type LabelProps = VariantProps<typeof labelVariant> &
  React.ComponentPropsWithRef<'label'> & {
    /**
     * Shows a visual required marker. The marker is hidden from assistive
     * technology, so the associated control must still set `required` (or
     * `aria-required`) to expose the requirement to screen readers.
     */
    required?: boolean;
  };

function Label(props: LabelProps) {
  const { size, disabled, required = false, className, children, ...restProps } = props;
  const labelClassName = cx(labelVariant({ size, disabled }), className);

  return (
    <Box
      as="label"
      className={labelClassName}
      data-disabled={disabled ? '' : undefined}
      {...restProps}
    >
      {children}
      {required && (
        <span aria-hidden="true" className={requiredIndicatorVariant({ disabled })}>
          *
        </span>
      )}
    </Box>
  );
}

export default Label;
