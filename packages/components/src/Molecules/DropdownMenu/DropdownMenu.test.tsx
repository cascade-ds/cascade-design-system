import '@testing-library/jest-dom/vitest';
import { useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../ThemeProvider';
import { buttonVariant } from '../../Atoms/Button/Button.style';
import * as DropdownMenu from './DropdownMenu';
import { dropdownMenuItemVariant, dropdownMenuPopupCss } from './DropdownMenu.style';

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

function renderMenu(
  props: Partial<React.ComponentProps<typeof DropdownMenu>> = {},
  handlers: { onRename?: () => void; onDelete?: () => void } = {},
) {
  return render(
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger variant="secondary">Actions</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.GroupLabel>File</DropdownMenu.GroupLabel>
          <DropdownMenu.Item onClick={handlers.onRename}>Rename</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Move</DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="danger" onClick={handlers.onDelete}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>,
  );
}

describe('DropdownMenu', () => {
  it('renders the trigger as a Cascade Button that controls a menu', () => {
    renderMenu();

    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expectClasses(trigger, buttonVariant({ variant: 'secondary' }));
  });

  it('opens a menu with items, a named group and a separator', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    const menu = await screen.findByRole('menu');
    expect(menu).toHaveClass(dropdownMenuPopupCss);
    expect(screen.getByRole('group', { name: 'File' })).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('applies the item variant classes', () => {
    renderMenu({ defaultOpen: true });

    expectClasses(screen.getByRole('menuitem', { name: 'Rename' }), dropdownMenuItemVariant());
    expectClasses(
      screen.getByRole('menuitem', { name: 'Delete' }),
      dropdownMenuItemVariant({ variant: 'danger' }),
    );
  });

  it('runs the item action and closes on click', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    renderMenu({}, { onRename });

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Rename' }));

    expect(onRename).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('marks disabled items and ignores clicks on them', async () => {
    const user = userEvent.setup();
    renderMenu({ defaultOpen: true });

    const move = screen.getByRole('menuitem', { name: 'Move' });
    expect(move).toHaveAttribute('aria-disabled', 'true');

    await user.click(move);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('is keyboard operable and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderMenu({}, { onDelete });

    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.keyboard('{End}{Enter}');
    expect(onDelete).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());

    await user.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('works controlled and reports open changes', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <DropdownMenu.Root
          open={open}
          onOpenChange={(nextOpen) => {
            handleOpenChange(nextOpen);
            setOpen(nextOpen);
          }}
        >
          <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Rename</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(handleOpenChange).toHaveBeenLastCalledWith(true);
  });

  describe('theming through the portal (ADR-006)', () => {
    it('keeps a dark subtree dark inside a light page', () => {
      const { container } = render(
        <ThemeProvider initialMode="light">
          <ThemeProvider initialMode="dark">
            <DropdownMenu.Root defaultOpen>
              <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Rename</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </ThemeProvider>
        </ThemeProvider>,
      );

      const menu = screen.getByRole('menu');
      expect(container).not.toContainElement(menu);
      expect(menu.closest('[data-theme]')).toHaveAttribute('data-theme', 'dark');
    });
  });
});
