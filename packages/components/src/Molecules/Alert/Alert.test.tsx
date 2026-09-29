import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Alert from './Alert';
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
      <Alert>
        <Alert.Title>Update available</Alert.Title>
        <Alert.Description>Restart to apply it.</Alert.Description>
      </Alert>,
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
    render(<Alert tone={tone}>Message</Alert>);

    expect(screen.getByRole(role)).toHaveTextContent('Message');
  });

  it('lets an explicit role override the tone default', () => {
    render(
      <Alert tone="danger" role="note">
        Static note
      </Alert>,
    );

    expect(screen.getByRole('note')).toHaveTextContent('Static note');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each(tones)('applies the %s tone classes', (tone) => {
    render(<Alert tone={tone}>Message</Alert>);

    expectClasses(screen.getByText('Message').parentElement!, alertVariant({ tone }));
  });

  it('applies the banner layout classes', () => {
    render(<Alert layout="banner">Maintenance tonight</Alert>);

    expectClasses(screen.getByRole('status'), alertVariant({ layout: 'banner' }));
  });

  it('renders a decorative tone icon, or none with icon={null}', () => {
    const { container, rerender } = render(<Alert>Message</Alert>);
    expect(container.querySelector('[aria-hidden="true"] svg')).toBeInTheDocument();

    rerender(<Alert icon={null}>Message</Alert>);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('has no dismiss button unless onDismiss is set', () => {
    render(<Alert>Message</Alert>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onDismiss from a labelled dismiss button', async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn();

    render(
      <Alert onDismiss={handleDismiss} dismissLabel="Dismiss update notice">
        Message
      </Alert>,
    );

    await user.click(screen.getByRole('button', { name: 'Dismiss update notice' }));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
