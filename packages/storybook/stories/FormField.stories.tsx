import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import Button from '#/Atoms/Button/Button';
import Select from '#/Molecules/Select/Select';
import Stack from '#/Layout/Stack/Stack';
import FormField from '#/Molecules/FormField/FormField';

const meta = {
  title: 'CascadeDS/Components/Molecule/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    invalid: {
      control: 'boolean',
      description:
        'Marks the control invalid. Defaults to `true` while a `FormField.Error` is rendered. In these stories it also renders the error.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the control and dims the label.',
    },
    required: {
      control: 'boolean',
      description: "Marks the control `required` and shows the label's required marker.",
    },
  },
  args: {
    invalid: false,
    disabled: false,
    required: false,
    children: null,
  },
  render: (args) => (
    <FormField {...args}>
      <FormField.Label>Email</FormField.Label>
      <FormField.Input type="email" placeholder="you@example.com" />
      <FormField.Hint>We only use it for sign-in links.</FormField.Hint>
      {args.invalid && (
        <FormField.Error>Enter an email address like name@example.com.</FormField.Error>
      )}
    </FormField>
  ),
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
  },
};

/** The error adds to the hint: both describe the input. */
export const Invalid: Story = {
  args: {
    invalid: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const InputSizes: Story = {
  render: () => (
    <Stack gap="lg">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <FormField key={size}>
          <FormField.Label>Name ({size})</FormField.Label>
          <FormField.Input size={size} />
        </FormField>
      ))}
    </Stack>
  ),
};

export const WithTextarea: Story = {
  render: (args) => (
    <FormField {...args}>
      <FormField.Label>Bio</FormField.Label>
      <FormField.Textarea placeholder="Tell us about yourself…" />
      <FormField.Hint>Up to 280 characters.</FormField.Hint>
      {args.invalid && <FormField.Error>Keep it under 280 characters.</FormField.Error>}
    </FormField>
  ),
};

const countries = [
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'pt', label: 'Portugal' },
];

/** Cascade's `Select` picks up the field's label, hint, error and state. */
export const WithSelect: Story = {
  render: (args) => (
    <FormField {...args}>
      <FormField.Label>Country</FormField.Label>
      <Select items={countries}>
        <Select.Trigger placeholder="Choose a country" />
        <Select.Content>
          {countries.map((country) => (
            <Select.Item key={country.value} value={country.value}>
              {country.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      <FormField.Hint>Used for tax and shipping.</FormField.Hint>
      {args.invalid && <FormField.Error>Choose a country.</FormField.Error>}
    </FormField>
  ),
};

/**
 * Any control joins the field through `FormField.Control` (or the
 * `useFormFieldControl` hook): spread the props it passes onto the element
 * that takes input. Handy inside a form library's render prop.
 */
export const WithCustomControl: Story = {
  render: (args) => (
    <FormField {...args}>
      <FormField.Label>Due date</FormField.Label>
      <FormField.Control>
        {(controlProps) => <input type="date" {...controlProps} />}
      </FormField.Control>
      <FormField.Hint>Pick a weekday.</FormField.Hint>
      {args.invalid && <FormField.Error>Pick a date.</FormField.Error>}
    </FormField>
  ),
};

type SignUpValues = {
  email: string;
  country: string | null;
};

function SignUpForm() {
  const [submitted, setSubmitted] = useState<SignUpValues | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    mode: 'onTouched',
    defaultValues: { email: '', country: null },
  });

  return (
    <form noValidate onSubmit={handleSubmit(setSubmitted)}>
      <Stack gap="md">
        <FormField required>
          <FormField.Label>Email</FormField.Label>
          <FormField.Input
            type="email"
            {...register('email', {
              required: 'Enter your email.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+$/,
                message: 'Enter an email address like name@example.com.',
              },
            })}
          />
          <FormField.Hint>Validated when you leave the field and on submit.</FormField.Hint>
          {errors.email && <FormField.Error>{errors.email.message}</FormField.Error>}
        </FormField>

        <FormField required>
          <FormField.Label>Country</FormField.Label>
          <Controller
            name="country"
            control={control}
            rules={{ required: 'Choose a country.' }}
            render={({ field }) => (
              <Select
                items={countries}
                value={field.value}
                onValueChange={field.onChange}
                name={field.name}
              >
                <Select.Trigger
                  placeholder="Choose a country"
                  ref={field.ref}
                  onBlur={field.onBlur}
                />
                <Select.Content>
                  {countries.map((country) => (
                    <Select.Item key={country.value} value={country.value}>
                      {country.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            )}
          />
          {errors.country && <FormField.Error>{errors.country.message}</FormField.Error>}
        </FormField>

        <Button type="submit">Sign up</Button>
        {submitted && <p role="status">Signed up as {submitted.email}.</p>}
      </Stack>
    </form>
  );
}

/**
 * FormField holds no form state: React Hook Form owns the values, the
 * validation rules, when they run, and the messages. FormField only shows
 * what it is given. `register` spreads straight onto `FormField.Input`;
 * `Controller` wraps controls without a native input, like `Select`.
 * Any other library, or plain `useState`, slots in the same way.
 */
export const WithReactHookForm: Story = {
  render: () => <SignUpForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByRole('textbox', { name: /Email/ });
    const country = canvas.getByRole('combobox', { name: /Country/ });

    await expect(email).not.toHaveAttribute('aria-invalid');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign up' }));
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription(expect.stringContaining('Enter your email.'));
    await expect(country).toHaveAttribute('aria-invalid', 'true');
    await expect(country).toHaveAccessibleDescription('Choose a country.');

    await userEvent.type(email, 'ada@example.com');
    await expect(email).not.toHaveAttribute('aria-invalid');
  },
};
