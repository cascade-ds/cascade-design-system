import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@/Layout/Stack';
import Alert from '@/Molecules/Alert/Alert';

const tones = ['info', 'success', 'warning', 'danger'] as const;

const meta = {
  title: 'CascadeDS/Components/Molecule/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'radio',
      options: tones,
      description:
        'Colour and default icon. `warning` and `danger` default to `role="alert"` (announced immediately); `info` and `success` to `role="status"` (announced politely).',
    },
    layout: {
      control: 'radio',
      options: ['inline', 'banner'],
      description:
        '`inline` is a boxed message within content. `banner` spans its container edge to edge, e.g. a page-level notice under the top bar.',
    },
    icon: {
      control: false,
      description: "Leading icon. Defaults to the tone's icon; `null` hides it.",
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
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Stack gap="md">
      {tones.map((tone) => (
        <Alert key={tone} {...args} tone={tone}>
          <Alert.Title>{tone.charAt(0).toUpperCase() + tone.slice(1)}</Alert.Title>
          <Alert.Description>This is a {tone} message.</Alert.Description>
        </Alert>
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

/** Full-width notice for the top of a page or section. */
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
