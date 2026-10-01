import { Slider as BaseSlider } from '@base-ui/react/slider';
import {
  sliderControlCss,
  sliderIndicatorCss,
  sliderLabelCss,
  sliderThumbCss,
  sliderTrackCss,
  sliderValueCss,
  sliderVariant,
} from './Slider.style';
import { cx } from '@linaria/core';
import type { VariantProps } from 'class-variance-authority';

type SliderValue = number | readonly number[];

export type SliderProps<Value extends SliderValue = number> = VariantProps<typeof sliderVariant> &
  Omit<
    BaseSlider.Root.Props<Value>,
    'className' | 'render' | 'orientation' | 'children' | 'color'
  > & {
    /** Visible label above the slider, which also names it. */
    label?: React.ReactNode;
    /** Shows the formatted value (both ends for a range) next to the label. */
    showValue?: boolean;
    /**
     * Names each thumb of a range slider, e.g. `['Minimum price', 'Maximum price']`.
     * For a single thumb without a visible `label`, use `aria-label` instead.
     */
    thumbLabels?: string[];
    /** Name for a single-thumb slider without a visible `label`. */
    'aria-label'?: string;
    /** Readable value for screen readers when the number alone isn't enough, e.g. "$40". */
    getAriaValueText?: (formattedValue: string, value: number, index: number) => string;
    className?: string;
  };

/**
 * Picks a number, or a range when `value` / `defaultValue` is an array (one
 * thumb per entry), by dragging or with the arrow keys. Page Up/Down move by
 * `largeStep`, Home/End jump to `min`/`max`.
 */
function Slider<Value extends SliderValue = number>(props: SliderProps<Value>) {
  const {
    label,
    color,
    showValue = false,
    thumbLabels,
    'aria-label': ariaLabel,
    getAriaValueText,
    className,
    ...restProps
  } = props;
  const initialValue = restProps.value ?? restProps.defaultValue;
  const thumbCount = Array.isArray(initialValue) ? initialValue.length : 1;

  return (
    <BaseSlider.Root className={cx(sliderVariant({ color }), className)} {...restProps}>
      {label != null && <BaseSlider.Label className={sliderLabelCss}>{label}</BaseSlider.Label>}
      {showValue && (
        <BaseSlider.Value className={sliderValueCss}>
          {(formattedValues) => formattedValues.join(' – ')}
        </BaseSlider.Value>
      )}
      <BaseSlider.Control className={sliderControlCss}>
        <BaseSlider.Track className={sliderTrackCss}>
          <BaseSlider.Indicator className={sliderIndicatorCss} />
          {Array.from({ length: thumbCount }, (_, index) => (
            <BaseSlider.Thumb
              key={index}
              index={index}
              aria-label={thumbLabels?.[index] ?? (thumbCount === 1 ? ariaLabel : undefined)}
              getAriaValueText={getAriaValueText}
              className={sliderThumbCss}
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}

export default Slider;
