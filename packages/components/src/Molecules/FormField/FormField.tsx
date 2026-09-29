import {
  Children,
  cloneElement,
  createContext,
  Fragment,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useState,
} from 'react';
import { cx } from '@linaria/core';
import Input from '@/Atoms/Input/Input';
import type { InputProps } from '@/Atoms/Input/Input';
import Label from '@/Atoms/Label/Label';
import type { LabelProps } from '@/Atoms/Label/Label';
import Textarea from '@/Atoms/Textarea/Textarea';
import type { TextareaProps } from '@/Atoms/Textarea/Textarea';
import {
  formFieldCss,
  formFieldErrorCss,
  formFieldHelperCss,
  formFieldHintCss,
} from './FormField.style';

export type FormFieldProps = React.ComponentPropsWithRef<'div'> & {
  /**
   * Marks the control invalid (`aria-invalid` and the invalid border).
   * Defaults to `true` while a `FormField.Error` is rendered.
   */
  invalid?: boolean;
  /** Disables the control and dims the label. */
  disabled?: boolean;
  /** Marks the control `required` and shows the label's required marker. */
  required?: boolean;
  /** Id for the control, which the label points to. Generated when unset. */
  controlId?: string;
};

export type FormFieldLabelProps = Omit<LabelProps, 'required' | 'disabled' | 'htmlFor'>;

export type FormFieldInputProps = InputProps;

export type FormFieldTextareaProps = TextareaProps;

export type FormFieldHintProps = React.ComponentPropsWithRef<'p'>;

export type FormFieldErrorProps = React.ComponentPropsWithRef<'div'>;

/** Attributes that wire a control to its field. */
export type FormFieldControlProps = {
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  required?: boolean;
  disabled?: boolean;
};

export type FormFieldControlRenderProps = {
  /** Wiring for the control: spread it onto the element that takes input. */
  children: (props: FormFieldControlProps) => React.ReactNode;
};

type PartKind = 'label' | 'hint' | 'error';

type PartIds = Record<PartKind, string[]>;

type FormFieldContextValue = {
  controlId: string;
  /** Rendered parts, in order: ids FormField assigned plus late registrations. */
  parts: PartIds;
  /** Ids FormField assigned while rendering; these parts need no registration. */
  assigned: PartIds;
  register: (kind: PartKind, id: string) => () => void;
  invalid: boolean;
  disabled?: boolean;
  required?: boolean;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

function emptyPartIds(): PartIds {
  return { label: [], hint: [], error: [] };
}

function partKindOf(type: unknown): PartKind | null {
  if (type === FormFieldLabel) return 'label';
  if (type === FormFieldHint) return 'hint';
  if (type === FormFieldError) return 'error';
  return null;
}

/**
 * Finds the Label, Hint and Error parts among the children (looking through
 * fragments and conditionals) and gives each one an id while rendering.
 * That way the control is wired in the first render, server side included,
 * instead of one render later.
 */
function assignPartIds(children: React.ReactNode, baseId: string, found: PartIds): React.ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement<{ id?: string; children?: React.ReactNode }>(child)) {
      return child;
    }
    if (child.type === Fragment) {
      return cloneElement(child, undefined, assignPartIds(child.props.children, baseId, found));
    }
    const kind = partKindOf(child.type);
    if (!kind) {
      return child;
    }
    const id = child.props.id ?? `${baseId}-${kind}-${found[kind].length}`;
    found[kind].push(id);
    return cloneElement(child, { id });
  });
}

/**
 * The surrounding field, or `null` outside one. For Cascade controls that
 * need more than `useFormFieldControl` gives (e.g. Select's root).
 */
export function useFormField() {
  return useContext(FormFieldContext);
}

/**
 * Merges the field's wiring into a control's props: the label as
 * `aria-labelledby`, the hints and errors as `aria-describedby`, and
 * `aria-invalid`, `required` and `disabled`. Props set on the control win.
 * Outside a FormField the props come back unchanged.
 */
export function useFormFieldControl<Props extends FormFieldControlProps>(
  props: Props,
): Props & FormFieldControlProps {
  const field = useContext(FormFieldContext);

  if (!field) {
    return props;
  }

  const describedBy = [props['aria-describedby'], ...field.parts.hint, ...field.parts.error]
    .filter(Boolean)
    .join(' ');
  // Also names controls that `<label for>` can't reach (e.g. a
  // `div role="combobox"`), unless the control is already named.
  const labelledBy =
    props['aria-labelledby'] ??
    (props['aria-label'] ? undefined : field.parts.label.join(' ') || undefined);

  return {
    ...props,
    id: props.id ?? field.controlId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': props['aria-invalid'] ?? (field.invalid || undefined),
    required: props.required ?? field.required,
    disabled: props.disabled ?? field.disabled,
  };
}

