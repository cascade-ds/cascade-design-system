import type { Meta, StoryObj } from '@storybook/react-vite';
import Checkbox from '#/Atoms/Checkbox/Checkbox';

const meta = {
  title: 'CascadeDS/Components/Atom/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description:
        'Inline label text. When omitted, name the checkbox with `aria-label` or an external `<label htmlFor>`.',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Mixed state, e.g. a "select all" checkbox when only some items are selected.',
    },
    disabled: {
      control: 'boolean',
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marks the checkbox as invalid and applies the invalid border.',
    },
  },
  args: {
    children: 'Accept terms and conditions',
    indeterminate: false,
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    children: 'Select all',
    indeterminate: true,
  },
};

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const WithoutVisibleLabel: Story = {
  args: {
    children: undefined,
    'aria-label': 'Select row',
  },
};
