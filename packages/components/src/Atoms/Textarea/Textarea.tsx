import Box from '#/Layout/Box';
import { textareaVariant } from './Textarea.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type TextareaProps = VariantProps<typeof textareaVariant> &
  Omit<React.ComponentPropsWithRef<'textarea'>, 'children'>;

function Textarea(props: TextareaProps) {
  const { size, rows = 3, className, ...restProps } = props;
  const textareaClassName = cx(textareaVariant({ size }), className);

  return <Box as="textarea" rows={rows} className={textareaClassName} {...restProps} />;
}

export default Textarea;
