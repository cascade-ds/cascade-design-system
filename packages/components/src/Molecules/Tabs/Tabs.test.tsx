import '@testing-library/jest-dom/vitest';
import { useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Tabs from './Tabs';
import { tabsListCss, tabsPanelCss, tabsTabCss } from './Tabs.style';

afterEach(() => {
  cleanup();
});

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return render(
    <Tabs.Root defaultValue="overview" {...props}>
      <Tabs.List aria-label="Project">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings" disabled>
          Settings
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="activity">Activity content</Tabs.Panel>
      <Tabs.Panel value="settings">Settings content</Tabs.Panel>
    </Tabs.Root>,
  );
}

describe('Tabs', () => {
  it('renders a named tablist with tabs and the active panel', () => {
    renderTabs();

    const list = screen.getByRole('tablist', { name: 'Project' });
    expect(list).toHaveClass(tabsListCss);

    const overview = screen.getByRole('tab', { name: 'Overview' });
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(overview).toHaveClass(tabsTabCss);
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'false');

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveTextContent('Overview content');
    expect(panel).toHaveClass(tabsPanelCss);
    expect(panel).toHaveAccessibleName('Overview');
  });

  it('shows another panel on click', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole('tab', { name: 'Activity' }));

    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity content');
  });

  it('moves focus with arrow keys and activates with Enter', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.tab();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    const activity = screen.getByRole('tab', { name: 'Activity' });
    expect(activity).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(activity).toHaveAttribute('aria-selected', 'true');
  });

  it('does not activate a disabled tab', async () => {
    const user = userEvent.setup();
    renderTabs();

    const settings = screen.getByRole('tab', { name: 'Settings' });
    expect(settings).toHaveAttribute('aria-disabled', 'true');

    await user.click(settings);
    expect(settings).toHaveAttribute('aria-selected', 'false');
  });

  it('works controlled and reports value changes', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState<string | number>('overview');
      return (
        <Tabs.Root
          value={value}
          onValueChange={(nextValue) => {
            handleValueChange(nextValue);
            setValue(nextValue);
          }}
        >
          <Tabs.List aria-label="Project">
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">Overview content</Tabs.Panel>
          <Tabs.Panel value="activity">Activity content</Tabs.Panel>
        </Tabs.Root>
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(handleValueChange).toHaveBeenLastCalledWith('activity');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity content');
  });
});
