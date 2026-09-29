import type { Meta, StoryObj } from '@storybook/react-vite';
import Stack from '@/Layout/Stack/Stack';
import Radio from '@/Atoms/Radio/Radio';

const meta = {
  title: 'CascadeDS/Components/Atom/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description:
        'Inline label text. When omitted, name the radio with `aria-label` or an external `<label htmlFor>`.',
    },
    disabled: {
      control: 'boolean',
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marks the radio as invalid and applies the invalid border.',
    },
  },
  args: {
    children: 'Standard shipping',
    name: 'shipping',
    disabled: false,
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
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

export const Group: Story = {
  render: (args) => (
    <fieldset>
      <legend>Shipping method</legend>
      <Stack gap="sm" align="start">
        <Radio {...args} value="standard" defaultChecked>
          Standard shipping
        </Radio>
        <Radio {...args} value="express">
          Express shipping
        </Radio>
        <Radio {...args} value="overnight" disabled>
          Overnight (unavailable)
        </Radio>
      </Stack>
    </fieldset>
  ),
};
