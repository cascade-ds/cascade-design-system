import { Select as BaseSelect } from '@base-ui/react/select';
import { cx } from '@linaria/core';
import type { VariantProps } from 'class-variance-authority';
import { useFormField, useFormFieldControl } from '../FormField/FormField';
import { useThemedPortalProps } from '../../ThemeProvider/ThemedPortal';
import {
  selectGroupLabelCss,
  selectIconCss,
  selectItemCss,
  selectItemIndicatorCss,
  selectItemTextCss,
  selectLabelCss,
  selectListCss,
  selectPopupCss,
  selectPositionerCss,
  selectSeparatorCss,
  selectTriggerVariant,
  selectValueCss,
} from './Select.style';

export type SelectProps<Value> = Omit<BaseSelect.Root.Props<Value, false>, 'multiple'>;

export type SelectLabelProps = Omit<BaseSelect.Label.Props, 'className' | 'render'> & {
  className?: string;
};

export type SelectTriggerProps = VariantProps<typeof selectTriggerVariant> &
  Omit<BaseSelect.Trigger.Props, 'className' | 'render' | 'children'> & {
    /** Shown while nothing is selected. */
    placeholder?: React.ReactNode;
    className?: string;
  };

export type SelectContentProps = {
  children: React.ReactNode;
  /**
   * Overlap the trigger so the selected option sits over the trigger's value,
   * like a native select. Set to `false` to open below the trigger instead.
   */
  alignItemWithTrigger?: boolean;
  /** Side of the trigger to place the popup on when not aligned over it. */
  side?: 'top' | 'bottom';
  className?: string;
};

export type SelectItemProps = Omit<BaseSelect.Item.Props, 'className' | 'render'> & {
  className?: string;
};

export type SelectGroupProps = Omit<BaseSelect.Group.Props, 'className' | 'render'> & {
  className?: string;
};

export type SelectGroupLabelProps = Omit<BaseSelect.GroupLabel.Props, 'className' | 'render'> & {
  className?: string;
};

export type SelectSeparatorProps = { className?: string };

/**
 * Chooses one value from a list of options. Renders no element itself: pair
 * a `Select.Trigger` with a `Select.Content` of `Select.Item`s. Pass `items`
 * so the trigger shows an option's label instead of its raw value.
 *
 * Inside a `FormField`, the field's label, hint and error are wired to the
 * trigger, and its `disabled` and `required` apply unless set here.
 */
function Select<Value>(props: SelectProps<Value>) {
  const { disabled, required, ...restProps } = props;
  const field = useFormField();

  return (
    <BaseSelect.Root
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      {...restProps}
    />
  );
}

/** Visible label for a Select used outside a `FormField`. */
function SelectLabel(props: SelectLabelProps) {
  const { className, ...restProps } = props;

  return <BaseSelect.Label className={cx(selectLabelCss, className)} {...restProps} />;
}

/** The button showing the current value. Opens the options popup. */
function SelectTrigger(props: SelectTriggerProps) {
  const { size, placeholder, className, ...restProps } = props;
  const inField = useFormField() !== null;
  const {
    disabled: _disabled,
    required: _required,
    ...fieldProps
  } = useFormFieldControl({
    id: restProps.id,
    'aria-label': restProps['aria-label'],
    'aria-labelledby': restProps['aria-labelledby'],
    'aria-describedby': restProps['aria-describedby'],
    'aria-invalid': restProps['aria-invalid'],
  });

  return (
    <BaseSelect.Trigger
      className={cx(selectTriggerVariant({ size }), className)}
      {...restProps}
      {...(inField ? fieldProps : undefined)}
    >
      <BaseSelect.Value className={selectValueCss} placeholder={placeholder} />
      <BaseSelect.Icon className={selectIconCss}>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

/**
 * The options popup. Portaled to `<body>` but themed like the trigger's
 * subtree: Base UI's portal element carries the nearest ThemeProvider's
 * `data-theme` (see ADR-006).
 */
function SelectContent(props: SelectContentProps) {
  const { children, alignItemWithTrigger = true, side = 'bottom', className } = props;
  const themedPortalProps = useThemedPortalProps();

  return (
    <BaseSelect.Portal {...themedPortalProps}>
      <BaseSelect.Positioner
        alignItemWithTrigger={alignItemWithTrigger}
        side={side}
        className={selectPositionerCss}
      >
        <BaseSelect.Popup className={cx(selectPopupCss, className)}>
          <BaseSelect.List className={selectListCss}>{children}</BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

/** One option. Shows a check mark while selected. */
function SelectItem(props: SelectItemProps) {
  const { className, children, ...restProps } = props;

  return (
    <BaseSelect.Item className={cx(selectItemCss, className)} {...restProps}>
      <BaseSelect.ItemIndicator className={selectItemIndicatorCss}>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3.5 8.5l3 3 6-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className={selectItemTextCss}>{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}

/** Groups related options under a `Select.GroupLabel`. */
function SelectGroup(props: SelectGroupProps) {
  return <BaseSelect.Group {...props} />;
}

/** Heading for a `Select.Group`, used as the group's accessible name. */
function SelectGroupLabel(props: SelectGroupLabelProps) {
  const { className, ...restProps } = props;

  return <BaseSelect.GroupLabel className={cx(selectGroupLabelCss, className)} {...restProps} />;
}

/** Divider between options or groups. */
function SelectSeparator(props: SelectSeparatorProps) {
  const { className } = props;

  return <BaseSelect.Separator className={cx(selectSeparatorCss, className)} />;
}

export {
  Select as Root,
  SelectLabel as Label,
  SelectTrigger as Trigger,
  SelectContent as Content,
  SelectItem as Item,
  SelectGroup as Group,
  SelectGroupLabel as GroupLabel,
  SelectSeparator as Separator,
};
