import '@testing-library/jest-dom/vitest';
import { useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../ThemeProvider';
import { buttonVariant } from '../../Atoms/Button/Button.style';
import Tooltip from './Tooltip';
import { tooltipPopupCss } from './Tooltip.style';

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

// Base UI's tooltip is visual-only (no role or aria-describedby), so the popup
// is found by its text and the trigger keeps its own accessible name.
function renderTooltip(props: Partial<React.ComponentProps<typeof Tooltip>> = {}) {
  return render(
    <Tooltip {...props}>
      <Tooltip.Trigger variant="ghost" aria-label="Save" delay={0} closeDelay={0}>
        S
      </Tooltip.Trigger>
      <Tooltip.Content>Save changes</Tooltip.Content>
    </Tooltip>,
  );
}

describe('Tooltip', () => {
  it('renders the trigger as a Cascade Button with its own name', () => {
    renderTooltip();

    const trigger = screen.getByRole('button', { name: 'Save' });
    expectClasses(trigger, buttonVariant({ variant: 'ghost' }));
    expect(screen.queryByText('Save changes')).not.toBeInTheDocument();
  });

  it('opens on hover and closes when the pointer leaves', async () => {
    const user = userEvent.setup();
    renderTooltip();

    const trigger = screen.getByRole('button', { name: 'Save' });
    await user.hover(trigger);
    expect(await screen.findByText('Save changes')).toHaveClass(tooltipPopupCss);

    await user.unhover(trigger);
    await waitFor(() => expect(screen.queryByText('Save changes')).not.toBeInTheDocument());
  });

  it('opens on keyboard focus and closes on Escape', async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();
    expect(await screen.findByText('Save changes')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Save changes')).not.toBeInTheDocument());
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();
    renderTooltip({ disabled: true, onOpenChange: handleOpenChange });

    await user.hover(screen.getByRole('button', { name: 'Save' }));

    expect(handleOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Save changes')).not.toBeInTheDocument();
  });

  it('works controlled and reports open changes', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Tooltip
          open={open}
          onOpenChange={(nextOpen) => {
            handleOpenChange(nextOpen);
            setOpen(nextOpen);
          }}
        >
          <Tooltip.Trigger aria-label="Save" delay={0}>
            S
          </Tooltip.Trigger>
          <Tooltip.Content>Save changes</Tooltip.Content>
        </Tooltip>
      );
    }

    render(<Controlled />);

    await user.hover(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Save changes')).toBeInTheDocument();
    expect(handleOpenChange).toHaveBeenLastCalledWith(true);
  });

  describe('theming through the portal (ADR-006)', () => {
    it('keeps a dark subtree dark inside a light page', () => {
      const { container } = render(
        <ThemeProvider initialMode="light">
          <ThemeProvider initialMode="dark">
            <Tooltip defaultOpen>
              <Tooltip.Trigger aria-label="Save">S</Tooltip.Trigger>
              <Tooltip.Content>Save changes</Tooltip.Content>
            </Tooltip>
          </ThemeProvider>
        </ThemeProvider>,
      );

      const popup = screen.getByText('Save changes');
      expect(container).not.toContainElement(popup);
      expect(popup.closest('[data-theme]')).toHaveAttribute('data-theme', 'dark');
    });
  });
});
