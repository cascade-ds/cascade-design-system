import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@/Layout/Stack';
import Label from '@/Atoms/Label/Label';

const meta = {
  title: 'CascadeDS/Components/Atom/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md'],
      description: 'Selects the `labelSm` or `labelMd` typography style.',
    },
    required: {
      control: 'boolean',
      description:
        'Shows a visual required marker (hidden from assistive technology). Also set `required` on the associated control.',
    },
    disabled: {
      control: 'boolean',
      description: 'Dims the label to match a disabled control.',
    },
    htmlFor: {
      control: 'text',
      description: 'The `id` of the control this label describes.',
    },
  },
  args: {
    children: 'Email address',
    htmlFor: 'label-story-input',
    size: 'md',
    required: false,
    disabled: false,
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

/**
 * A disabled label always sits with its disabled control. The dimmed text is
 * exempt from contrast requirements because the control is inactive, so the
 * story renders the control too.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => <LabelWithControl {...args} />,
};

export const WithControl: Story = {
  args: {
    required: true,
  },
  render: (args) => <LabelWithControl {...args} />,
};

function LabelWithControl(args: React.ComponentProps<typeof Label>) {
  return (
    <Stack gap="xs">
      <Label {...args} />
      <input
        id={args.htmlFor}
        type="email"
        required={args.required}
        disabled={args.disabled ?? false}
      />
    </Stack>
  );
}
