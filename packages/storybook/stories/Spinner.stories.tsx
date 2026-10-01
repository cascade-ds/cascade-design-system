import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Atom/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [
        'primary',
        'neutral',
        'secondary',
        'tertiary',
        'accent',
        'success',
        'info',
        'danger',
      ],
      description:
        'Color of the spinning arc. `primary` is the default; `neutral` for quiet, inline loading.',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Matches the `sm` / `md` / `lg` icon sizes so it sits alongside text and icons.',
    },
    label: {
      control: 'text',
      description: 'Accessible name announced to assistive technology. Defaults to "Loading".',
    },
  },
  args: {
    color: 'primary',
    size: 'md',
    label: 'Loading',
  },
} satisfies Meta<typeof Spinner>;

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

export const CustomLabel: Story = {
  args: {
    label: 'Loading results',
  },
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {(
        [
          'primary',
          'neutral',
          'secondary',
          'tertiary',
          'accent',
          'success',
          'info',
          'danger',
        ] as const
      ).map((color) => (
        <Spinner key={color} {...args} color={color} label={`Loading ${color}`} />
      ))}
    </div>
  ),
};