/**
 * Lays out a label, a control, a hint and an error message, and wires them
 * together for assistive technology.
 *
 * It holds no form state: value, validation, touched/dirty and error
 * messages all belong to the consumer (plain `useState`, React Hook Form,
 * Formik, server errors, …). FormField only reflects what it is given:
 * `invalid`, `disabled` and `required`, and whichever `FormField.Error`s
 * are rendered.
 *
 * Works with `FormField.Input`, `FormField.Textarea`, Cascade's `Select`,
 * and any other control through `FormField.Control` or `useFormFieldControl`.
 * Render the parts as children of FormField (fragments and conditionals are
 * fine) so they are wired on the first render; parts nested inside other
 * components are wired once they mount.
 */
function FormField(props: FormFieldProps) {
  const { invalid, disabled, required, controlId, className, children, ...restProps } = props;
  const baseId = useId();
  const [registered, setRegistered] = useState<PartIds>(emptyPartIds);

  const register = useCallback((kind: PartKind, id: string) => {
    setRegistered((current) => ({ ...current, [kind]: [...current[kind], id] }));
    return () =>
      setRegistered((current) => ({
        ...current,
        [kind]: current[kind].filter((registeredId) => registeredId !== id),
      }));
  }, []);

  const assigned = emptyPartIds();
  const wiredChildren = assignPartIds(children, baseId, assigned);
  const parts: PartIds = {
    label: [...assigned.label, ...registered.label],
    hint: [...assigned.hint, ...registered.hint],
    error: [...assigned.error, ...registered.error],
  };

  const field: FormFieldContextValue = {
    controlId: controlId ?? `${baseId}-control`,
    parts,
    assigned,
    register,
    invalid: invalid ?? parts.error.length > 0,
    disabled,
    required,
  };

  return (
    <FormFieldContext.Provider value={field}>
      <div
        className={cx(formFieldCss, className)}
        data-invalid={field.invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        {...restProps}
      >
        {wiredChildren}
      </div>
    </FormFieldContext.Provider>
  );
}

/**
 * Resolves a part's id and, when FormField couldn't assign it during render
 * (the part is nested inside another component), registers it on mount.
 */
function useFormFieldPart(kind: PartKind, part: string, idProp: string | undefined) {
  const field = useContext(FormFieldContext);
  if (!field) {
    throw new Error(`FormField.${part} must be rendered inside a FormField.`);
  }

  const ownId = useId();
  const id = idProp ?? ownId;
  const isAssigned = field.assigned[kind].includes(id);
  const { register } = field;

  useLayoutEffect(() => {
    if (!isAssigned) {
      return register(kind, id);
    }
  }, [isAssigned, register, kind, id]);

  return { field, id };
}

/** Names the control. Shows the required marker when the field is `required`. */
function FormFieldLabel(props: FormFieldLabelProps) {
  const { field, id } = useFormFieldPart('label', 'Label', props.id);

  return (
    <Label
      htmlFor={field.controlId}
      required={field.required}
      disabled={field.disabled}
      {...props}
      id={id}
    />
  );
}

/** Single-line text control: a Cascade `Input` wired to the field. */
function FormFieldInput(props: FormFieldInputProps) {
  return <Input {...useFormFieldControl(props)} />;
}

/** Multi-line text control: a Cascade `Textarea` wired to the field. */
function FormFieldTextarea(props: FormFieldTextareaProps) {
  return <Textarea {...useFormFieldControl(props)} />;
}

/**
 * Wires any other control (a date picker, a controller-wrapped component, …)
 * to the field: spread the props it passes onto the element that takes
 * input. Use `useFormFieldControl` instead when you can call a hook.
 */
function FormFieldControl(props: FormFieldControlRenderProps) {
  return props.children(useFormFieldControl({}));
}

/** Supporting text under the control, announced as its description. */
function FormFieldHint(props: FormFieldHintProps) {
  const { className, ...restProps } = props;
  const { id } = useFormFieldPart('hint', 'Hint', props.id);

  return (
    <p className={cx(formFieldHelperCss, formFieldHintCss, className)} {...restProps} id={id} />
  );
}

/**
 * Error message, shown for as long as it is rendered: render it
 * conditionally from your own form state. While rendered it describes the
 * control and marks the field invalid, unless `invalid` is set explicitly.
 * Several errors may be rendered at once.
 */
function FormFieldError(props: FormFieldErrorProps) {
  const { className, ...restProps } = props;
  const { id } = useFormFieldPart('error', 'Error', props.id);

  return (
    <div className={cx(formFieldHelperCss, formFieldErrorCss, className)} {...restProps} id={id} />
  );
}

FormField.Label = FormFieldLabel;
FormField.Input = FormFieldInput;
FormField.Textarea = FormFieldTextarea;
FormField.Control = FormFieldControl;
FormField.Hint = FormFieldHint;
FormField.Error = FormFieldError;

export default FormField;
