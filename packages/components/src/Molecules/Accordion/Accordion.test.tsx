import '@testing-library/jest-dom/vitest';
import { useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Accordion from './Accordion';
import { accordionCss, accordionItemCss, accordionTriggerCss } from './Accordion.style';

afterEach(() => {
  cleanup();
});

function renderAccordion(props: Partial<React.ComponentProps<typeof Accordion>> = {}) {
  return render(
    <Accordion {...props}>
      <Accordion.Item value="billing">
        <Accordion.Trigger>Billing</Accordion.Trigger>
        <Accordion.Panel>Billing content</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="security">
        <Accordion.Trigger>Security</Accordion.Trigger>
        <Accordion.Panel>Security content</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="legacy" disabled>
        <Accordion.Trigger>Legacy</Accordion.Trigger>
        <Accordion.Panel>Legacy content</Accordion.Panel>
      </Accordion.Item>
    </Accordion>,
  );
}

describe('Accordion', () => {
  it('renders each trigger as a button inside a level 3 heading', () => {
    const { container } = renderAccordion();

    expect(container.firstChild).toHaveClass(accordionCss);
    const heading = screen.getByRole('heading', { level: 3, name: 'Billing' });
    const trigger = screen.getByRole('button', { name: 'Billing' });
    expect(heading).toContainElement(trigger);
    expect(trigger).toHaveClass(accordionTriggerCss);
    expect(trigger.closest(`.${accordionItemCss}`)).not.toBeNull();
  });

  it('uses the given heading level', () => {
    render(
      <Accordion>
        <Accordion.Item>
          <Accordion.Trigger headingLevel={2}>Billing</Accordion.Trigger>
          <Accordion.Panel>Billing content</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Billing' })).toBeInTheDocument();
  });

  it('starts closed and opens a panel on click', async () => {
    const user = userEvent.setup();
    renderAccordion();

    const trigger = screen.getByRole('button', { name: 'Billing' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Billing content')).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Billing content')).toBeVisible();
  });

  it('opens the items in defaultValue', () => {
    renderAccordion({ defaultValue: ['security'] });

    expect(screen.getByRole('button', { name: 'Security' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Security content')).toBeInTheDocument();
  });

  it('closes the open item when another opens, unless multiple', async () => {
    const user = userEvent.setup();
    const { unmount } = renderAccordion({ defaultValue: ['billing'] });

    await user.click(screen.getByRole('button', { name: 'Security' }));
    expect(screen.getByRole('button', { name: 'Billing' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    unmount();

    renderAccordion({ defaultValue: ['billing'], multiple: true });
    await user.click(screen.getByRole('button', { name: 'Security' }));
    expect(screen.getByRole('button', { name: 'Billing' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Security' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('toggles with Enter and Space', async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Billing' });
    expect(trigger).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not open a disabled item', async () => {
    const user = userEvent.setup();
    renderAccordion();

    const trigger = screen.getByRole('button', { name: 'Legacy' });
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('works controlled and reports value changes', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState<(string | number)[]>([]);
      return (
        <Accordion
          value={value}
          onValueChange={(nextValue) => {
            handleValueChange(nextValue);
            setValue(nextValue);
          }}
        >
          <Accordion.Item value="billing">
            <Accordion.Trigger>Billing</Accordion.Trigger>
            <Accordion.Panel>Billing content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('button', { name: 'Billing' }));
    expect(handleValueChange).toHaveBeenLastCalledWith(['billing']);
    expect(screen.getByText('Billing content')).toBeInTheDocument();
  });
});
