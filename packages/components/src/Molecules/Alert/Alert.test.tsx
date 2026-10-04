import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Alert from './Alert';
import { alertTitleCss, alertVariant } from './Alert.style';

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

const tones = ['info', 'success', 'warning', 'danger'] as const;

describe('Alert', () => {
  it('renders title and description, as a polite status by default', () => {
    render(
      <Alert.Root>
        <Alert.Title>Update available</Alert.Title>
        <Alert.Description>Restart to apply it.</Alert.Description>
      </Alert.Root>,
    );

    const alert = screen.getByRole('status');
    expect(alert).toHaveTextContent('Update available');
    expect(alert).toHaveTextContent('Restart to apply it.');
    expect(screen.getByText('Update available')).toHaveClass(alertTitleCss);
    expectClasses(alert, alertVariant({ tone: 'info', layout: 'inline' }));
  });

  it.each([
    ['info', 'status'],
    ['success', 'status'],
    ['warning', 'alert'],
    ['danger', 'alert'],
  ] as const)('%s tone uses role="%s"', (tone, role) => {
    render(<Alert.Root tone={tone}>Message</Alert.Root>);

    expect(screen.getByRole(role)).toHaveTextContent('Message');
  });

  it('lets an explicit role override the tone default', () => {
    render(
      <Alert.Root tone="danger" role="note">
        Static note
      </Alert.Root>,
    );

    expect(screen.getByRole('note')).toHaveTextContent('Static note');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each(tones)('applies the %s tone classes', (tone) => {
    render(<Alert.Root tone={tone}>Message</Alert.Root>);

    expectClasses(screen.getByText('Message').parentElement!, alertVariant({ tone }));
  });

  it('applies the banner layout classes', () => {
    render(<Alert.Root layout="banner">Maintenance tonight</Alert.Root>);

    expectClasses(screen.getByRole('status'), alertVariant({ layout: 'banner' }));
  });

  it('renders no icon unless one is passed, and hides it from assistive technology', () => {
    const { container, rerender } = render(<Alert.Root>Message</Alert.Root>);
    expect(container.querySelector('svg')).not.toBeInTheDocument();

    rerender(<Alert.Root icon={<svg data-testid="custom" />}>Message</Alert.Root>);
    expect(screen.getByTestId('custom').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no dismiss button unless onDismiss is set', () => {
    render(<Alert.Root>Message</Alert.Root>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onDismiss from a labelled dismiss button', async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn();

    render(
      <Alert.Root onDismiss={handleDismiss} dismissLabel="Dismiss update notice">
        Message
      </Alert.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'Dismiss update notice' }));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
