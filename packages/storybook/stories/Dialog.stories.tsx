import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Text,
  Stack,
  ThemeProvider,
  Dialog,
  Toast,
  type DialogContentProps,
} from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Dialog',
  component: Dialog.Root,
  tags: ['autodocs'],
  parameters: {
    a11y: { context: 'body' },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state. Pair with `onOpenChange`.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
    },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof Dialog.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

type DeleteDialogProps = { defaultOpen?: boolean; size?: DialogContentProps['size'] };

function DeleteDialog(props: DeleteDialogProps) {
  return (
    <Toast.Root>
      <DeleteDialogWindow {...props} />
    </Toast.Root>
  );
}

function DeleteDialogWindow(props: DeleteDialogProps) {
  const { defaultOpen, size } = props;
  const TOAST_TTL = 1000 * 2;
  const toast = Toast.useToast();

  return (
    <Dialog.Root defaultOpen={defaultOpen}>
      <Dialog.Trigger variant="secondary">Delete project</Dialog.Trigger>
      <Dialog.Content size={size}>
        <Dialog.Title>Delete project?</Dialog.Title>
        <Dialog.Description>
          This removes the project and its history for everyone on the team. It cannot be undone.
        </Dialog.Description>
        <Dialog.Actions>
          <Dialog.Close variant="ghost">Cancel</Dialog.Close>
          <Dialog.Close
            variant="danger"
            onClick={() =>
              toast.add({
                title: 'Project deleted',
                description: 'The project and its history were removed.',
                tone: 'success',
                timeout: TOAST_TTL,
              })
            }
          >
            Delete
          </Dialog.Close>
        </Dialog.Actions>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export const Default: Story = {
  render: () => <DeleteDialog />,
};

export const Medium: Story = {
  render: () => <DeleteDialog size="md" />,
};

export const InsideDarkSection: Story = {
  render: () => (
    <ThemeProvider initialMode="light">
      <Stack gap="md">
        <Text>Light page</Text>
        <ThemeProvider initialMode="dark">
          <Stack gap="md" align="start">
            <Text>Dark section</Text>
            <DeleteDialog />
          </Stack>
        </ThemeProvider>
      </Stack>
    </ThemeProvider>
  ),
};

export const Controlled: Story = {
  render: function ControlledDialog() {
    const [open, setOpen] = useState(false);

    return (
      <Stack gap="md" align="start">
        <Text>The dialog is {open ? 'open' : 'closed'}.</Text>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>Edit profile</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>Controlled from the story state.</Dialog.Description>
            <Dialog.Actions>
              <Dialog.Close>Done</Dialog.Close>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog.Root>
      </Stack>
    );
  },
};
