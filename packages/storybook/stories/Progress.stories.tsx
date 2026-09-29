import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Progress } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Atom/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Current value. `null` shows ongoing work of unknown length.',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
      description: 'Height of the track.',
    },
    tone: {
      control: 'radio',
      options: ['default', 'success', 'danger'],
      description:
        'Fill color: `success` for a finished or healthy value, `danger` for one over a limit.',
    },
    showValue: {
      control: 'boolean',
    },
  },
  args: {
    value: 40,
    label: 'Uploading files',
    showValue: true,
    size: 'md',
    tone: 'default',
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="lg">
      <Progress {...args} size="sm" label="Small" />
      <Progress {...args} size="md" label="Medium" />
    </Stack>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <Stack gap="lg">
      <Progress {...args} tone="default" label="Storage used" value={40} />
      <Progress {...args} tone="success" label="Backup complete" value={100} />
      <Progress {...args} tone="danger" label="Quota" value={96} />
    </Stack>
  ),
};

/** With `value={null}` a bar sweeps across the track. */
export const Indeterminate: Story = {
  args: {
    value: null,
    label: 'Preparing export',
    showValue: false,
  },
};

/** Format the value and give screen readers words for it. */
export const CustomValue: Story = {
  args: {
    value: 3,
    max: 8,
    label: 'Files uploaded',
    format: { style: 'decimal' },
    getAriaValueText: (_, value) => `${value} of 8 files`,
  },
};

/** Without a visible label, name the bar with `aria-label`. */
export const WithoutLabel: Story = {
  args: {
    label: undefined,
    showValue: false,
    'aria-label': 'Profile completion',
    size: 'sm',
  },
};
