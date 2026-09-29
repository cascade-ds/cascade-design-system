import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { cx } from '@linaria/core';
import type { VariantProps } from 'class-variance-authority';
import { inputSlotVariant, inputVariant, inputWrapperVariant } from '../../Atoms/Input/Input.style';
import { useFormField, useFormFieldControl } from '../FormField/FormField';
import { useThemedPortalProps } from '../../ThemeProvider/ThemedPortal';
import {
  comboboxEmptyCss,
  comboboxGroupLabelCss,
  comboboxItemCss,
  comboboxItemIndicatorCss,
  comboboxItemTextCss,
  comboboxListCss,
  comboboxOptionCss,
  comboboxPopupCss,
  comboboxPositionerCss,
  comboboxSeparatorCss,
  comboboxTriggerCss,
} from './Combobox.style';

export type ComboboxProps<Value, Item = Value> = Omit<
  BaseCombobox.Root.Props<Value, false, Item>,
  'multiple'
>;

export type ComboboxInputProps = VariantProps<typeof inputVariant> &
  Omit<BaseCombobox.Input.Props, 'className' | 'render' | 'size'> & {
    /** Name of the chevron button that opens the list. @default "Show options" */
    triggerLabel?: string;
    /** Applied to the wrapper around the input and the chevron. */
    className?: string;
  };

export type ComboboxContentProps = {
  /**
   * The options: `Combobox.Item`s, or a function that renders one per entry
   * of the root's `items` (filtered by what was typed).
   */
  children: BaseCombobox.List.Props['children'];
  /** Shown instead of the list when nothing matches. */
  emptyMessage?: React.ReactNode;
  /** Side of the input to open on. */
  side?: 'top' | 'bottom';
  className?: string;
};

export type ComboboxItemProps = Omit<BaseCombobox.Item.Props, 'className' | 'render'> & {
  className?: string;
};

export type ComboboxGroupProps = Omit<BaseCombobox.Group.Props, 'className' | 'render'> & {
  className?: string;
};

export type ComboboxGroupLabelProps = Omit<
  BaseCombobox.GroupLabel.Props,
  'className' | 'render'
> & {
  className?: string;
};

export type ComboboxSeparatorProps = { className?: string };

export type ComboboxCollectionProps = BaseCombobox.Collection.Props;

/**
 * Chooses one value from a list the user can filter by typing: a Select for
 * long lists. The typed text only filters; the value must be one of the
 * options. For free text with suggestions, use `Autocomplete`.
 *
 * Pass `items` and render them from `Combobox.Content`'s function child, so
 * filtering works out of the box. Inside a `FormField`, the field's label,
 * hint and error are wired to the input, and its `disabled` and `required`
 * apply unless set here.
 */
function Combobox<Value, Item = Value>(props: ComboboxProps<Value, Item>) {
  const { disabled, required, ...restProps } = props;
  const field = useFormField();

  return (
    <BaseCombobox.Root
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      {...restProps}
    />
  );
}

/** The text input that filters the options, with a chevron that opens them. */
function ComboboxInput(props: ComboboxInputProps) {
  const { size, triggerLabel = 'Show options', className, ...restProps } = props;
  // The root already takes the field's `disabled` and `required`.
  const {
    disabled: _disabled,
    required: _required,
    ...inputProps
  } = useFormFieldControl(restProps);

  return (
    <BaseCombobox.InputGroup className={cx(inputWrapperVariant({ size }), className)}>
      <BaseCombobox.Input className={inputVariant({ size })} data-end="" {...inputProps} />
      <span className={inputSlotVariant({ side: 'end' })}>
        <BaseCombobox.Trigger className={comboboxTriggerCss} aria-label={triggerLabel}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </BaseCombobox.Trigger>
      </span>
    </BaseCombobox.InputGroup>
  );
}

/**
 * The options popup, as wide as the input. Portaled to `<body>` but themed
 * like the input's subtree (see ADR-006).
 */
function ComboboxContent(props: ComboboxContentProps) {
  const { children, emptyMessage, side = 'bottom', className } = props;
  const themedPortalProps = useThemedPortalProps();

  return (
    <BaseCombobox.Portal {...themedPortalProps}>
      <BaseCombobox.Positioner side={side} className={comboboxPositionerCss}>
        <BaseCombobox.Popup className={cx(comboboxPopupCss, className)}>
          <BaseCombobox.Empty className={comboboxEmptyCss}>{emptyMessage}</BaseCombobox.Empty>
          <BaseCombobox.List className={comboboxListCss}>{children}</BaseCombobox.List>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

/** One option. Shows a check mark while selected. */
function ComboboxItem(props: ComboboxItemProps) {
  const { className, children, ...restProps } = props;

  return (
    <BaseCombobox.Item className={cx(comboboxOptionCss, comboboxItemCss, className)} {...restProps}>
      <BaseCombobox.ItemIndicator className={comboboxItemIndicatorCss}>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3.5 8.5l3 3 6-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </BaseCombobox.ItemIndicator>
      <span className={comboboxItemTextCss}>{children}</span>
    </BaseCombobox.Item>
  );
}

/** Groups related options under a `Combobox.GroupLabel`. */
function ComboboxGroup(props: ComboboxGroupProps) {
  return <BaseCombobox.Group {...props} />;
}

/** Heading for a `Combobox.Group`, used as the group's accessible name. */
function ComboboxGroupLabel(props: ComboboxGroupLabelProps) {
  const { className, ...restProps } = props;

  return (
    <BaseCombobox.GroupLabel className={cx(comboboxGroupLabelCss, className)} {...restProps} />
  );
}

/**
 * Inside a group, renders the group's `items` that match what was typed:
 * give the `Combobox.Group` its `items` and pass a function child here.
 */
function ComboboxCollection(props: ComboboxCollectionProps) {
  return <BaseCombobox.Collection {...props} />;
}

/** Divider between options or groups. */
function ComboboxSeparator(props: ComboboxSeparatorProps) {
  const { className } = props;

  return <BaseCombobox.Separator className={cx(comboboxSeparatorCss, className)} />;
}

Combobox.Input = ComboboxInput;
Combobox.Content = ComboboxContent;
Combobox.Item = ComboboxItem;
Combobox.Group = ComboboxGroup;
Combobox.GroupLabel = ComboboxGroupLabel;
Combobox.Separator = ComboboxSeparator;
Combobox.Collection = ComboboxCollection;

export default Combobox;
