import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Text from '#/Atoms/Text/Text';
import Stack from '#/Layout/Stack/Stack';
import { ThemeProvider } from '#/ThemeProvider';
import Dialog from '#/Molecules/Dialog/Dialog';
import Toast from '#/Molecules/Toast/Toast';
import type { DialogContentProps } from '#/Molecules/Dialog/Dialog';

const meta = {
  title: 'CascadeDS/Components/Molecule/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    // Dialogs are portaled to <body>, outside the story root: check the whole
    // page so open dialogs are covered by the a11y tests too.
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
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

type DeleteDialogProps = { defaultOpen?: boolean; size?: DialogContentProps['size'] };

/** Mounts its own Toast, so the toast takes the theme of the subtree it is in. */
function DeleteDialog(props: DeleteDialogProps) {
  return (
    <Toast>
      <DeleteDialogWindow {...props} />
    </Toast>
  );
}

function DeleteDialogWindow(props: DeleteDialogProps) {
  const { defaultOpen, size } = props;
  const TOAST_TTL = 1000 * 2; // 2s
  const toast = Toast.useToast();

  return (
    <Dialog defaultOpen={defaultOpen}>
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
    </Dialog>
  );
}

export const Default: Story = {
  render: () => <DeleteDialog />,
};

/** `size` sets the window's maximum width. */
export const Medium: Story = {
  render: () => <DeleteDialog size="md" />,
};

/**
 * The dialog is portaled to `<body>`, yet keeps the theme of the subtree it
 * was opened from: a dark section on a light page opens a dark dialog (ADR-006).
 */
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
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>Edit profile</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>Controlled from the story state.</Dialog.Description>
            <Dialog.Actions>
              <Dialog.Close>Done</Dialog.Close>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog>
      </Stack>
    );
  },
};
