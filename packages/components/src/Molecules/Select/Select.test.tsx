import '@testing-library/jest-dom/vitest';
import { useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '@/ThemeProvider';
import FormField from '@/Molecules/FormField/FormField';
import Select from './Select';
import type { SelectProps } from './Select';
import {
  selectItemCss,
  selectPopupCss,
  selectSeparatorCss,
  selectTriggerVariant,
} from './Select.style';

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

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

function renderSelect(
  props: Partial<SelectProps<string>> = {},
  triggerProps: Partial<React.ComponentProps<typeof Select.Trigger>> = {},
) {
  return render(
    <Select items={fruits} {...props}>
      <Select.Label>Fruit</Select.Label>
      <Select.Trigger placeholder="Pick a fruit" {...triggerProps} />
      <Select.Content>
        {fruits.map((fruit) => (
          <Select.Item key={fruit.value} value={fruit.value}>
            {fruit.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>,
  );
}

describe('Select', () => {
  it('renders a combobox trigger named by its label, showing the placeholder', () => {
    renderSelect();

    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveTextContent('Pick a fruit');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('applies the default trigger classes with no size', () => {
    renderSelect();

    expectClasses(screen.getByRole('combobox', { name: 'Fruit' }), selectTriggerVariant());
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the class for the %s trigger size', (size) => {
    renderSelect({}, { size });

    expectClasses(screen.getByRole('combobox', { name: 'Fruit' }), selectTriggerVariant({ size }));
  });

  it('opens a listbox of options on click', async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));

    const listbox = await screen.findByRole('listbox');
    expect(listbox.closest(`.${selectPopupCss}`)).not.toBeNull();
    const options = screen.getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual(['Apple', 'Banana', 'Cherry']);
    expect(options[0]).toHaveClass(selectItemCss);
  });

  it('selects an option, shows its label and reports the value', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    renderSelect({ onValueChange: handleValueChange });

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.click(await screen.findByRole('option', { name: 'Banana' }));

    expect(handleValueChange).toHaveBeenCalledWith('banana', expect.anything());
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Banana');
  });

  it('marks the selected option', async () => {
    const user = userEvent.setup();
    renderSelect({ defaultValue: 'cherry' });

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Cherry');
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));

    expect(await screen.findByRole('option', { name: 'Cherry' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderSelect();

    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    await user.click(trigger);
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('works controlled', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState<string | null>('apple');
      return (
        <>
          <Select items={fruits} value={value} onValueChange={setValue}>
            <Select.Trigger aria-label="Fruit" />
            <Select.Content>
              {fruits.map((fruit) => (
                <Select.Item key={fruit.value} value={fruit.value}>
                  {fruit.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <output>{value}</output>
        </>
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.click(await screen.findByRole('option', { name: 'Cherry' }));
    expect(screen.getByRole('status')).toHaveTextContent('cherry');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    renderSelect({ disabled: true });

    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    await user.click(trigger);

    expect(trigger).toHaveAttribute('data-disabled');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders groups named by their label, and separators', async () => {
    render(
      <Select defaultOpen>
        <Select.Trigger aria-label="Food" />
        <Select.Content>
          <Select.Group>
            <Select.GroupLabel>Fruit</Select.GroupLabel>
            <Select.Item value="apple">Apple</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.GroupLabel>Vegetables</Select.GroupLabel>
            <Select.Item value="kale">Kale</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>,
    );

    await screen.findByRole('listbox');
    expect(screen.getByRole('group', { name: 'Fruit' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Vegetables' })).toBeInTheDocument();
    // Base UI renders it presentational: the groups already split the list.
    expect(document.querySelector(`.${selectSeparatorCss}`)).toHaveAttribute(
      'role',
      'presentation',
    );
  });

  describe('inside a FormField', () => {
    it('is named by the field label and described by its hint and error', () => {
      render(
        <FormField invalid>
          <FormField.Label>Fruit</FormField.Label>
          <Select items={fruits}>
            <Select.Trigger placeholder="Pick a fruit" />
            <Select.Content>
              {fruits.map((fruit) => (
                <Select.Item key={fruit.value} value={fruit.value}>
                  {fruit.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <FormField.Hint>Used for the smoothie.</FormField.Hint>
          <FormField.Error>Pick a fruit.</FormField.Error>
        </FormField>,
      );

      const trigger = screen.getByRole('combobox', { name: 'Fruit' });
      expect(trigger).toHaveAttribute('aria-invalid', 'true');
      expect(trigger).toHaveAccessibleDescription(
        expect.stringContaining('Used for the smoothie.'),
      );
      expect(trigger).toHaveAccessibleDescription(expect.stringContaining('Pick a fruit.'));
    });

    it("takes the field's disabled state", () => {
      render(
        <FormField disabled>
          <FormField.Label>Fruit</FormField.Label>
          <Select items={fruits}>
            <Select.Trigger placeholder="Pick a fruit" />
            <Select.Content>
              <Select.Item value="apple">Apple</Select.Item>
            </Select.Content>
          </Select>
        </FormField>,
      );

      expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveAttribute('data-disabled');
    });
  });

  describe('theming through the portal (ADR-006)', () => {
    it('keeps a dark subtree dark inside a light page', async () => {
      render(
        <ThemeProvider initialMode="light">
          <ThemeProvider initialMode="dark">
            <Select items={fruits} defaultOpen>
              <Select.Trigger aria-label="Fruit" />
              <Select.Content>
                <Select.Item value="apple">Apple</Select.Item>
              </Select.Content>
            </Select>
          </ThemeProvider>
        </ThemeProvider>,
      );

      const listbox = await screen.findByRole('listbox');
      expect(listbox.closest('[data-theme]')).toHaveAttribute('data-theme', 'dark');
    });
  });
});
