import '@testing-library/jest-dom/vitest';
import { useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../ThemeProvider';
import { buttonVariant } from '../../Atoms/Button/Button.style';
import Popover from './Popover';
import { popoverPopupCss, popoverTitleCss } from './Popover.style';

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

function renderPopover(props: Partial<React.ComponentProps<typeof Popover>> = {}) {
  return render(
    <Popover {...props}>
      <Popover.Trigger variant="secondary">Filters</Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Filter results</Popover.Title>
        <Popover.Description>Narrow the table by status.</Popover.Description>
        <Popover.Close variant="ghost" size="sm">
          Done
        </Popover.Close>
      </Popover.Content>
    </Popover>,
  );
}

describe('Popover', () => {
  it('renders the trigger as a Cascade Button with its variant classes', () => {
    renderPopover();

    const trigger = screen.getByRole('button', { name: 'Filters' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expectClasses(trigger, buttonVariant({ variant: 'secondary' }));
  });

  it('opens on trigger click as a dialog named by its title', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole('button', { name: 'Filters' }));

    const popup = screen.getByRole('dialog', { name: 'Filter results' });
    expect(popup).toHaveAccessibleDescription('Narrow the table by status.');
    expect(popup).toHaveClass(popoverPopupCss);
    expect(screen.getByText('Filter results')).toHaveClass(popoverTitleCss);
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderPopover();

    const trigger = screen.getByRole('button', { name: 'Filters' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('closes with Popover.Close', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('button', { name: 'Done' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes on an outside click', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(document.body);

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('works controlled and reports open changes', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Popover
          open={open}
          onOpenChange={(nextOpen) => {
            handleOpenChange(nextOpen);
            setOpen(nextOpen);
          }}
        >
          <Popover.Trigger>Filters</Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Filter results</Popover.Title>
          </Popover.Content>
        </Popover>
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(handleOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('dialog', { name: 'Filter results' })).toBeInTheDocument();
  });

  it('renders open with defaultOpen', () => {
    renderPopover({ defaultOpen: true });

    expect(screen.getByRole('dialog', { name: 'Filter results' })).toBeInTheDocument();
  });

  describe('theming through the portal (ADR-006)', () => {
    it('portals to document.body, outside the provider element', () => {
      const { container } = render(
        <ThemeProvider initialMode="dark">
          <Popover defaultOpen>
            <Popover.Trigger>Filters</Popover.Trigger>
            <Popover.Content>
              <Popover.Title>Filter results</Popover.Title>
            </Popover.Content>
          </Popover>
        </ThemeProvider>,
      );

      const popup = screen.getByRole('dialog', { name: 'Filter results' });
      expect(container).not.toContainElement(popup);
    });

    it('keeps a dark subtree dark inside a light page', () => {
      render(
        <ThemeProvider initialMode="light">
          <ThemeProvider initialMode="dark">
            <Popover defaultOpen>
              <Popover.Trigger>Filters</Popover.Trigger>
              <Popover.Content>
                <Popover.Title>Filter results</Popover.Title>
              </Popover.Content>
            </Popover>
          </ThemeProvider>
        </ThemeProvider>,
      );

      const popup = screen.getByRole('dialog', { name: 'Filter results' });
      expect(popup.closest('[data-theme]')).toHaveAttribute('data-theme', 'dark');
    });
  });
});
