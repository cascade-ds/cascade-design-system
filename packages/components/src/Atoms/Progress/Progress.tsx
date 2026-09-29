import { Progress as BaseProgress } from '@base-ui/react/progress';
import {
  progressIndicatorCss,
  progressLabelCss,
  progressTrackCss,
  progressValueCss,
  progressVariant,
} from './Progress.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type ProgressProps = VariantProps<typeof progressVariant> &
  Omit<React.ComponentPropsWithRef<'div'>, 'children'> & {
    /** Current value, between `min` and `max`. `null` shows ongoing work of unknown length. */
    value: number | null;
    /** @default 0 */
    min?: number;
    /** @default 100 */
    max?: number;
    /**
     * Visible label above the bar, which also names it. Without one, name the
     * bar with `aria-label`.
     */
    label?: React.ReactNode;
    /** Shows the formatted value (a percentage by default) next to the label. */
    showValue?: boolean;
    /** How to format the value, e.g. `{ style: 'unit', unit: 'megabyte' }`. */
    format?: Intl.NumberFormatOptions;
    /** Readable value for screen readers when the number alone isn't enough, e.g. "3 of 8 files". */
    getAriaValueText?: (formattedValue: string, value: number | null) => string;
  };

/**
 * Shows how far along a task is: a determinate bar for a known `value`, or
 * an indeterminate one while `value` is `null`. For waiting without a bar,
 * use `Spinner`.
 */
function Progress(props: ProgressProps) {
  const { size, tone, label, showValue = false, className, ...restProps } = props;

  return (
    <BaseProgress.Root className={cx(progressVariant({ size, tone }), className)} {...restProps}>
      {label != null && (
        <BaseProgress.Label className={progressLabelCss}>{label}</BaseProgress.Label>
      )}
      {showValue && <BaseProgress.Value className={progressValueCss} />}
      <BaseProgress.Track className={progressTrackCss}>
        <BaseProgress.Indicator className={progressIndicatorCss} />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}

export default Progress;
