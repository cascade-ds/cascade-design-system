import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '#/Atoms/Label';
import { Stack } from '#/Layout/Stack';
import Textarea from '#/Atoms/Textarea/Textarea';

const meta = {
  title: 'CascadeDS/Components/Atom/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the minimum height, inline padding and typography.',
    },
    rows: {
      control: 'number',
      description: 'Visible text lines. Defaults to 3; users can resize vertically.',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
      description: 'Value can be selected and copied but not edited.',
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marks the value as invalid and applies the invalid border.',
    },
  },
  args: {
    'aria-label': 'Message',
    placeholder: 'Write a message…',
    size: 'md',
    disabled: false,
    readOnly: false,
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const WithLabel: Story = {
  args: {
    'aria-label': undefined,
    id: 'textarea-bio',
  },
  render: (args) => (
    <Stack gap="xs">
      <Label htmlFor={args.id}>Bio</Label>
      <Textarea {...args} />
    </Stack>
  ),
};

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'Too short',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'This value cannot be edited.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
