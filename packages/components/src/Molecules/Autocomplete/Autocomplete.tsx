import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { cx } from '@linaria/core';
import type { VariantProps } from 'class-variance-authority';
import { inputSlotVariant, inputVariant, inputWrapperVariant } from '../../Atoms/Input/Input.style';
import { useFormField, useFormFieldControl } from '../FormField/FormField';
import { useThemedPortalProps } from '../../ThemeProvider/ThemedPortal';
import {
  comboboxEmptyCss,
  comboboxGroupLabelCss,
  comboboxListCss,
  comboboxOptionCss,
  comboboxPopupCss,
  comboboxPositionerCss,
  comboboxSeparatorCss,
} from '../Combobox/Combobox.style';
import { autocompleteItemCss } from './Autocomplete.style';

export type AutocompleteProps<ItemValue> = BaseAutocomplete.Root.Props<ItemValue> & {
  /** The suggestions, filtered by what was typed. */
  items?: readonly ItemValue[];
};

export type AutocompleteInputProps = VariantProps<typeof inputVariant> &
  Omit<BaseAutocomplete.Input.Props, 'className' | 'render' | 'size'> & {
    /** Content before the text, sized as an icon (e.g. a search icon). */
    start?: React.ReactNode;
    /** Applied to the input, or to its wrapper when `start` is set. */
    className?: string;
  };

export type AutocompleteContentProps = {
  /**
   * The suggestions: `Autocomplete.Item`s, or a function that renders one per
   * entry of the root's `items` (filtered by what was typed).
   */
  children: BaseAutocomplete.List.Props['children'];
  /** Shown instead of the list when nothing matches. */
  emptyMessage?: React.ReactNode;
  /** Side of the input to open on. */
  side?: 'top' | 'bottom';
  className?: string;
};

export type AutocompleteItemProps = Omit<BaseAutocomplete.Item.Props, 'className' | 'render'> & {
  className?: string;
};

export type AutocompleteGroupProps = Omit<BaseAutocomplete.Group.Props, 'className' | 'render'> & {
  className?: string;
};

export type AutocompleteGroupLabelProps = Omit<
  BaseAutocomplete.GroupLabel.Props,
  'className' | 'render'
> & {
  className?: string;
};

export type AutocompleteSeparatorProps = { className?: string };

export type AutocompleteCollectionProps = BaseAutocomplete.Collection.Props;

/**
 * A text input that suggests values while the user types. The value is the
 * text itself: picking a suggestion fills the input, but any text is
 * allowed. For a value that must be one of the options, use `Combobox`.
 *
 * Pass `items` and render them from `Autocomplete.Content`'s function child,
 * so filtering works out of the box. Inside a `FormField`, the field's label,
 * hint and error are wired to the input, and its `disabled` and `required`
 * apply unless set here.
 */
function Autocomplete<ItemValue>(props: AutocompleteProps<ItemValue>) {
  const { disabled, required, ...restProps } = props;
  const field = useFormField();

  return (
    <BaseAutocomplete.Root
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      {...restProps}
    />
  );
}

/** The text input. Suggestions open as the user types. */
function AutocompleteInput(props: AutocompleteInputProps) {
  const { size, start, className, ...restProps } = props;
  const {
    disabled: _disabled,
    required: _required,
    ...inputProps
  } = useFormFieldControl(restProps);

  if (start == null) {
    return (
      <BaseAutocomplete.Input className={cx(inputVariant({ size }), className)} {...inputProps} />
    );
  }

  return (
    <BaseAutocomplete.InputGroup className={cx(inputWrapperVariant({ size }), className)}>
      <BaseAutocomplete.Input className={inputVariant({ size })} data-start="" {...inputProps} />
      <span className={inputSlotVariant({ side: 'start' })}>{start}</span>
    </BaseAutocomplete.InputGroup>
  );
}

/**
 * The suggestions popup, as wide as the input. Portaled to `<body>` but
 * themed like the input's subtree (see ADR-006).
 */
function AutocompleteContent(props: AutocompleteContentProps) {
  const { children, emptyMessage, side = 'bottom', className } = props;
  const themedPortalProps = useThemedPortalProps();

  return (
    <BaseAutocomplete.Portal {...themedPortalProps}>
      <BaseAutocomplete.Positioner side={side} className={comboboxPositionerCss}>
        <BaseAutocomplete.Popup className={cx(comboboxPopupCss, className)}>
          <BaseAutocomplete.Empty className={comboboxEmptyCss}>
            {emptyMessage}
          </BaseAutocomplete.Empty>
          <BaseAutocomplete.List className={comboboxListCss}>{children}</BaseAutocomplete.List>
        </BaseAutocomplete.Popup>
      </BaseAutocomplete.Positioner>
    </BaseAutocomplete.Portal>
  );
}

/** One suggestion. Picking it fills the input with its text. */
function AutocompleteItem(props: AutocompleteItemProps) {
  const { className, ...restProps } = props;

  return (
    <BaseAutocomplete.Item
      className={cx(comboboxOptionCss, autocompleteItemCss, className)}
      {...restProps}
    />
  );
}

/** Groups related suggestions under an `Autocomplete.GroupLabel`. */
function AutocompleteGroup(props: AutocompleteGroupProps) {
  return <BaseAutocomplete.Group {...props} />;
}

/** Heading for an `Autocomplete.Group`, used as the group's accessible name. */
function AutocompleteGroupLabel(props: AutocompleteGroupLabelProps) {
  const { className, ...restProps } = props;

  return (
    <BaseAutocomplete.GroupLabel className={cx(comboboxGroupLabelCss, className)} {...restProps} />
  );
}

/**
 * Inside a group, renders the group's `items` that match what was typed:
 * give the `Autocomplete.Group` its `items` and pass a function child here.
 */
function AutocompleteCollection(props: AutocompleteCollectionProps) {
  return <BaseAutocomplete.Collection {...props} />;
}

/** Divider between suggestions or groups. */
function AutocompleteSeparator(props: AutocompleteSeparatorProps) {
  const { className } = props;

  return <BaseAutocomplete.Separator className={cx(comboboxSeparatorCss, className)} />;
}

export {
  Autocomplete as Root,
  AutocompleteInput as Input,
  AutocompleteContent as Content,
  AutocompleteItem as Item,
  AutocompleteGroup as Group,
  AutocompleteGroupLabel as GroupLabel,
  AutocompleteSeparator as Separator,
  AutocompleteCollection as Collection,
};
