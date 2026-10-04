import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { Stack, Alert } from '@cds/components';

const tones = ['info', 'success', 'warning', 'danger'] as const;

const toneIcons = {
  info: <InfoCircledIcon />,
  success: <CheckCircledIcon />,
  warning: <ExclamationTriangleIcon />,
  danger: <CrossCircledIcon />,
};

const meta = {
  title: 'CascadeDS/Components/Molecule/Alert',
  component: Alert.Root,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'radio',
      options: tones,
      description:
        'Colour. `warning` and `danger` default to `role="alert"` (announced immediately); `info` and `success` to `role="status"` (announced politely).',
    },
    layout: {
      control: 'radio',
      options: ['inline', 'banner'],
      description:
        '`inline` is a boxed message within content. `banner` spans its container edge to edge, e.g. a page-level notice under the top bar.',
    },
    icon: {
      control: false,
      description:
        'Leading icon, supplied by the consumer. The stories pass a Radix icon matching the tone; `null` shows none.',
    },
  },
  args: {
    tone: 'info',
    layout: 'inline',
    children: (
      <>
        <Alert.Title>A new version is available</Alert.Title>
        <Alert.Description>Reload the page to get the latest features.</Alert.Description>
      </>
    ),
  },
  render: (args) => (
    <Alert.Root
      {...args}
      icon={args.icon === undefined ? toneIcons[args.tone ?? 'info'] : args.icon}
    />
  ),
} satisfies Meta<typeof Alert.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Stack gap="md">
      {tones.map((tone) => (
        <Alert.Root key={tone} {...args} tone={tone} icon={toneIcons[tone]}>
          <Alert.Title>{tone.charAt(0).toUpperCase() + tone.slice(1)}</Alert.Title>
          <Alert.Description>This is a {tone} message.</Alert.Description>
        </Alert.Root>
      ))}
    </Stack>
  ),
};

export const DescriptionOnly: Story = {
  args: {
    tone: 'success',
    children: <Alert.Description>Your changes were saved.</Alert.Description>,
  },
};

export const Dismissible: Story = {
  args: {
    tone: 'warning',
    onDismiss: () => {},
    children: (
      <>
        <Alert.Title>Your trial ends in 3 days</Alert.Title>
        <Alert.Description>Add a payment method to keep your projects.</Alert.Description>
      </>
    ),
  },
};

export const Banner: Story = {
  args: {
    layout: 'banner',
    tone: 'warning',
    onDismiss: () => {},
    children: (
      <Alert.Description>Scheduled maintenance tonight from 22:00 to 23:00 UTC.</Alert.Description>
    ),
  },
};

export const WithoutIcon: Story = {
  args: {
    icon: null,
  },
};
