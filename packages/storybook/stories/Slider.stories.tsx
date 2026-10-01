import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Atom/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'accent', 'success', 'info', 'danger'],
      description: 'Color of the fill and thumb border. `primary` is the default.',
    },
    showValue: {
      control: 'boolean',
      description: 'Shows the formatted value (both ends for a range) next to the label.',
    },
    disabled: {
      control: 'boolean',
    },
    step: {
      control: 'number',
    },
    thumbLabels: {
      control: false,
      description: 'Names each thumb of a range slider.',
    },
  },
  args: {
    color: 'primary',
    label: 'Volume',
    defaultValue: 40,
    showValue: true,
    disabled: false,
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Range: Story = {
  render: (args) => (
    <Slider
      {...args}
      label="Price"
      defaultValue={[20, 80]}
      thumbLabels={['Minimum price', 'Maximum price']}
      format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
    />
  ),
};

export const Steps: Story = {
  args: {
    label: 'Team size',
    defaultValue: 10,
    min: 0,
    max: 50,
    step: 5,
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    showValue: false,
    'aria-label': 'Volume',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '24rem' }}>
      {(['primary', 'secondary', 'tertiary', 'accent', 'success', 'info', 'danger'] as const).map(
        (color) => (
          <Slider key={color} {...args} color={color} label={color} />
        ),
      )}
    </div>
  ),
};
