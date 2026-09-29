import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Skeleton } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Atom/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'radio',
      options: ['gray', 'primary', 'secondary'],
      description:
        '`gray` for neutral content, `primary` / `secondary` for placeholders inside brand-tinted surfaces.',
    },
    shape: {
      control: 'radio',
      options: ['rect', 'text', 'circle'],
      description:
        '`rect` for cards and media, `text` for a line of body text, `circle` for avatars. Each has a token default size; `width` / `height` override it.',
    },
    width: {
      control: 'text',
      description: 'Pixels when a number, any CSS length when a string. Defaults to full width.',
    },
    height: {
      control: 'text',
      description: 'Pixels when a number, any CSS length when a string.',
    },
  },
  args: {
    color: 'gray',
    shape: 'rect',
    width: 240,
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Text: Story = {
  args: {
    shape: 'text',
  },
};

export const Circle: Story = {
  args: {
    shape: 'circle',
    width: undefined,
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
  },
};

export const CardPlaceholder: Story = {
  render: (args) => (
    <Stack aria-busy="true" gap="sm">
      <Stack direction="row" align="center" gap="sm">
        <Skeleton {...args} shape="circle" width={undefined} />
        <Skeleton {...args} shape="text" width="40%" />
      </Stack>
      <Skeleton {...args} shape="text" width="100%" />
      <Skeleton {...args} shape="text" width="80%" />
    </Stack>
  ),
};
