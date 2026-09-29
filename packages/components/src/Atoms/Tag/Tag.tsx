import { useId } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import Box from '../../Layout/Box';
import { tagRemoveButtonCss, tagVariant } from './Tag.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type TagProps = VariantProps<typeof tagVariant> &
  React.ComponentPropsWithRef<'span'> & {
    /** When set, renders a remove button after the label that calls this handler. */
    onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /**
     * Accessible name of the remove button. Defaults to "Remove {children}"
     * when `children` is plain text; otherwise the button is named "Remove"
     * followed by the tag's content.
     */
    removeLabel?: string;
  };

function Tag(props: TagProps) {
  const { tone, size, onRemove, removeLabel, className, children, ...restProps } = props;
  const tagClassName = cx(tagVariant({ tone, size }), className);
  const labelId = useId();
  const buttonId = useId();

  const isTextLabel = typeof children === 'string' || typeof children === 'number';
  const buttonLabel = removeLabel ?? (isTextLabel ? `Remove ${children}` : 'Remove');
  const buttonLabelledBy = removeLabel || isTextLabel ? undefined : `${buttonId} ${labelId}`;

  return (
    <Box as="span" className={tagClassName} {...restProps}>
      <span id={labelId}>{children}</span>
      {onRemove && (
        <button
          id={buttonId}
          type="button"
          className={tagRemoveButtonCss}
          aria-label={buttonLabel}
          aria-labelledby={buttonLabelledBy}
          onClick={onRemove}
        >
          <Cross2Icon aria-hidden="true" />
        </button>
      )}
    </Box>
  );
}

export default Tag;
