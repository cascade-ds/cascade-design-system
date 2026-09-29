import type { Meta, StoryObj } from '@storybook/react-vite';
import { PersonIcon } from '@radix-ui/react-icons';
import { Text, Stack, Avatar } from '@cds/components';

const portrait =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#7c5cc4"/><circle cx="32" cy="26" r="12" fill="#f3e8ff"/><rect x="12" y="42" width="40" height="30" rx="15" fill="#f3e8ff"/></svg>',
  );

const meta = {
  title: 'CascadeDS/Components/Atom/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    name: {
      control: 'text',
      description: 'Names the avatar and gives the default initials.',
    },
    src: {
      control: 'text',
      description: 'Image URL. The fallback shows until it loads, or if it fails.',
    },
    fallback: {
      control: false,
      description: 'Shown without an image. Defaults to the initials of `name`.',
    },
  },
  args: {
    name: 'Ada Lovelace',
    size: 'md',
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    src: portrait,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap="sm" align="center">
      <Avatar {...args} size="xs" />
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </Stack>
  ),
};

export const BrokenImage: Story = {
  args: {
    src: 'data:image/png;base64,broken',
  },
};

export const IconFallback: Story = {
  args: {
    name: 'Unknown user',
    fallback: <PersonIcon />,
  },
};

export const WithName: Story = {
  render: (args) => (
    <Stack direction="row" gap="sm" align="center">
      <Avatar {...args} aria-hidden />
      <Text as="span">{args.name}</Text>
    </Stack>
  ),
};
