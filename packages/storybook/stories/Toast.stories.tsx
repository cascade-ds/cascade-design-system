import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Text, Stack, ThemeProvider, Toast, type ToastOptions } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    a11y: { context: 'body' },
  },
  argTypes: {
    timeout: {
      control: 'number',
      description: 'Default milliseconds before a toast auto-dismisses; `0` keeps toasts open.',
    },
    limit: {
      control: 'number',
      description: 'How many toasts show at once. Older ones wait, hidden, until a slot frees up.',
    },
    manager: {
      control: false,
      description: 'A manager from `Toast.createManager()`, to show toasts from outside React.',
    },
  },
  args: {
    timeout: 5000,
    limit: 3,
    children: null,
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

function ShowToastButton(props: { label: string; options: ToastOptions }) {
  const { label, options } = props;
  const toast = Toast.useToast();

  return (
    <Button variant="secondary" onClick={() => toast.add(options)}>
      {label}
    </Button>
  );
}

export const Default: Story = {
  render: (args) => (
    <Toast {...args}>
      <ShowToastButton
        label="Save changes"
        options={{ title: 'Changes saved', description: 'Your profile is up to date.' }}
      />
    </Toast>
  ),
};

export const Open: Story = {
  args: { timeout: 0 },
  render: (args) => (
    <Toast {...args}>
      <Stack direction="row" gap="sm" wrap>
        <ShowToastButton
          label="Show success"
          options={{
            tone: 'success',
            title: 'Invoice sent',
            description: 'To billing@acme.test.',
            action: { label: 'View', onClick: () => {} },
          }}
        />
        <ShowToastButton
          label="Show danger"
          options={{
            tone: 'danger',
            title: 'Upload failed',
            description: 'Check your connection.',
          }}
        />
      </Stack>
    </Toast>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show success' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Show danger' }));
  },
};

export const Tones: Story = {
  render: (args) => (
    <Toast {...args}>
      <Stack direction="row" gap="sm" wrap>
        <ShowToastButton label="Neutral" options={{ title: 'Link copied' }} />
        <ShowToastButton
          label="Info"
          options={{ tone: 'info', title: 'Sync scheduled', description: 'Runs every hour.' }}
        />
        <ShowToastButton
          label="Success"
          options={{ tone: 'success', title: 'Invoice sent', description: 'To billing@acme.test.' }}
        />
        <ShowToastButton
          label="Warning"
          options={{ tone: 'warning', title: 'Storage almost full', description: '92% used.' }}
        />
        <ShowToastButton
          label="Danger"
          options={{
            tone: 'danger',
            title: 'Upload failed',
            description: 'Check your connection.',
          }}
        />
      </Stack>
    </Toast>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <Toast {...args}>
      <ShowToastButton
        label="Delete file"
        options={{
          title: 'File deleted',
          description: 'report-q3.pdf was moved to the trash.',
          action: { label: 'Undo', onClick: () => {} },
        }}
      />
    </Toast>
  ),
};

export const Persistent: Story = {
  render: (args) => (
    <Toast {...args}>
      <ShowToastButton
        label="Show persistent toast"
        options={{ tone: 'warning', title: 'You are offline', timeout: 0 }}
      />
    </Toast>
  ),
};

const manager = Toast.createManager();

export const WithManager: Story = {
  render: (args) => (
    <Toast {...args} manager={manager}>
      <Button
        variant="secondary"
        onClick={() => manager.add({ tone: 'success', title: 'Shown by a manager' })}
      >
        Show from manager
      </Button>
    </Toast>
  ),
};

export const InsideDarkSection: Story = {
  render: (args) => (
    <ThemeProvider initialMode="light">
      <Stack gap="md" align="start">
        <Text>Light page</Text>
        <ThemeProvider initialMode="dark">
          <Stack gap="md" align="start">
            <Text>Dark section</Text>
            <Toast {...args}>
              <ShowToastButton label="Show dark toast" options={{ title: 'Themed toast' }} />
            </Toast>
          </Stack>
        </ThemeProvider>
      </Stack>
    </ThemeProvider>
  ),
};
