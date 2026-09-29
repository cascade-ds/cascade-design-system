import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../ThemeProvider';
import Toast from './Toast';
import type { ToastOptions } from './Toast';
import { toastVariant } from './Toast.style';

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

function ShowToast(props: { options: ToastOptions }) {
  const toast = Toast.useToast();

  return (
    <button type="button" onClick={() => toast.add(props.options)}>
      Save
    </button>
  );
}

function renderToast(
  options: ToastOptions,
  toastProps: Partial<React.ComponentProps<typeof Toast>> = {},
) {
  return render(
    <Toast {...toastProps}>
      <ShowToast options={options} />
    </Toast>,
  );
}

function toastNamed(title: string) {
  return screen.getByRole('dialog', { name: title });
}

describe('Toast', () => {
  it('shows a toast with title and description', async () => {
    const user = userEvent.setup();
    renderToast({ title: 'Saved', description: 'Your changes are live.' });

    await user.click(screen.getByRole('button', { name: 'Save' }));

    const toast = await screen.findByRole('dialog', { name: 'Saved' });
    expect(toast).toHaveTextContent('Your changes are live.');
    expectClasses(toastNamed('Saved'), toastVariant({ tone: 'neutral' }));
  });

  it.each(['info', 'success', 'warning', 'danger'] as const)(
    'applies the %s tone classes',
    async (tone) => {
      const user = userEvent.setup();
      renderToast({ title: 'Message', tone });

      await user.click(screen.getByRole('button', { name: 'Save' }));

      // High-priority (danger) toasts are an aria-hidden alertdialog until focused: Base UI announces them through its own live region.
      const toast = await screen.findByRole(tone === 'danger' ? 'alertdialog' : 'dialog', {
        hidden: true,
      });
      expect(toast).toHaveTextContent('Message');
      expectClasses(toast, toastVariant({ tone }));
    },
  );

  it('closes from the dismiss button', async () => {
    const user = userEvent.setup();
    renderToast({ title: 'Saved' }, { dismissLabel: 'Dismiss notification' });

    await user.click(screen.getByRole('button', { name: 'Save' }));
    // Base UI hides the close button from assistive tech until the viewport is hovered or focused.
    await user.click(await screen.findByLabelText('Dismiss notification'));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('renders an action button that calls its handler', async () => {
    const user = userEvent.setup();
    const handleUndo = vi.fn();
    renderToast({ title: 'Deleted', action: { label: 'Undo', onClick: handleUndo } });

    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(await screen.findByRole('button', { name: 'Undo' }));

    expect(handleUndo).toHaveBeenCalledTimes(1);
  });

  it('auto-dismisses after the timeout and calls onClose', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    renderToast({ title: 'Saved', timeout: 50, onClose: handleClose });

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByRole('dialog', { name: 'Saved' })).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(handleClose).toHaveBeenCalled();
  });

  it('shows toasts from a manager created outside React', async () => {
    const manager = Toast.createManager();
    render(
      <Toast manager={manager}>
        <p>App</p>
      </Toast>,
    );

    act(() => {
      manager.add({ title: 'Upload finished', tone: 'success' });
    });

    expect(await screen.findByRole('dialog', { name: 'Upload finished' })).toBeInTheDocument();

    act(() => {
      manager.close();
    });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  describe('theming through the portal (ADR-006)', () => {
    it('keeps a dark subtree dark inside a light page', async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider initialMode="light">
          <ThemeProvider initialMode="dark">
            <Toast>
              <ShowToast options={{ title: 'Saved' }} />
            </Toast>
          </ThemeProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByRole('button', { name: 'Save' }));

      const toast = await screen.findByRole('dialog', { name: 'Saved' });
      expect(toast.closest('[data-theme]')).toHaveAttribute('data-theme', 'dark');
    });
  });
});
