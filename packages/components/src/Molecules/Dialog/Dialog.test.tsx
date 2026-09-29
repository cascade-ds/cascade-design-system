import '@testing-library/jest-dom/vitest';
import { useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../ThemeProvider';
import { buttonVariant } from '#/Atoms/Button/Button.style';
import Dialog from './Dialog';
import { dialogPopupVariant, dialogTitleCss } from './Dialog.style';

afterEach(() => {
  cleanup();
});

function expectClasses(element: HTMLElement, className: string) {
  className
    .split(' ')
    .filter(Boolean)
    .forEach((name) => {
      expect(element).toHaveClass(name);
    });
}

function renderDialog(
  props: Partial<React.ComponentProps<typeof Dialog>> = {},
  contentProps: Partial<React.ComponentProps<typeof Dialog.Content>> = {},
) {
  return render(
    <Dialog {...props}>
      <Dialog.Trigger variant="secondary">Delete project</Dialog.Trigger>
      <Dialog.Content {...contentProps}>
        <Dialog.Title>Delete project?</Dialog.Title>
        <Dialog.Description>This removes the project for everyone.</Dialog.Description>
        <Dialog.Actions>
          <Dialog.Close variant="ghost">Cancel</Dialog.Close>
        </Dialog.Actions>
      </Dialog.Content>
    </Dialog>,
  );
}

describe('Dialog', () => {
  it('renders the trigger as a Cascade Button with its variant classes', () => {
    renderDialog();

    const trigger = screen.getByRole('button', { name: 'Delete project' });
    expectClasses(trigger, buttonVariant({ variant: 'secondary' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on trigger click as a modal dialog named by its title', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Delete project' }));

    const dialog = screen.getByRole('dialog', { name: 'Delete project?' });
    expect(dialog).toHaveAccessibleDescription('This removes the project for everyone.');
    // Modal: the page behind is hidden from assistive technology.
    expect(screen.queryByRole('button', { name: 'Delete project' })).not.toBeInTheDocument();
    expectClasses(dialog, dialogPopupVariant());
    expect(screen.getByText('Delete project?')).toHaveClass(dialogTitleCss);
  });

  it.each(['sm', 'md'] as const)('applies the %s size classes', (size) => {
    renderDialog({ defaultOpen: true }, { size });

    expectClasses(screen.getByRole('dialog'), dialogPopupVariant({ size }));
  });

  it('moves focus into the dialog when it opens', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Delete project' }));

    await waitFor(() =>
      expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement),
    );
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderDialog();

    const trigger = screen.getByRole('button', { name: 'Delete project' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('closes with Dialog.Close', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('works controlled and reports open changes', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog
          open={open}
          onOpenChange={(nextOpen) => {
            handleOpenChange(nextOpen);
            setOpen(nextOpen);
          }}
        >
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog>
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(handleOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(handleOpenChange).toHaveBeenLastCalledWith(false);
  });

  describe('theming through the portal (ADR-006)', () => {
    it('keeps a dark subtree dark inside a light page', () => {
      const { container } = render(
        <ThemeProvider initialMode="light">
          <ThemeProvider initialMode="dark">
            <Dialog defaultOpen>
              <Dialog.Trigger>Open</Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Title>Settings</Dialog.Title>
              </Dialog.Content>
            </Dialog>
          </ThemeProvider>
        </ThemeProvider>,
      );

      const dialog = screen.getByRole('dialog', { name: 'Settings' });
      expect(container).not.toContainElement(dialog);
      expect(dialog.closest('[data-theme]')).toHaveAttribute('data-theme', 'dark');
    });
  });
});
