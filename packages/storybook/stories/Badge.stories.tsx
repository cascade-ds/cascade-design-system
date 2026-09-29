import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Badge } from '@cds/components';

const tones = ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const;

const meta = {
  title: 'CascadeDS/Components/Atom/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md'],
      description: '`sm` for dense contexts such as table cells, `md` everywhere else.',
    },
    tone: {
      control: 'radio',
      options: tones,
      description:
        '`neutral` for plain labels and counts, `primary` / `secondary` for brand emphasis, `success` / `warning` / `danger` / `info` for status.',
    },
  },
  args: {
    children: 'Badge',
    tone: 'neutral',
    size: 'md',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Success: Story = {
  args: {
    tone: 'success',
    children: 'Active',
  },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    children: 'Pending',
  },
};

export const Danger: Story = {
  args: {
    tone: 'danger',
    children: 'Failed',
  },
};

export const Count: Story = {
  args: {
    tone: 'primary',
    children: '12',
  },
};

export const AllTones: Story = {
  render: (args) => (
    <Stack direction="row" gap="sm" wrap>
      {tones.map((tone) => (
        <Badge key={tone} {...args} tone={tone}>
          {tone}
        </Badge>
      ))}
    </Stack>
  ),
};
