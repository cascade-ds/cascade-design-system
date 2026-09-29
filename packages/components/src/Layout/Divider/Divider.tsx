import Box from '../Box';
import { dividerVariant } from './Divider.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type DividerProps = VariantProps<typeof dividerVariant> &
  Omit<React.HTMLAttributes<HTMLHRElement>, 'children'>;

function Divider(props: DividerProps) {
  const { orientation, tone, className, ...restProps } = props;
  const dividerClassName = cx(dividerVariant({ orientation, tone }), className);

  return (
    <Box
      as="hr"
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={dividerClassName}
      {...restProps}
    />
  );
}

export default Divider;
