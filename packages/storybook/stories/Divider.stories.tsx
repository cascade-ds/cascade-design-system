import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider, Stack } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Horizontal separates stacked content; vertical separates inline content.',
    },
    tone: {
      control: 'radio',
      options: ['subtle', 'default', 'strong'],
      description: 'Line emphasis, from `component.divider.color`.',
    },
  },
  args: {
    orientation: 'horizontal',
    tone: 'default',
  },
  render: (args) => (
    <Stack gap="md">
      <span>Above</span>
      <Divider {...args} />
      <span>Below</span>
    </Stack>
  ),
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Subtle: Story = {
  args: {
    tone: 'subtle',
  },
};

export const Strong: Story = {
  args: {
    tone: 'strong',
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <Stack direction="row" gap="md" align="center">
      <span>Left</span>
      <Divider {...args} />
      <span>Right</span>
    </Stack>
  ),
};
