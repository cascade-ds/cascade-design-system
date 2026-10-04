import '@testing-library/jest-dom/vitest';
import { createRef, useState } from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Switch from './Switch';
import { switchIconCss, switchIconOffCss, switchIconOnCss, switchVariant } from './Switch.style';

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

describe('Switch', () => {
  it('renders a native checkbox exposed as a switch, named by its children', () => {
    render(<Switch.Root>Notifications</Switch.Root>);

    const toggle = screen.getByRole('switch', { name: 'Notifications' });
    expect(toggle.tagName).toBe('INPUT');
    expect(toggle).toHaveAttribute('type', 'checkbox');
    expect(toggle).not.toBeChecked();
  });

  it('wraps itself in a label only when it has children', () => {
    const { container, rerender } = render(<Switch.Root>Notifications</Switch.Root>);
    expect(container.firstElementChild?.tagName).toBe('LABEL');

    rerender(<Switch.Root aria-label="Notifications" />);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });

  it('can be named with aria-label', () => {
    render(<Switch.Root aria-label="Dark mode" />);

    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
  });

  it('can be named by an external label via id + htmlFor', () => {
    render(
      <>
        <label htmlFor="wifi">Wi-Fi</label>
        <Switch.Root id="wifi" />
      </>,
    );

    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeInTheDocument();
  });

  it('applies the default variant classes to the root', () => {
    const { container } = render(<Switch.Root>Notifications</Switch.Root>);

    expectClasses(container.firstElementChild as HTMLElement, switchVariant({ disabled: false }));
  });

  it('applies the disabled variant class to the root when disabled', () => {
    const { container } = render(<Switch.Root disabled>Notifications</Switch.Root>);

    expectClasses(container.firstElementChild as HTMLElement, switchVariant({ disabled: true }));
  });

  it('merges a consumer className onto the root', () => {
    const { container } = render(<Switch.Root className="custom">Notifications</Switch.Root>);

    expect(container.firstElementChild).toHaveClass('custom');
  });

  it('toggles when clicked (uncontrolled) and fires onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Switch.Root onChange={handleChange}>Notifications</Switch.Root>);
    const toggle = screen.getByRole('switch', { name: 'Notifications' });

    await user.click(toggle);
    expect(toggle).toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(1);

    await user.click(toggle);
    expect(toggle).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('toggles when its label text is clicked', async () => {
    const user = userEvent.setup();

    render(<Switch.Root>Notifications</Switch.Root>);

    await user.click(screen.getByText('Notifications'));
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked();
  });

  it('respects defaultChecked', () => {
    render(<Switch.Root defaultChecked>Notifications</Switch.Root>);

    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked();
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [checked, setChecked] = useState(false);
      return (
        <>
          <Switch.Root checked={checked} onChange={(event) => setChecked(event.target.checked)}>
            Notifications
          </Switch.Root>
          <output>{checked ? 'on' : 'off'}</output>
        </>
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('switch', { name: 'Notifications' }));
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('on');
  });

  it('does not toggle or fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Switch.Root disabled onChange={handleChange}>
        Notifications
      </Switch.Root>,
    );
    const toggle = screen.getByRole('switch', { name: 'Notifications' });

    await user.click(toggle);
    expect(toggle).toBeDisabled();
    expect(toggle).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('is reachable by keyboard and toggles with Space', async () => {
    const user = userEvent.setup();

    render(<Switch.Root>Notifications</Switch.Root>);

    await user.tab();
    const toggle = screen.getByRole('switch', { name: 'Notifications' });
    expect(toggle).toHaveFocus();

    await user.keyboard(' ');
    expect(toggle).toBeChecked();
  });

  it('renders no icon by default', () => {
    render(<Switch.Root>Dark mode</Switch.Root>);

    const thumb = screen.getByRole('switch', { name: 'Dark mode' }).nextElementSibling!;
    expect(thumb).toBeEmptyDOMElement();
  });

  it('renders Switch.IconOn and Switch.IconOff inside the thumb, not in the label', () => {
    render(
      <Switch.Root>
        <Switch.IconOn>
          <MoonIcon />
        </Switch.IconOn>
        <Switch.IconOff>
          <SunIcon />
        </Switch.IconOff>
        Dark mode
      </Switch.Root>,
    );

    const thumb = screen.getByRole('switch', { name: 'Dark mode' }).nextElementSibling!;
    const [iconOn, iconOff] = Array.from(thumb.children);
    expect(iconOn).toHaveClass(switchIconCss, switchIconOnCss);
    expect(iconOff).toHaveClass(switchIconCss, switchIconOffCss);
    expect(iconOn).toHaveAttribute('aria-hidden', 'true');
    expect(iconOff).toHaveAttribute('aria-hidden', 'true');
  });

  it('finds icons passed inside a fragment', () => {
    const { container } = render(
      <Switch.Root aria-label="Dark mode">
        <>
          <Switch.IconOn>
            <MoonIcon />
          </Switch.IconOn>
          <Switch.IconOff>
            <SunIcon />
          </Switch.IconOff>
        </>
      </Switch.Root>,
    );

    const thumb = screen.getByRole('switch', { name: 'Dark mode' }).nextElementSibling!;
    expect(thumb.children).toHaveLength(2);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });

  it('does not wrap itself in a label when its only children are icons', () => {
    const { container } = render(
      <Switch.Root aria-label="Dark mode">
        <Switch.IconOn>
          <MoonIcon />
        </Switch.IconOn>
      </Switch.Root>,
    );

    expect(container.firstElementChild?.tagName).toBe('SPAN');
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
  });

  it('forwards its ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Switch.Root ref={ref}>Notifications</Switch.Root>);

    expect(ref.current).toBe(screen.getByRole('switch', { name: 'Notifications' }));
  });
});

describe('Switch colors', () => {
  it('applies the class for a color variant', () => {
    render(<Switch.Root color="success">Notifications</Switch.Root>);

    expect(screen.getByRole('switch').closest('label')).toHaveClass(
      switchVariant({ disabled: false, color: 'success' }),
    );
  });
});
